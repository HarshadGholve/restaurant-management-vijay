import { useLang } from '../context/LanguageContext';
import { useOrders } from '../context/OrderContext';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const { t } = useLang();
  const { activeOrdersCount } = useOrders();

  const getBase = (page: string) => {
    if (page.startsWith('table-')) return 'tables';
    return page;
  };

  const active = getBase(currentPage);

  const tabs = [
    { id: 'home', icon: '🏠', label: t('होम', 'Home') },
    { id: 'tables', icon: '🪑', label: t('टेबल', 'Tables'), badge: activeOrdersCount },
    { id: 'menu', icon: '📋', label: t('मेनू', 'Menu') },
    { id: 'orders', icon: '📝', label: t('ऑर्डर', 'Orders') },
    { id: 'settings', icon: '⚙️', label: t('सेटिंग', 'Settings') },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] flex-shrink-0 relative z-50">
      <div className="flex px-2 py-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 px-1 gap-1 transition-all duration-300 rounded-2xl ${
              active === tab.id ? 'bg-[var(--color-alice-blue)] scale-105' : 'bg-transparent text-slate-400 hover:bg-slate-50'
            }`}
          >
            <div className="relative">
              <span className={`text-xl leading-none block transition-transform duration-300 ${active === tab.id ? 'scale-110' : 'scale-100'}`}>
                {tab.icon}
              </span>
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm shadow-red-200">
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span className={`text-[10px] font-bold transition-colors duration-300 ${active === tab.id ? 'text-[var(--color-sky-blue-2)]' : 'text-slate-400'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
      <div className="h-safe-area-bottom bg-white/80 backdrop-blur-xl" style={{ height: 'env(safe-area-inset-bottom)' }} />
    </div>
  );
}
