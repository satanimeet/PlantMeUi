import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sun, 
  Moon, 
  Bot, 
  Leaf, 
  MessageSquare,
  Loader2,
  Camera,
  Image,
  X,
  Upload,
  RotateCcw
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import type { Message, ChatbotMode, ChatbotState } from '../types/chatbot';


import { v4 as uuidv4 } from "uuid";


interface ChatbotProps {
  className?: string;
}

export const Chatbot: React.FC<ChatbotProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [detectedDisease, setDetectedDisease] = useState<string | null>(null);
  const [state, setState] = useState<ChatbotState>({
    messages: [
      {
        id: '1',
        content: 'Hello! I\'m your PlantMe AI assistant. I specialize in plant disease detection. Upload a plant image or describe symptoms to get started.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      }
    ],
    currentMode: 'plant-disease',
    isLoading: false,
    isRecording: false
  });

  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize session ID on client side
  useEffect(() => {
    let currentSessionId = localStorage.getItem("chat_session_id");
    if (!currentSessionId) {
      currentSessionId = uuidv4();
      localStorage.setItem("chat_session_id", currentSessionId);
    }
    setSessionId(currentSessionId);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    console.log('addMessage called with:', message);
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    console.log('Created new message:', newMessage);
    
    setState(prev => {
      const updatedMessages = [...prev.messages, newMessage];
      console.log('Updated messages array:', updatedMessages);
      return {
        ...prev,
        messages: updatedMessages
      };
    });
  }, []);

  const sendMessage = async (content: string, type: 'text' | 'audio' = 'text', audioUrl?: string, imageFile?: File) => {
    if (!content.trim() && !imageFile) return;

    // Add user message
    addMessage({
      content,
      sender: 'user',
      type: imageFile ? 'image' : type,
      audioUrl,
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined
    });

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        if (sessionId) {
          formData.append('sessionId', sessionId);
        }
      
        // 🔹 Plant Disease analysis upload
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await response.json();
    
        if (data.success && data.analysis) {
          addMessage({
            content: data.analysis.message,
            sender: 'bot',
            type: 'text',
            
          });
          
          // Store the detected disease for display (show full_name to user, but store technical name)
          if (data.stored) {
            setDetectedDisease(data.analysis.full_name);
          }
        } else {
          addMessage({
            content: 'Sorry, I couldn\'t analyze the image. Please try again with a clearer photo.',
            sender: 'bot',
            type: 'text'
          });
        }
      } else if (content.trim()) {
        // 🔹 Handle text messages
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content,
            mode: 'plant-disease',
            type: type,
            sessionId: sessionId
          }),
        });
        const data = await response.json();
    
        addMessage({
          content: data.answer || 'Sorry, I couldn\'t process your message.',
          sender: 'bot',
          type: 'text'
        });
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        content: 'Sorry, there was an error processing your message. Please try again.',
        sender: 'bot',
        type: 'text'
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImage) {
      sendMessage(inputValue || 'Plant disease analysis', 'text', undefined, selectedImage);
    } else {
      sendMessage(inputValue);
    }
    setInputValue('');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Show user's audio message in chat
        addMessage({
          content: 'Voice message',
          sender: 'user',
          type: 'audio',
          audioUrl: audioUrl
        });

        // Send audio to API for processing in background
        setState(prev => ({ ...prev, isLoading: true }));
        
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          formData.append('queastion', ''); // Required by FastAPI endpoint
          if (sessionId) {
            formData.append('uid', sessionId);
          }
          
          const response = await fetch('/api/chat', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          console.log('Frontend received response:', data);
          console.log('Response status:', response.status);
          console.log('Data.answer:', data.answer);
          
          const messageContent = data.answer || 'Sorry, I couldn\'t process your voice message.';
          console.log('Adding message with content:', messageContent);
          
          addMessage({
            content: messageContent,
            sender: 'bot',
            type: 'text'
          });
        } catch (error) {
          console.error('Error processing audio:', error);
          
          addMessage({
            content: 'Sorry, I couldn\'t process your voice message. Please try again.',
            sender: 'bot',
            type: 'text'
          });
        } finally {
          setState(prev => ({ ...prev, isLoading: false }));
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setState(prev => ({ ...prev, isRecording: true }));
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setState(prev => ({ ...prev, isRecording: false }));
    }
  };


  const resetChat = () => {
    // Reset to initial state
    setState({
      messages: [
        {
          id: '1',
          content: 'Hello! I\'m your PlantMe AI assistant. I specialize in plant disease detection. Upload a plant image or describe symptoms to get started.',
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        }
      ],
      currentMode: 'plant-disease',
      isLoading: false,
      isRecording: false
    });
    
    // Clear detected disease
    setDetectedDisease(null);
    
    // Clear any selected images
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Clear input
    setInputValue('');
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">
                PlantMe - Disease Detection
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {detectedDisease ? `Detected: ${detectedDisease}` : 'Upload plant images or describe symptoms'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={resetChat}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Reset chat and start fresh"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {state.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              {message.type === 'audio' && message.audioUrl ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => playAudio(message.audioUrl!)}
                    className={`p-2 rounded-full ${
                      theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <span className="text-sm">Voice message</span>
                </div>
              ) : message.type === 'image' && message.imageUrl ? (
                <div className="space-y-2">
                  <img 
                    src={message.imageUrl} 
                    alt="Uploaded plant" 
                    className="max-w-full h-32 object-cover rounded-lg"
                  />
                  {message.content && <p className="text-sm">{message.content}</p>}
                </div>
              ) : (
                <div className="space-y-2">
                  {message.content && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}
                  {message.imageAnalysis && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <Leaf className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Analysis Results</span>
                      </div>
                      <div className="text-xs space-y-1">
                        <p><strong>Disease:</strong> {message.imageAnalysis.disease}</p>
                        <p><strong>Confidence:</strong> {Math.round(message.imageAnalysis.confidence * 100)}%</p>
                        <p><strong>Severity:</strong> {message.imageAnalysis.severity}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <p className={`text-xs mt-1 ${
                message.sender === 'user' 
                  ? 'text-blue-100' 
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {state.isLoading && (
          <div className="flex justify-start">
            <div className={`px-4 py-2 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border border-gray-200'
            }`}>
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className={`p-4 border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-24 h-24 object-cover rounded-lg"
            />
            <button
              onClick={removeImage}
              className={`absolute -top-2 -right-2 p-1 rounded-full ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Image ready for analysis
          </p>
        </div>
      )}

      {/* Input */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe plant symptoms or upload an image..."
            className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            disabled={state.isLoading}
          />
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          
           <button
            type="button"
            onClick={handleImageUpload}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            disabled={state.isLoading}
            title="Upload an image"
          >
            <Camera className="w-5 h-5" />
          </button>
          
          <button
            type="button"
            onClick={state.isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-lg transition-colors ${
              state.isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            disabled={state.isLoading}
            title={state.isRecording ? 'Stop recording' : 'Record voice message'}
          >
            {state.isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button
            type="submit"
            disabled={(!inputValue.trim() && !selectedImage) || state.isLoading}
            className={`p-2 rounded-lg transition-colors ${
              (!inputValue.trim() && !selectedImage) || state.isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
