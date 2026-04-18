import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import HubPage from './pages/HubPage';
import Sidebar from './components/layout/Sidebar';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          
          <div className="flex-1 flex flex-col ml-20 overflow-hidden">
            <Navbar />
            
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/community" element={<Community />} />
                <Route path="/hub/:slug" element={<HubPage />} /> 
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}


