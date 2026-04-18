import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Users, MessageSquare, Wallet } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { icon: LayoutGrid, path: '/', label: 'Marketplace' },
    { icon: Users, path: '/dashboard', label: 'Creators' },
    { icon: MessageSquare, path: '/community', label: 'Community' },
    { icon: Wallet, path: '/payouts', label: 'Payouts' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-20 bg-sidebar-bg flex flex-col items-center py-6 border-r border-border-subtle z-50">
      <Link to="/" className="w-10 h-10 bg-gradient-to-br from-accent to-brand-dark rounded-xl mb-12 flex items-center justify-center font-extrabold text-white text-xl">
        M
      </Link>
      
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
              location.pathname === item.path 
                ? "bg-accent text-white shadow-lg shadow-accent/20" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
            title={item.label}
          >
            <item.icon className="w-6 h-6" />
          </Link>
        ))}
      </nav>
    </aside>
  );
}
