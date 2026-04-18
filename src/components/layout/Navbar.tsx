import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Search } from 'lucide-react';

export default function Navbar() {
  const { user, profile, signIn, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-border-subtle flex items-center justify-between px-8">
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search creators, courses or groups..." 
            className="w-full bg-slate-100 border border-transparent focus:border-accent/30 focus:bg-white rounded-lg py-2 pl-11 pr-4 text-sm text-text-main transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="pill-zar hidden sm:block">
              Balance: R 12,450.00
            </div>
            
            <div className="relative group">
              <button className="flex items-center gap-2">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-border-subtle"
                  referrerPolicy="no-referrer"
                />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-border-subtle py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all transform origin-top-right">
                 <div className="px-4 py-2 border-b border-border-subtle">
                    <p className="text-xs font-bold text-text-main truncate">{user.displayName}</p>
                    <p className="text-[10px] text-secondary truncate">{user.email}</p>
                 </div>
                 <button 
                   onClick={() => navigate('/dashboard')}
                   className="w-full text-left px-4 py-2 text-xs font-semibold text-secondary hover:bg-slate-50 transition-colors"
                 >
                   Dashboard
                 </button>
                 <button 
                   onClick={logout}
                   className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                 >
                   Sign Out
                 </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={signIn}
            className="bg-accent text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-brand-dark transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

