import { useLang } from '../context/LanguageContext';
import { useOrders } from '../context/OrderContext';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { t, lang, toggleLang } = useLang();
  const { tables, history, activeOrdersCount, getTableTotal } = useOrders();

  // Using UTC-based reset (resets around 5:30 AM local time)
  const today = new Date().toISOString().split('T')[0];

  // Current revenue from tables that are currently billed but not yet cleared
  const currentBilledRevenue = tables
    .filter(t => t.status === 'billed')
    .reduce((sum, table) => sum + getTableTotal(table.tableId), 0);

  // Revenue from archived (cleared) orders for today
  const archivedRevenue = (history || [])
    .filter(order => order.archivedAt && order.archivedAt.startsWith(today))
    .reduce((sum, order) => sum + (order.total || 0), 0);

  const totalRevenue = currentBilledRevenue + archivedRevenue;

  // Active revenue is from tables currently in 'active' status
  const activeRevenue = tables
    .filter(t => t.status === 'active')
    .reduce((sum, table) => sum + getTableTotal(table.tableId), 0);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-[linear-gradient(135deg,var(--color-alice-blue),var(--color-sky-blue),var(--color-sky-blue-2))] text-slate-800 px-5 pt-12 pb-8 rounded-b-[2.5rem] shadow-[0_10px_30px_rgba(131,201,244,0.2)] relative overflow-hidden border-b border-white/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-slate-600 text-[10px] font-bold tracking-widest uppercase mb-1">{t('स्वागत आहे', 'Welcome')}</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 leading-none">{t('न्यू हॉटेल विजय', 'New Hotel Vijay')}</h1>
            <p className="text-slate-600 text-sm mt-1.5 font-medium">{t('व्हेज - नॉनव्हेज', 'Veg - Non Veg')}</p>
          </div>
          <button
            onClick={toggleLang}
            className="bg-white/40 hover:bg-white/50 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 border border-white/60 shadow-sm transition-all"
          >
            {lang === 'mr' ? 'EN' : 'मर'}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-7 relative z-10">
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-3.5 text-center border border-white/60 shadow-sm">
            <p className="text-2xl font-extrabold text-slate-800">{activeOrdersCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-600 mt-1 font-bold">{t('सक्रिय टेबल', 'Active Tables')}</p>
          </div>
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-3.5 text-center border border-white/60 shadow-sm">
            <p className="text-2xl font-extrabold text-slate-800">₹{activeRevenue}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-600 mt-1 font-bold">{t('चालू बिल', 'Pending Bills')}</p>
          </div>
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-3.5 text-center border border-white/60 shadow-sm">
            <p className="text-2xl font-extrabold text-slate-800">₹{totalRevenue}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-600 mt-1 font-bold">{t('आजची कमाई', "Today's Revenue")}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mt-6">
        <h2 className="text-slate-800 font-bold text-lg mb-3 tracking-tight">{t('जलद क्रिया', 'Quick Actions')}</h2>
        <div className="grid grid-cols-2 gap-3.5">
          <button
            onClick={() => onNavigate('tables')}
            className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-start gap-3 active:scale-[0.98] transition-all hover:shadow-[0_8px_30px_rgba(131,201,244,0.15)] hover:border-[var(--color-alice-blue)]"
          >
            <div className="w-12 h-12 bg-[var(--color-alice-blue)] rounded-2xl flex items-center justify-center text-2xl shadow-inner">
              🪑
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 text-sm leading-tight">{t('टेबल व्यवस्थापन', 'Table Management')}</p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">{t('टेबल पहा व ऑर्डर द्या', 'View & take orders')}</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('menu')}
            className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-start gap-3 active:scale-[0.98] transition-all hover:shadow-[0_8px_30px_rgba(131,201,244,0.15)] hover:border-[var(--color-alice-blue)]"
          >
            <div className="w-12 h-12 bg-[var(--color-alice-blue)] rounded-2xl flex items-center justify-center text-2xl shadow-inner">
              📋
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 text-sm leading-tight">{t('मेनू पहा', 'View Menu')}</p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">{t('सर्व पदार्थ', 'Browse all items')}</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('orders')}
            className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-start gap-3 active:scale-[0.98] transition-all hover:shadow-[0_8px_30px_rgba(131,201,244,0.15)] hover:border-[var(--color-alice-blue)]"
          >
            <div className="w-12 h-12 bg-[var(--color-alice-blue)] rounded-2xl flex items-center justify-center text-2xl shadow-inner">
              📝
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 text-sm leading-tight">{t('सर्व ऑर्डर', 'All Orders')}</p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">{t('ऑर्डर स्थिती', 'Order status')}</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-start gap-3 active:scale-[0.98] transition-all hover:shadow-[0_8px_30px_rgba(131,201,244,0.15)] hover:border-[var(--color-alice-blue)]"
          >
            <div className="w-12 h-12 bg-[var(--color-alice-blue)] rounded-2xl flex items-center justify-center text-2xl shadow-inner">
              ⚙️
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 text-sm leading-tight">{t('सेटिंग्ज', 'Settings')}</p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">{t('टेबल संख्या बदला', 'Configure tables')}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Active Tables Preview */}
      {activeOrdersCount > 0 && (
        <div className="px-5 mt-8 pb-6">
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-slate-800 font-bold text-lg tracking-tight">{t('सक्रिय ऑर्डर', 'Active Orders')}</h2>
            <button onClick={() => onNavigate('tables')} className="text-xs font-bold text-[var(--color-sky-blue-2)] uppercase tracking-wider">{t('सर्व पहा', 'View All')}</button>
          </div>
          <div className="space-y-3">
            {tables
              .filter(tb => tb.status === 'active')
              .map(tb => (
                <button
                  key={tb.tableId}
                  onClick={() => onNavigate(`table-${tb.tableId}`)}
                  className="w-full bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between active:scale-[0.98] transition-all hover:shadow-[0_8px_30px_rgba(131,201,244,0.15)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-[linear-gradient(135deg,var(--color-sky-blue),var(--color-sky-blue-2))] rounded-[14px] flex items-center justify-center shadow-inner">
                      <span className="text-white text-base font-extrabold">{tb.tableId}</span>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800 text-base leading-tight">
                        {t(`टेबल ${tb.tableId}`, `Table ${tb.tableId}`)}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        {(tb.items || []).length} {t('पदार्थ', 'items')} • {tb.guestCount} {t('अतिथी', 'guests')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-lg text-slate-800">₹{getTableTotal(tb.tableId)}</p>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-sky-blue-2)] animate-pulse"></span>
                      <p className="text-[10px] font-bold text-[var(--color-sky-blue-2)] uppercase tracking-wider">{t('चालू', 'active')}</p>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
