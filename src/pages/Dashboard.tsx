import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Plus, Layout, Package, Users, DollarSign, ArrowUpRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { formatZAR, cn } from '../lib/utils';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [hubs, setHubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHub, setNewHub] = useState({ name: '', description: '', slug: '', category: 'Education' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function fetchMyHubs() {
      try {
        const q = query(collection(db, 'hubs'), where('ownerId', '==', user.uid));
        const snap = await getDocs(q);
        setHubs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyHubs();
  }, [user]);

  const handleCreateHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const hubData = {
        ...newHub,
        ownerId: user.uid,
        totalRevenue: 0,
        createdAt: serverTimestamp(),
        slug: newHub.slug.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        categories: [newHub.category]
      };
      await addDoc(collection(db, 'hubs'), hubData);
      setHubs([...hubs, hubData]);
      setShowCreateModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>;

  return (
    <div className="content-layout">
      {/* Main View */}
      <section className="marketplace-view space-y-8">
        <div className="section-title">
          <div>
            <h1 className="text-xl font-bold">Creator Dashboard</h1>
            <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">Manage your storefronts & products</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-accent text-white px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-brand-dark transition-all"
          >
            <Plus className="w-4 h-4" /> New Hub
          </button>
        </div>

        {/* My Hubs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hubs.length > 0 ? (
            hubs.map(hub => (
              <div key={hub.id} className="product-card card-density p-5 flex items-center gap-4 hover:border-accent/30 transition-all cursor-pointer">
                 <div className="w-12 h-12 rounded-xl bg-slate-100 border border-border-subtle flex items-center justify-center font-extrabold text-primary text-xl">
                    {hub.name[0]}
                 </div>
                 <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{hub.name}</h3>
                    <p className="text-[10px] text-accent font-bold uppercase tracking-wider">/{hub.slug}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-bold text-primary">{formatZAR(hub.totalRevenue || 0)}</p>
                    <p className="text-[9px] text-secondary font-medium">Revenue</p>
                 </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 text-center py-20 bg-white rounded-2xl border-2 border-dashed border-border-subtle">
               <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layout className="w-6 h-6 text-slate-300" />
               </div>
               <h3 className="text-sm font-bold text-secondary">You haven't created a hub yet</h3>
               <p className="text-[10px] text-secondary/60 mt-1 mb-6 uppercase tracking-wider">Start your South African digital empire</p>
               <button onClick={() => setShowCreateModal(true)} className="bg-primary text-white px-6 py-2.5 rounded-lg text-xs font-bold">Launch Your First Hub</button>
            </div>
          )}
        </div>
      </section>

      {/* Right Panel */}
      <aside className="right-panel hidden lg:flex flex-col gap-6">
        <div className="stats-card card-density p-5">
           <h3 className="text-sm font-bold mb-4">Performance Overview</h3>
           <div className="space-y-4">
              {[
                { label: 'Total Earnings', value: formatZAR(hubs.reduce((acc, h) => acc + (h.totalRevenue || 0), 0)), color: 'text-accent' },
                { label: 'Active Hubs', value: hubs.length, color: 'text-primary' },
                { label: 'Subscriber Base', value: '1,240', color: 'text-primary' },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                   <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">{stat.label}</span>
                   <span className={cn("text-sm font-bold", stat.color)}>{stat.value}</span>
                </div>
              ))}
           </div>
           
           <div className="mt-6 p-3 bg-slate-50 border border-border-subtle rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-border-subtle flex items-center justify-center">
                 <DollarSign className="w-4 h-4 text-accent" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-secondary uppercase leading-none">Next Payout</p>
                 <p className="text-xs font-extrabold mt-1">Scheduled for 25th April</p>
              </div>
           </div>
        </div>

        <div className="community-list card-density p-5 flex-1">
           <h3 className="text-sm font-bold mb-4">Platform Stats</h3>
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <Users className="w-4 h-4 text-blue-500" />
                 <div className="flex-1">
                    <p className="text-xs font-bold">Global Reach</p>
                    <p className="text-[9px] text-secondary">Available in 15+ African countries</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <Package className="w-4 h-4 text-purple-500" />
                 <div className="flex-1">
                    <p className="text-xs font-bold">Standard Fees</p>
                    <p className="text-[9px] text-secondary">Only 5% transaction fee on ZAR sales</p>
                 </div>
              </div>
           </div>
           
           <div className="mt-12 text-center">
              <div className="text-[40px] font-black text-slate-100 mb-2">SA</div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-40">MzansiHub Priority</p>
           </div>
        </div>
      </aside>

      {/* Modal - Themed */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
           <motion.div 
             initial={{ scale: 0.95, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="bg-white w-full max-w-md rounded-2xl p-8 border border-border-subtle shadow-2xl space-y-6"
           >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Launch Your Digital Hub</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-secondary hover:text-accent">&times;</button>
              </div>
              
              <form onSubmit={handleCreateHub} className="space-y-5">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Hub Identity</label>
                    <input 
                      required
                      value={newHub.name}
                      onChange={e => setNewHub({...newHub, name: e.target.value})}
                      className="w-full bg-slate-50 border border-border-subtle rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all ring-accent/10 focus:ring-4"
                      placeholder="e.g. Matric Hub SA"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Storefront URL</label>
                    <div className="flex items-center bg-slate-50 border border-border-subtle rounded-lg overflow-hidden focus-within:border-accent transition-all">
                       <span className="px-3 text-[10px] font-bold text-slate-400 bg-slate-100 h-10 flex items-center border-r border-border-subtle">mzansihub.com/hub/</span>
                       <input 
                         required
                         value={newHub.slug}
                         onChange={e => setNewHub({...newHub, slug: e.target.value})}
                         className="flex-1 bg-transparent px-2 text-xs focus:outline-none"
                         placeholder="matric-hub"
                       />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Mission Statement</label>
                    <textarea 
                      required
                      rows={3}
                      value={newHub.description}
                      onChange={e => setNewHub({...newHub, description: e.target.value})}
                      className="w-full bg-slate-50 border border-border-subtle rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-accent transition-all ring-accent/10 focus:ring-4"
                      placeholder="What are you offering your members?"
                    />
                 </div>
                 
                 <div className="pt-2">
                    <button 
                      disabled={saving}
                      className={cn(
                        "w-full bg-accent text-white py-3.5 rounded-lg font-bold text-sm shadow-lg shadow-accent/20 hover:bg-brand-dark transition-all flex items-center justify-center gap-2",
                        saving && "opacity-50"
                      )}
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Launch'}
                    </button>
                 </div>
              </form>
           </motion.div>
        </div>
      )}

      <style>{`
        .content-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 24px;
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }
        @media (max-width: 1024px) {
          .content-layout {
            grid-template-columns: 1fr;
          }
        }
        .section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
}

