import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const handler = async (event) => {
  // 1. Handle CORS Preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: 'ok',
    };
  }

  try {
    console.log("Assistant function triggered");

    // We must ensure the env vars are available
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase environment variables are missing.");
    }

    if (!openAiKey) {
      throw new Error("OpenAI API key not configured.");
    }

    // Capture the Authorization header sent from the frontend
    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    if (!authHeader) {
      throw new Error("Unauthorized: Missing Authorization header");
    }

    // Initialize Supabase Client with the user's JWT
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // 2. Verify User Authentication
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.error("Auth Verification Error:", authError);
      throw new Error("Unauthorized: Invalid token");
    }

    // 3. Parse Request Body
    const body = JSON.parse(event.body || "{}");
    const { message, projectId } = body;

    if (!message) {
      throw new Error("Message is required in the request body.");
    }

    console.log(`Processing message for user: ${user.id}`);

    // 4. Generate Embedding for the user's message
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
    if (!embeddingRes.ok) {
      console.error("Embedding API Error:", embeddingData);
      throw new Error(embeddingData.error?.message || "Failed to generate embedding");
    }

    const embedding = embeddingData.data[0].embedding;

    // 5. Query Supabase for matching documents via RPC
    const { data: documents, error: matchError } = await supabaseClient.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 5,
      p_user_id: user.id
    });

    if (matchError) {
      console.error("Supabase RPC Match Error:", matchError);
      throw matchError;
    }

    // Filter by specific project if supplied
    const relevantDocs = projectId 
      ? documents?.filter((d) => d.property_id === projectId || d.property_id === null)
      : documents;

    const contextText = relevantDocs?.map((d) => d.content).join("\n\n---\n\n") || "No specific documents found.";

    // 6. Prepare the Chat Prompt
    const systemPrompt = `You are a helpful and professional property management assistant inside the "Pertama Owner" app.
You answer questions clearly and concisely.
You MUST auto-detect the user's language (English, French, or Indonesian) and reply in the same language.
Use the context below to answer questions about the user's projects, invoices, or updates. If the context does not contain the answer, say that you don't know based on the provided information, but try to be helpful if it's a general question.

CONTEXT:
${contextText}`;

    // 7. Get user's recent message history
    const { data: history } = await supabaseClient
      .from("messages")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6);
      
    // Reorder history so newest is at the bottom
    const pastMessages = (history || []).reverse().map((h) => ({ role: h.role, content: h.content }));

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...pastMessages,
      { role: "user", content: message }
    ];

    // 8. Call OpenAI Chat Completions (Using gpt-4o-mini as requested)
    console.log("Calling OpenAI GPT-4o-mini...");
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
    if (!chatRes.ok) {
      console.error("OpenAI Chat Error:", chatData);
      throw new Error(chatData.error?.message || "Failed to generate chat response");
    }

    const assistantResponse = chatData.choices[0].message.content;

    // 9. Store the conversation in the database
    // Use the service role key to insert messages to bypass RLS policies directly,
    // or we can use the user's client if they have INSERT rights.
    // The user has explicit INSERT rights via RLS policy, so we can use supabaseClient
    if (supabaseServiceRole) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);
      await supabaseAdmin.from("messages").insert([
        { user_id: user.id, role: "user", content: message },
        { user_id: user.id, role: "assistant", content: assistantResponse },
      ]);
    } else {
      // Fallback: If no service role, just insert the user message as the user.
      // (The assistant message won't be insertable by the user unless RLS allows it; 
      // however our previous RLS allowed users to insert their own messages, so we just set user_id).
      await supabaseClient.from("messages").insert([
        { user_id: user.id, role: "user", content: message },
        { user_id: user.id, role: "assistant", content: assistantResponse },
      ]);
    }

    // 10. Return the final successful response back to the client
    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ response: assistantResponse }),
    };

  } catch (error) {
    console.error("Netlify Assistant Error Detailed Trace:", {
      message: error?.message,
      stack: error?.stack
    });
    
    return {
      statusCode: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        error: error?.message || "Internal Server Error",
        details: "Check Netlify Function logs for the full trace." 
      })
    };
  }
};
