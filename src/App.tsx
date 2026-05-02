import { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { OrderProvider, useOrders } from './context/OrderContext';
import Dashboard from './components/Dashboard';
import TablesView from './components/TablesView';
import TableOrderView from './components/TableOrderView';
import MenuView from './components/MenuView';
import OrdersView from './components/OrdersView';
import SettingsView from './components/SettingsView';
import BottomNav from './components/BottomNav';
import LoginView from './components/LoginView';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isLoading } = useOrders();

  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn');
    if (auth === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const navigate = (page: string) => setCurrentPage(page);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-screen bg-[#f8fafc] max-w-sm mx-auto relative overflow-hidden" style={{ maxHeight: '100dvh' }}>
        <LoginView onLogin={handleLogin} />
      </div>
    );
  }

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Syncing data...</p>
        </div>
      );
    }

    if (currentPage === 'home') return <Dashboard onNavigate={navigate} />;
    if (currentPage === 'tables') return <TablesView onNavigate={navigate} />;
    if (currentPage.startsWith('table-')) {
      const tableId = parseInt(currentPage.replace('table-', ''));
      return <TableOrderView tableId={tableId} onNavigate={navigate} />;
    }
    if (currentPage === 'menu') return <MenuView />;
    if (currentPage === 'orders') return <OrdersView onNavigate={navigate} />;
    if (currentPage === 'settings') return <SettingsView />;
    return <Dashboard onNavigate={navigate} />;
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] max-w-sm mx-auto relative overflow-hidden" style={{ maxHeight: '100dvh' }}>
      {/* Phone frame shadow for desktop */}
      <div className="absolute inset-0 shadow-[0_0_40px_rgba(131,201,244,0.15)] rounded-none sm:rounded-[2.5rem] pointer-events-none z-50 border-0 sm:border-8 border-white/50" />

      {/* Content */}
      <div className="flex-1 overflow-x-hidden bg-[#f8fafc]">
        {renderPage()}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentPage={currentPage} onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <OrderProvider>
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
          <AppContent />
        </div>
      </OrderProvider>
    </LanguageProvider>
  );
}
