import React, { useEffect, useState } from 'react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ShoppingBag, TrendingUp, Search, GraduationCap, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { formatZAR, cn } from '../lib/utils';

export default function Home() {
  const [featuredHubs, setFeaturedHubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHubs() {
      try {
        const q = query(collection(db, 'hubs'), limit(6));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeaturedHubs(docs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHubs();
  }, []);

  return (
    <div className="content-layout">
      {/* Main View */}
      <section className="marketplace-view space-y-8">
        <div className="section-title">
          <h2 className="text-xl font-bold">Trending in South Africa</h2>
          <Link to="/marketplace" className="text-xs font-bold text-accent hover:underline uppercase tracking-wide">View All</Link>
        </div>

        <div className="marketplace-grid grid grid-cols-1 md:grid-cols-2 gap-5">
          {loading ? (
            [1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse border border-border-subtle" />)
          ) : featuredHubs.map((hub) => (
            <Link to={`/hub/${hub.slug}`} key={hub.id} className="product-card card-density group flex flex-col">
              <div className="product-image h-32 relative bg-primary overflow-hidden">
                <img 
                  src={hub.bannerImage || `https://picsum.photos/seed/${hub.id}/600/300`} 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="category-tag bg-primary/80 backdrop-blur-sm">
                  {hub.categories?.[0] || 'General'}
                </span>
              </div>
              <div className="product-info p-4 flex-1">
                <h3 className="product-title font-bold text-base mb-1">{hub.name}</h3>
                <p className="creator-name text-xs text-secondary flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 border border-border-subtle overflow-hidden">
                    <img src={hub.logoImage || `https://ui-avatars.com/api/?name=${hub.name}`} className="w-full h-full object-cover" />
                  </span>
                  by {hub.ownerName || 'South African Creator'}
                </p>
              </div>
              <div className="product-footer flex items-center justify-between p-4 border-t border-border-subtle bg-slate-50/50">
                <span className="price font-bold text-primary">R 850 / mo</span>
                <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-black transition-all">
                  Join Now
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Right Panel */}
      <aside className="right-panel hidden lg:flex flex-col gap-6">
        <div className="stats-card card-density p-5">
           <h3 className="text-sm font-bold mb-4">Market Overview</h3>
           <div className="space-y-3">
              <div className="flex justify-between items-center">
                 <span className="text-xs text-secondary font-medium uppercase tracking-wider">Total Sales</span>
                 <span className="text-sm font-bold text-primary">R 45,902</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-xs text-secondary font-medium uppercase tracking-wider">Active Members</span>
                 <span className="text-sm font-bold text-primary">1,240</span>
              </div>
              <div className="pt-2">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Growth</span>
                    <span className="text-[10px] font-bold text-accent">85%</span>
                 </div>
                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full transition-all" style={{ width: '85%' }} />
                 </div>
              </div>
           </div>
           
           <div className="mt-5 flex flex-wrap gap-2">
              {['PayFast', 'Ozow', 'SnapScan'].map(p => (
                <span key={p} className="text-[9px] font-extrabold text-secondary border border-border-subtle px-2 py-1 rounded-md bg-slate-50">
                  {p}
                </span>
              ))}
           </div>
        </div>

        <div className="community-list card-density p-5 flex-1">
           <h3 className="text-sm font-bold mb-4">My Communities</h3>
           <div className="space-y-4">
              {featuredHubs.slice(0, 3).map(hub => (
                <div key={hub.id} className="flex items-center gap-3 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                   <div className="w-10 h-10 rounded-lg bg-slate-100 border border-border-subtle overflow-hidden">
                      <img src={hub.logoImage || `https://ui-avatars.com/api/?name=${hub.name}`} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate leading-tight">{hub.name}</p>
                      <p className="text-[10px] text-secondary font-medium">4.2k members</p>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-6 py-2.5 rounded-lg border border-border-subtle text-[10px] font-extrabold text-secondary hover:bg-slate-50 hover:text-accent transition-all uppercase tracking-wider">
              Discover More Hubs
           </button>
        </div>
      </aside>

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
          margin-bottom: 20px;
        }
        .category-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          color: white;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
