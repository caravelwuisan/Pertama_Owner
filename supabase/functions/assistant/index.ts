import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Verify user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { message, projectId } = await req.json();

    if (!message) {
      throw new Error("Message is required");
    }

    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      throw new Error("OpenAI API key not configured");
    }

    // 1. Generate Embedding for the user's message
    const embeddingRes = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        input: message,
        model: "text-embedding-3-small",
      }),
    });

    const embeddingData = await embeddingRes.json();
    if (!embeddingRes.ok) throw new Error(embeddingData.error?.message || "Failed to generate embedding");
    
    const embedding = embeddingData.data[0].embedding;

    // 2. Query Supabase for matching documents
    const { data: documents, error: matchError } = await supabaseClient.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 5,
      p_user_id: user.id
    });

    if (matchError) {
      console.error("Match error:", matchError);
      throw matchError;
    }

    // Filter by project if specified
    const relevantDocs = projectId 
      ? documents?.filter((d: any) => d.property_id === projectId || d.property_id === null)
      : documents;

    const contextText = relevantDocs?.map((d: any) => d.content).join("\n\n---\n\n") || "No specific documents found.";

    // 3. Prepare Chat Prompt
    const systemPrompt = `You are a helpful and professional property management assistant inside the "Pertama Owner" app.
You answer questions clearly and concisely.
You MUST auto-detect the user's language (English, French, or Indonesian) and reply in the same language.
Use the context below to answer questions about the user's projects, invoices, or updates. If the context does not contain the answer, say that you don't know based on the provided information, but try to be helpful if it's a general question.

CONTEXT:
${contextText}`;

    // Get a bit of recent message history
    const { data: history } = await supabaseClient
      .from("messages")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6);
      
    // Supabase returns newest first, so reverse to chronological
    const pastMessages = (history || []).reverse().map((h) => ({ role: h.role, content: h.content }));

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...pastMessages,
      { role: "user", content: message }
    ];

    // 4. Call OpenAI Chat Completions
    const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: chatMessages,
        temperature: 0.7,
      }),
    });

    const chatData = await chatRes.json();
    if (!chatRes.ok) throw new Error(chatData.error?.message || "Failed to generate chat response");

    const assistantResponse = chatData.choices[0].message.content;

    // 5. Store the conversation in the database
    // We use the service_role client to safely insert messages
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseAdmin.from("messages").insert([
      { user_id: user.id, role: "user", content: message },
      { user_id: user.id, role: "assistant", content: assistantResponse },
    ]);

    // 6. Return the response
    return new Response(JSON.stringify({ response: assistantResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Assistant Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal Server Error" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
