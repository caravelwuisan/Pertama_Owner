import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './AssistantDrawer.css';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssistantDrawer: React.FC<AssistantDrawerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setInputValue((prev) => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Fetch initial messages on load
  useEffect(() => {
    if (user && isOpen && messages.length === 0) {
      fetchHistory();
    }
  }, [user, isOpen]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true })
        .limit(50);
        
      if (!error && data) {
        setMessages(data as Message[]);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInputValue(''); // Optional: clear before starting
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if (!isSpeakingEnabled || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Attempt auto-language detection simply by letting the browser decide or we could parse
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Optimistically add user message
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, { id: tempId, role: 'user', content: userMessage }]);

    try {
      const { data: session } = await supabase.auth.getSession();
      
      const response = await fetch(
        '/api/assistant',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.session?.access_token}`
          },
          body: JSON.stringify({ message: userMessage })
        }
      );

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to fetch response');

      const assistantMsg = data.response;
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: assistantMsg }]);
      
      speakText(assistantMsg);
      
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', content: `SERVER ERROR: ${err.message || 'Unknown error occurred.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`assistant-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="header-info">
            <h2 className="text-lg font-bold">AI Assistant</h2>
            <p className="text-xs text-gray-400">Powered by Pertama</p>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => setIsSpeakingEnabled(!isSpeakingEnabled)}
              className={`action-btn ${!isSpeakingEnabled ? 'disabled' : ''}`}
              title={isSpeakingEnabled ? "Mute Voice Responses" : "Enable Voice Responses"}
            >
              {isSpeakingEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button onClick={onClose} className="close-btn action-btn">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="drawer-messages">
          {messages.length === 0 && !isLoading && (
            <div className="empty-state">
              <div className="logo-icon blur-glow mx-auto mb-4" style={{ width: 40, height: 40 }}></div>
              <p>Hello! How can I help you manage your property today?</p>
              <div className="suggested-queries">
                <button onClick={() => setInputValue("Show my latest invoice")}>"Show my latest invoice"</button>
                <button onClick={() => setInputValue("Are there any updates on my villa?")}>"Are there any updates on my villa?"</button>
              </div>
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.role}`}>
              <div className="message-bubble">
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message-wrapper assistant">
              <div className="message-bubble typing">
                <Loader2 size={16} className="animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="drawer-input-area" onSubmit={handleSubmit}>
          <button 
            type="button" 
            onClick={toggleListening}
            className={`mic-btn action-btn ${isListening ? 'listening text-red-400' : ''}`}
            title="Use Voice Typing"
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? "Listening..." : "Ask me anything..."}
            disabled={isLoading}
            className="chat-input"
          />
          
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className="send-btn"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};
