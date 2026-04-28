import React from 'react';
import { motion } from 'motion/react';
import { Check, CheckCheck } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  key?: string | number;
  message: Message;
  isMe: boolean;
}

export default function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[75%] px-4 py-3 shadow-xl relative transition-all ${
          isMe 
            ? 'message-bubble-self text-white shadow-blue-500/10' 
            : 'message-bubble-other text-[#f5f5f5]'
        }`}
      >
        {!isMe && (
          <p className="text-[11px] font-bold text-blue-400 mb-1 tracking-tight">
            {message.senderName}
          </p>
        )}
        <p className="text-[14px] leading-relaxed break-words pr-12">
          {message.text}
        </p>
        <div className={`absolute bottom-1 right-3 flex items-center gap-1.5 ${isMe ? 'text-blue-100/60' : 'text-gray-500'}`}>
          <span className="text-[10px] font-medium">{time}</span>
          {isMe && <CheckCheck className="w-3.5 h-3.5" />}
        </div>
      </div>
    </motion.div>
  );
}
