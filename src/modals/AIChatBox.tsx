'use client';

import React, { useEffect, useRef } from 'react';
import { 
  XMarkIcon, 
  ChevronDownIcon, 
  PaperAirplaneIcon,
  UserIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Message interface
export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

// Props interface for parent component usage
export interface AIChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onSendMessage: (message: string) => void;
  messages: Message[];
  isLoading?: boolean;
  isMinimized?: boolean;
  placeholder?: string;
  title?: string;
  subtitle?: string;
  userAvatar?: React.ReactNode;
  aiAvatar?: React.ReactNode;
  className?: string;
  showBackdrop?: boolean;
  position?: 'bottom-left' | 'bottom-right' | 'center';
  width?: string;
  height?: string;
}

export function AIChatBox({
  isOpen,
  onClose,
  onMinimize,
  onSendMessage,
  messages = [],
  isLoading = false,
  isMinimized = false,
  placeholder = "Type your message...",
  title = "IRIS",
  subtitle="Infrastructure Resource Intelligence System",
  userAvatar,
  aiAvatar,
  className = '',
  showBackdrop = true,
  position = 'bottom-left',
  width = 'w-[600px]',
  height = 'h-[420px]',
}: AIChatBoxProps) {
  // State for input value - this is the only local state we keep
  const [inputValue, setInputValue] = React.useState('');
  
  // Refs for auto-scroll and textarea auto-resize
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`; // max 4 rows
    }
  }, [inputValue]);

  // Handle send message
  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;
    
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'bottom-left':
      default:
        return 'bottom-4 left-20';
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  // Default avatars if not provided
  const defaultUserAvatar = userAvatar || (
    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
      <UserIcon className="w-4 h-4 text-neutral-50" />
    </div>
  );

  const defaultAiAvatar = aiAvatar || (
    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-200">
      <SparklesIcon className="w-4 h-4" />
    </div>
  );

  return (
    <>
      {/* Backdrop for click outside to close */}
      {showBackdrop && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Chat Window */}
      <div 
        className={`
          fixed z-50 transition-all duration-300 ease-out
          ${isMinimized ? 'h-14' : height}
          ${width}
          ${getPositionClasses()}
          max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:w-full max-md:h-full
          rounded-lg md:rounded-xl shadow-2xl
          bg-white dark:bg-neutral-900
          ${isOpen 
            ? 'translate-x-0 opacity-100' 
            : '-translate-x-4 opacity-0 pointer-events-none'
          }
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary-600 text-neutral-50 px-4 py-3 rounded-t-lg md:rounded-t-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center">
              <SparklesIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <h3 className="font-semibold text-sm">{title}</h3>
                {subtitle && (
                  <span className="text-xs text-primary-100 opacity-90">- {subtitle}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {onMinimize && (
              <button
                onClick={onMinimize}
                className="p-1.5 hover:bg-primary-500 rounded-md transition-colors duration-150"
                aria-label="Minimize chat"
              >
                <ChevronDownIcon 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMinimized ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-primary-500 rounded-md transition-colors duration-150"
              aria-label="Close chat"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content - only show when not minimized */}
        {!isMinimized && (
          <>
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-120px)]">
              {messages.length === 0 && (
                <div className="text-center py-14">
                  <SparklesIcon className="w-10 h-10 mx-auto mb-3 text-neutral-300 dark:text-neutral-400" />
                  <p className="text-sm text-neutral-500 dark:text-neutral-300">
                    What can I help you with today?
                  </p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%]`}>
                    {message.type === 'ai' && defaultAiAvatar}
                    
                    <div>
                      <div
                        className={`
                          px-3 py-2 rounded-lg text-sm
                          ${message.type === 'user'
                            ? 'bg-primary-600 text-neutral-50'
                            : 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                          }
                        `}
                      >
                        {message.content}
                      </div>
                      <p className="text-xs mt-1 px-1 text-neutral-400 dark:text-neutral-400">
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                    
                    {message.type === 'user' && defaultUserAvatar}
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    {defaultAiAvatar}
                    <div className="px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full animate-bounce bg-neutral-400 dark:bg-neutral-400"></div>
                        <div className="w-2 h-2 rounded-full animate-bounce bg-neutral-400 dark:bg-neutral-400" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce bg-neutral-400 dark:bg-neutral-400" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="border-t p-3 border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="
                      w-full px-3 py-2 border rounded-lg 
                      focus:outline-none focus-visible:ring-1 focus:border-transparent
                      resize-none text-sm
                      max-h-24 min-h-[40px]
                      bg-white border-neutral-300 text-neutral-900 placeholder-neutral-500 
                      focus-visible:ring-primary-400
                      dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100 
                      dark:placeholder-neutral-400 dark:focus-visible:ring-neutral-400
                    "
                    rows={1}
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="
                    h-[40px] w-[40px] bg-primary-600 text-neutral-50 rounded-lg
                    hover:bg-primary-700 disabled:bg-primary-600/60 disabled:cursor-not-allowed
                    transition-colors duration-150 flex-shrink-0 flex items-center justify-center
                  "
                  aria-label="Send message"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs mt-2 text-neutral-500 dark:text-neutral-400">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
