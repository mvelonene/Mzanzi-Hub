import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Search, ShoppingBag, Users, MessageSquare, Star, ArrowRight, Loader2, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { formatZAR, cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export default function HubPage() {
  const { slug } = useParams();
  const { signIn, user } = useAuth();
  const [hub, setHub] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHubData() {
      setLoading(true);
      try {
        const q = query(collection(db, 'hubs'), where('slug', '==', slug), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const hubDoc = snap.docs[0];
          const data = { id: hubDoc.id, ...hubDoc.data() };
          setHub(data);
          
          // Fetch products
          const pq = query(collection(db, `hubs/${hubDoc.id}/products`));
          const pSnap = await getDocs(pq);
          setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHubData();
  }, [slug]);

  if (loading) return <div className="flex items-center justify-center h-[80vh]"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>;
  if (!hub) return <div className="text-center py-20"><h1 className="text-4xl font-bold">Hub Not Found</h1><Link to="/marketplace" className="text-brand hover:underline mt-4 inline-block">Back to Marketplace</Link></div>;

  return (
    <div className="space-y-0">
      {/* Hub Hero */}
      <div className="h-64 sm:h-96 relative">
         <img 
           src={hub.bannerImage || `https://picsum.photos/seed/${hub.id}/1920/600`} 
           className="w-full h-full object-cover"
           referrerPolicy="no-referrer"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
         <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-end gap-6">
               <img 
                 src={hub.logoImage || `https://ui-avatars.com/api/?name=${hub.name}&size=256`} 
                 className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 border-white shadow-2xl bg-white"
                 referrerPolicy="no-referrer"
               />
               <div className="flex-1 text-white pb-2">
                  <div className="flex items-center gap-3 mb-2">
                     <h1 className="text-3xl sm:text-5xl font-black">{hub.name}</h1>
                     <span className="hidden sm:inline-block bg-brand px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest leading-none">Official</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-zinc-300 font-medium">
                     <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 1.2k Members</span>
                     <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9 (240 reviews)</span>
                     <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> Global Access</span>
                  </div>
               </div>
               <div className="pb-2 w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-white text-zinc-900 px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all shadow-xl">
                     Join Community
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: About & Feed */}
            <div className="lg:col-span-2 space-y-12">
               <section className="space-y-4">
                  <h2 className="text-2xl font-bold">About this Hub</h2>
                  <p className="text-zinc-600 leading-relaxed text-lg">
                    {hub.description || "Welcome to our exclusive community. Here you will find products, mentorship, and a network designed to help you succeed."}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                     {hub.categories?.map((cat: string) => (
                       <span key={cat} className="px-4 py-1.5 bg-zinc-100 text-zinc-600 rounded-full text-xs font-bold uppercase tracking-wider">
                         {cat}
                       </span>
                     ))}
                  </div>
               </section>

               <section className="space-y-6">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-bold">Available Products</h2>
                     <button className="text-brand font-bold text-sm hover:underline">View all items</button>
                  </div>
                  
                  {products.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                       {products.map(product => (
                         <div key={product.id} className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                            <div className="flex items-center justify-between">
                               <span className="px-3 py-1 bg-zinc-50 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-zinc-100">
                                 {product.type}
                               </span>
                               <span className="text-xl font-bold text-brand">{formatZAR(product.price)}</span>
                            </div>
                            <div>
                               <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                               <p className="text-sm text-zinc-500 line-clamp-2">{product.description}</p>
                            </div>
                            <button className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-black transition-all">
                               Access Now
                            </button>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
                       <ShoppingBag className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
                       <p className="text-zinc-500 font-medium">No public products listed yet.</p>
                    </div>
                  )}
               </section>
            </div>

            {/* Right: Sidebar / Community Preview */}
            <div className="space-y-8">
               <div className="bg-brand text-white p-8 rounded-3xl shadow-2xl shadow-brand/20 relative overflow-hidden group">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10 space-y-6">
                     <div className="p-3 bg-white/20 w-fit rounded-2xl backdrop-blur-md">
                        <MessageSquare className="w-6 h-6" />
                     </div>
                     <h3 className="text-2xl font-bold leading-tight">Join the internal chat community</h3>
                     <p className="text-white/80 text-sm leading-relaxed">
                        Get instant access to real-time discussions, announcements, and support from {hub.name} members.
                     </p>
                     <button 
                       onClick={() => user ? window.location.href = '/community' : signIn()}
                       className="w-full bg-white text-brand py-4 rounded-xl font-bold hover:shadow-lg transition-all"
                     >
                        Chat with Community
                     </button>
                  </div>
               </div>

               <div className="bg-white border border-zinc-100 rounded-3xl p-8 space-y-6">
                  <h4 className="font-bold border-b border-zinc-50 pb-4">Hub Information</h4>
                  <ul className="space-y-4">
                     <li className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Total Members</span>
                        <span className="font-bold">1,240</span>
                     </li>
                     <li className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Launch Date</span>
                        <span className="font-bold">Jan 2026</span>
                     </li>
                     <li className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Active Payouts</span>
                        <span className="text-green-500 font-bold flex items-center gap-1">
                           Verified <Star className="w-3 h-3 fill-green-500" />
                        </span>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
