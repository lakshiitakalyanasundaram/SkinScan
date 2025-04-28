
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Minus, Send } from 'lucide-react';

interface Message {
  id: number;
  sender: 'bot' | 'user';
  content: string;
  timestamp: Date;
  suggestAppointment?: boolean;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const initialMessage: Message = {
    id: 1,
    sender: 'bot',
    content: "Hello! I'm DermAssist, your AI skin care assistant. How can I help you today?",
    timestamp: new Date()
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([initialMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatBotMessage = (text: string) => {
    // Convert asterisk-wrapped text to bold
    let formatted = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    
    // Convert emoji bullet points
    formatted = formatted.replace(/^(🔍|💡|⚠️|✅|❗️) (.*)/gm, '<div class="flex items-start mb-2"><span class="mr-2">$1</span><span>$2</span></div>');
    
    // Convert regular bullet points
    formatted = formatted.replace(/^• (.*)/gm, '<li class="ml-4">$1</li>');
    
    return formatted;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      let botResponse: Message;
      
      if (newMessage.toLowerCase().includes('rash') || 
          newMessage.toLowerCase().includes('itchy') || 
          newMessage.toLowerCase().includes('dermatitis')) {
        botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          content: `
            Based on your description, it sounds like you might be experiencing *dermatitis* or a similar inflammatory skin condition.
            
            🔍 Common symptoms include redness, itching, and sometimes small blisters.
            
            💡 Some quick recommendations:
            • Keep the area clean and dry
            • Avoid scratching the affected area
            • Apply a mild, fragrance-free moisturizer
            • Take cool baths with colloidal oatmeal
            
            ⚠️ If symptoms persist for more than a week or worsen, you should consult with a dermatologist.
          `,
          timestamp: new Date(),
          suggestAppointment: true
        };
      } else {
        botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          content: `
            Thank you for your message! To provide you with the most accurate information about your skin condition, I'd need a few more details:
            
            • How long have you been experiencing this?
            • Are there any other symptoms like itching, pain or redness?
            • Have you tried any treatments already?
            
            Alternatively, you could upload a photo using our Skin Analysis tool for a more detailed assessment.
          `,
          timestamp: new Date()
        };
      }
      
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-[350px] h-[500px] shadow-xl flex flex-col animate-slide-in overflow-hidden">
          {/* Chat Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img 
                src="https://img.icons8.com/color/96/000000/dermatology.png" 
                alt="DermAssist Logo" 
                className="h-8 w-8"
              />
              <div>
                <h3 className="font-medium">DermAssist</h3>
                <div className="text-xs opacity-80">Online</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-primary-dark"
                onClick={() => setIsOpen(false)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-primary-dark"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`${
                  message.sender === 'bot' 
                    ? 'bg-white border border-gray-200' 
                    : 'bg-primary text-white'
                } rounded-2xl px-4 py-3 max-w-[85%] shadow-sm ${
                  message.sender === 'bot' ? 'self-start mr-auto' : 'self-end ml-auto'
                }`}
              >
                {message.sender === 'bot' ? (
                  <div>
                    <div dangerouslySetInnerHTML={{ __html: formatBotMessage(message.content) }} />
                    
                    {message.suggestAppointment && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-primary">
                        <p className="font-medium text-gray-800 mb-2">Would you like to consult with a dermatologist?</p>
                        <a 
                          href="#appointment" 
                          className="inline-flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          🏥 Book Appointment
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
                <div className="text-right mt-1">
                  <span className={`text-[10px] ${message.sender === 'bot' ? 'text-gray-400' : 'text-white/70'}`}>
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t bg-white flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Button 
              onClick={handleSendMessage}
              size="icon" 
              className="rounded-full bg-primary hover:bg-primary-dark"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Button 
          onClick={handleToggleChat}
          size="icon" 
          className="h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary-dark animate-pulse-slow"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default ChatBot;
