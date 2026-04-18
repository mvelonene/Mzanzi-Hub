import React, { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Search, Filter, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const CATEGORIES = ['All', 'Trading & Finance', 'Education', 'Fitness', 'Digital Tools', 'E-commerce', 'Entertainment'];

export default function Marketplace() {
  const [hubs, setHubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchHubs() {
      setLoading(true);
      try {
        const q = query(collection(db, 'hubs'));
        const snap = await getDocs(q);
        setHubs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHubs();
  }, []);

  const filteredHubs = hubs.filter(hub => {
    const matchesCategory = activeCategory === 'All' || hub.categories?.includes(activeCategory);
    const matchesSearch = hub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          hub.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="content-layout">
      {/* Main View */}
      <section className="marketplace-view space-y-6">
        <div className="section-title">
          <h2 className="text-xl font-bold">Trending in South Africa</h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-[400px]">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "whitespace-nowrap px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all border uppercase tracking-wider",
                    activeCategory === cat 
                      ? "bg-accent text-white border-accent shadow-md shadow-accent/10" 
                      : "bg-white text-secondary border-border-subtle hover:border-accent/40"
                  )}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse border border-border-subtle" />)
          }</div>
        ) : filteredHubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredHubs.map((hub) => (
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
                    by Creator Name
                  </p>
                </div>
                <div className="product-footer flex items-center justify-between p-4 border-t border-border-subtle bg-slate-50/50">
                  <span className="price font-bold text-primary">R 850 / mo</span>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-black transition-all">
                    Explore Now
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-border-subtle">
             <Search className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-secondary">No hubs found</h3>
             <p className="text-xs text-secondary/60">Try adjusting your category or search terms.</p>
          </div>
        )}
      </section>

      {/* Right Panel */}
      <aside className="right-panel hidden lg:flex flex-col gap-6">
        <div className="stats-card card-density p-5">
           <h3 className="text-sm font-bold mb-4">Market Discovery</h3>
           <p className="text-xs text-secondary leading-relaxed">
             Browse over 450 verified South African communities. Filter by category to find your next digital investment or learning hub.
           </p>
           <div className="mt-6 flex flex-wrap gap-2">
              {['Courses', 'Signal Groups', 'Coaching', 'Memberships'].map(p => (
                <span key={p} className="text-[9px] font-extrabold text-accent border border-accent/20 px-2 py-1 rounded-md bg-accent/5">
                  {p}
                </span>
              ))}
           </div>
        </div>

        <div className="community-list card-density p-5 flex-1">
           <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-6">
              <h4 className="text-xs font-bold text-accent mb-1 uppercase tracking-wider">Become a Seller</h4>
              <p className="text-[10px] text-accent/80 leading-relaxed mb-3">Launch your hub today and join thousands of South African creators earning in ZAR.</p>
              <button className="w-full py-2 bg-accent text-white rounded-lg text-xs font-bold hover:bg-brand-dark transition-all">Start Your Hub</button>
           </div>
           
           <h3 className="text-sm font-bold mb-4">Trending Tags</h3>
           <div className="flex flex-wrap gap-2">
              {['#ForexSA', '#Matric2026', '#JoziStartups', '#Web3Africa', '#SideHustle'].map(tag => (
                <span key={tag} className="text-[9px] font-bold text-slate-400 hover:text-accent cursor-pointer transition-colors">{tag}</span>
              ))}
           </div>
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
          flex-wrap: wrap;
          gap: 16px;
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

