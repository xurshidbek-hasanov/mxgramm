import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Menu, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  ArrowLeft,
  Settings,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { Message, User } from '../types';
import MessageBubble from './MessageBubble';

interface ChatProps {
  currentUser: User;
  onLogout: () => void;
}

export default function Chat({ currentUser, onLogout }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);

    socket.onopen = () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    };

    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === 'init') {
        setMessages(payload.messages);
      } else if (payload.type === 'message') {
        setMessages((prev) => [...prev, payload.data]);
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !ws || !isConnected) return;

    const messageData = {
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText.trim(),
    };

    ws.send(JSON.stringify({ type: 'message', data: messageData }));
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-[#f5f5f5] overflow-hidden relative">
      {/* Background radial gradient overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>
      
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? '320px' : '0px', opacity: isSidebarOpen ? 1 : 0 }}
        className="bg-[#171717] border-r border-[#262626] flex flex-col z-20 overflow-hidden shrink-0"
      >
        <div className="h-16 flex items-center px-4 space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Send className="w-6 h-6 text-white -mr-0.5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Mx Gramm</h1>
        </div>

        <div className="px-4 py-2">
          <div className="bg-[#262626] rounded-full px-4 py-2 flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-500" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mt-2 px-1">
          {/* Active Chat List Item */}
          <div className="flex items-center px-3 py-3 bg-blue-500/10 border-l-4 border-blue-500 cursor-pointer rounded-r-xl mr-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 mr-3 flex items-center justify-center text-lg font-bold shadow-lg">G</div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <span className="font-semibold text-sm">Global Chat</span>
                <span className="text-[10px] text-gray-500">14:48</span>
              </div>
              <p className="text-xs text-blue-400 truncate">Mx Gramm Community...</p>
            </div>
          </div>

          {[1,2,3,4].map(i => (
             <div key={i} className="flex items-center px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors transition-all opacity-40">
                <div className="w-12 h-12 rounded-full bg-gray-800 mr-3 flex items-center justify-center text-lg font-bold text-gray-500">U</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="font-semibold text-sm">User {i}</span>
                    <span className="text-[10px] text-gray-600">12:05</span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">Active {i}h ago</p>
                </div>
             </div>
          ))}
        </div>

        <div className="p-4 bg-[#1a1a1a] border-t border-[#262626]">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                 </div>
                 <span className="text-xs font-semibold">{currentUser.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
           </div>
        </div>
      </motion.aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 glass flex items-center justify-between px-6 z-10 border-b border-white/5">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-400" />
              </button>
              <div>
                 <h2 className="font-bold text-lg leading-tight">Global Chat</h2>
                 <p className="text-[10px] text-blue-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    {isConnected ? 'online' : 'connecting...'}
                 </p>
              </div>
           </div>
           <div className="flex items-center space-x-6 text-gray-400">
              <Search className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
              <MoreVertical className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
           </div>
        </header>

        {/* Messages Port */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 flex flex-col scroll-smooth relative"
        >
          <div className="flex-1" />
          <div className="max-w-3xl w-full mx-auto space-y-2">
            <div className="flex justify-center mb-10">
               <span className="bg-black/40 text-[11px] px-4 py-1.5 rounded-full text-gray-500 uppercase tracking-widest font-bold">Today</span>
            </div>
            
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <MessageBubble 
                  key={msg.id} 
                  message={msg} 
                  isMe={msg.senderId === currentUser.id} 
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Input Area */}
        <footer className="p-6 z-10">
           <div className="max-w-3xl mx-auto flex items-center space-x-4">
              <div className="flex-1 glass rounded-2xl p-2 flex items-center px-4">
                 <button className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                    <Smile className="w-6 h-6" />
                 </button>
                 <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Write a message..."
                    rows={1}
                    className="flex-1 bg-transparent border-none focus:ring-0 py-3 px-3 resize-none text-[15px] max-h-40 overflow-y-auto font-light placeholder-gray-600"
                 />
                 <button className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                    <Paperclip className="w-6 h-6" />
                 </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!inputText.trim() || !isConnected}
                className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 disabled:opacity-50 transition-all"
              >
                <div className="transform rotate-45 ml-[-2px]">
                   <Send className="w-7 h-7 fill-white" />
                </div>
              </motion.button>
           </div>
        </footer>
      </main>
    </div>
  );
}
