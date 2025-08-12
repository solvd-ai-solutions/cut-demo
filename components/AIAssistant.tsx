import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, X, Bot, User } from 'lucide-react';
import { aiService } from '../services/aiService';
import { Material, CutJob } from '../types';
import { cn } from '../utils';

interface AIAssistantProps {
  materials: Material[];
  jobs: CutJob[];
  onClose: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AIAssistant({ materials, jobs, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI business assistant. I can help you with:\n\n• Inventory and stock levels\n• Revenue and job analysis\n• Material recommendations\n• Business insights and trends\n\nWhat would you like to know about your cutting business?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = aiService.processNaturalLanguageQuery(inputValue, materials, jobs);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What's my revenue this month?",
    "Which materials are low in stock?",
    "How many pending jobs do I have?",
    "What's the best material for wood cutting?",
    "Show me my inventory status"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    handleSendMessage();
  };

  const getBusinessMetrics = () => {
    const totalRevenue = jobs
      .filter(job => job.status === 'completed')
      .reduce((sum, job) => sum + job.totalCost, 0);
    
    const pendingJobs = jobs.filter(job => job.status === 'pending');
    const lowStockMaterials = materials.filter(material => material.currentStock <= material.reorderThreshold);
    
    return { totalRevenue, pendingJobs: pendingJobs.length, lowStockMaterials: lowStockMaterials.length };
  };

  const metrics = getBusinessMetrics();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-solv-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="solv-h2 text-solv-black">AI Business Assistant</h2>
              <p className="solv-small text-solv-black/60">Powered by artificial intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-solv-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-solv-black" />
          </button>
        </div>

        {/* Business Metrics Bar */}
        <div className="bg-solv-gray-50 border-b border-solv-gray-200 p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${metrics.totalRevenue.toFixed(0)}</div>
              <div className="text-sm text-solv-black/60">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.pendingJobs}</div>
              <div className="text-sm text-solv-black/60">Pending Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{metrics.lowStockMaterials}</div>
              <div className="text-sm text-solv-black/60">Low Stock Items</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.type === 'user'
                    ? 'bg-solv-blue text-white'
                    : 'bg-solv-gray-100 text-solv-black'
                )}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={cn(
                  "text-xs mt-2",
                  message.type === 'user' ? 'text-blue-100' : 'text-solv-black/50'
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-solv-blue rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-solv-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-solv-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-solv-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-solv-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-solv-black/60 text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="p-4 border-t border-solv-gray-200">
          <div className="mb-3">
            <p className="text-sm text-solv-black/60 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-3 py-1 bg-solv-gray-100 hover:bg-solv-gray-200 text-solv-black text-xs rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-solv-gray-200">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your business..."
                className="w-full p-3 border border-solv-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-solv-blue focus:border-transparent"
                rows={2}
                disabled={isTyping}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={cn(
                "px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2",
                inputValue.trim() && !isTyping
                  ? "bg-solv-blue hover:bg-solv-blue-dark text-white"
                  : "bg-solv-gray-200 text-solv-gray-400 cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
