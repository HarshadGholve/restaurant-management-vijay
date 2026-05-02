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
      <div className="flex flex-col h-[100dvh] w-full bg-slate-900 max-w-md mx-auto relative overflow-hidden shadow-2xl">
        <LoginView onLogin={handleLogin} />
      </div>
    );
  }

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-white">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-800 rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-bold tracking-tight text-sm uppercase">{t('माहिती लोड होत आहे...', 'Syncing Data...')}</p>
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

  // Helper to get translated sync text
  const t = (mr: string, en: string) => (localStorage.getItem('lang') === 'mr' ? mr : en);

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-white max-w-md mx-auto relative overflow-hidden shadow-2xl sm:rounded-[3rem] sm:my-4 sm:h-[calc(100dvh-2rem)] border-0 sm:border-8 border-white/50">
      {/* Content Area */}
      <div className="flex-1 relative flex flex-col overflow-hidden">
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
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 overflow-hidden">
          <AppContent />
        </div>
      </OrderProvider>
    </LanguageProvider>
  );
}
