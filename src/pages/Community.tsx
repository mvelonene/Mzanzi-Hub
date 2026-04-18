import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { Send, Hash, Users, Info, Settings, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Community() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedHub, setSelectedHub] = useState<any>(null);
  const [myHubs, setMyHubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    
    // Fetch hubs user is a member of (or owns)
    async function fetchHubs() {
      const q = query(collection(db, 'hubs'), limit(10)); // Simple MVP: show some hubs
      const snap = await getDocs(q);
      const hubs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMyHubs(hubs);
      if (hubs.length > 0) setSelectedHub(hubs[0]);
      setLoading(false);
    }
    fetchHubs();
  }, [user]);

  useEffect(() => {
    if (!selectedHub) return;

    const q = query(
      collection(db, `hubs/${selectedHub.id}/messages`),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [selectedHub]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !selectedHub) return;

    const text = inputText;
    setInputText('');
    
    try {
      await addDoc(collection(db, `hubs/${selectedHub.id}/messages`), {
        hubId: selectedHub.id,
        channelId: 'general',
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        text,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[80vh]"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
      {/* Sidebar - Hub List */}
      <div className="w-20 sm:w-64 border-r border-zinc-100 flex flex-col items-center sm:items-stretch py-4 bg-zinc-50">
         <div className="px-4 mb-8 hidden sm:block">
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest px-2 mb-4">My Communities</h2>
            <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
               <input 
                 className="w-full bg-white border border-zinc-200 rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-brand"
                 placeholder="Search hubs..."
               />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto space-y-2 px-2">
            {myHubs.map(hub => (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(hub)}
                className={cn(
                  "w-full flex items-center gap-3 p-2 rounded-xl border transition-all group",
                  selectedHub?.id === hub.id 
                    ? "bg-white border-zinc-200 shadow-sm ring-1 ring-zinc-100" 
                    : "border-transparent hover:bg-zinc-100"
                )}
              >
                 <div className="shrink-0 w-12 h-12 rounded-2xl bg-zinc-200 flex items-center justify-center font-bold text-lg overflow-hidden border border-zinc-100">
                    {hub.logoImage ? (
                      <img src={hub.logoImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : hub.name[0]}
                 </div>
                 <div className="hidden sm:block text-left truncate">
                    <p className={cn("text-xs font-bold leading-none mb-1", selectedHub?.id === hub.id ? "text-brand" : "text-zinc-700")}>
                      {hub.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Users className="w-2 h-2" /> 1.2k members
                    </p>
                 </div>
              </button>
            ))}
         </div>

         <div className="px-4 pt-4 border-t border-zinc-200 hidden sm:block">
            <button className="w-full py-3 rounded-xl border border-dashed border-zinc-300 text-zinc-400 text-xs font-bold hover:border-brand hover:text-brand transition-all flex items-center justify-center gap-2">
               Find More Hubs
            </button>
         </div>
      </div>

      {/* Main Chat Area */}
      {selectedHub ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Channel Header */}
          <div className="h-16 border-b border-zinc-100 flex items-center justify-between px-6 shrink-0">
             <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-zinc-400" />
                <div>
                   <h3 className="text-sm font-bold">general-chat</h3>
                   <p className="text-[10px] text-zinc-400">Public group to discuss everything {selectedHub.name}</p>
                </div>
             </div>
             <div className="flex items-center gap-4 text-zinc-400">
                <Users className="w-5 h-5 cursor-pointer hover:text-zinc-600" />
                <Settings className="w-5 h-5 cursor-pointer hover:text-zinc-600" />
                <Info className="w-5 h-5 cursor-pointer hover:text-zinc-600" />
             </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             <AnimatePresence>
               {messages.map((msg, idx) => {
                 const isMe = msg.authorId === user?.uid;
                 return (
                   <motion.div 
                     key={msg.id}
                     initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={cn("flex gap-3", isMe ? "flex-row-reverse" : "flex-row")}
                   >
                      <img 
                        src={msg.authorPhoto || `https://ui-avatars.com/api/?name=${msg.authorName}`} 
                        className="w-8 h-8 rounded-lg shrink-0" 
                        referrerPolicy="no-referrer"
                        alt={msg.authorName}
                      />
                      <div className={cn("max-w-[70%] space-y-1", isMe ? "text-right" : "text-left")}>
                         <div className="flex items-center gap-2 mb-1 justify-end flex-row-reverse">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{msg.authorName}</span>
                            <span className="text-[9px] text-zinc-300">
                              {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                            </span>
                         </div>
                         <div className={cn(
                           "px-4 py-2 rounded-2xl text-sm shadow-sm",
                           isMe ? "bg-brand text-white rounded-tr-none" : "bg-zinc-100 text-zinc-700 rounded-tl-none"
                         )}>
                            {msg.text}
                         </div>
                      </div>
                   </motion.div>
                 );
               })}
             </AnimatePresence>
             <div ref={scrollRef} />
          </div>

          {/* Message Input */}
          <div className="p-6 shrink-0 border-t border-zinc-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
             <form onSubmit={handleSendMessage} className="relative">
                <input 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-4 pr-16 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/10 transition-all shadow-inner"
                  placeholder={`Send a message to #${selectedHub.name}...`}
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand text-white p-2.5 rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50"
                  disabled={!inputText.trim()}
                >
                  <Send className="w-5 h-5" />
                </button>
             </form>
             <p className="text-[9px] text-zinc-400 mt-2 text-center uppercase tracking-widest font-medium opacity-50">
               Respect the community rules. South African Law & POPIA apply.
             </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-zinc-50/50">
           <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-brand" />
           </div>
           <h3 className="text-2xl font-bold mb-2">Welcome to your Community</h3>
           <p className="text-zinc-500 max-w-sm mb-8">Select a hub on the left to start chatting with other members and creators.</p>
           <button className="bg-brand text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all">Explore Marketplace</button>
        </div>
      )}
    </div>
  );
}
