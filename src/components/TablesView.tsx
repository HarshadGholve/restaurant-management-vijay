import { useLang } from '../context/LanguageContext';
import { useOrders } from '../context/OrderContext';

interface TablesViewProps {
  onNavigate: (page: string) => void;
}

export default function TablesView({ onNavigate }: TablesViewProps) {
  const { t } = useLang();
  const { tables, getTableTotal } = useOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[var(--color-sky-blue-2)] shadow-[0_0_10px_var(--color-sky-blue-2)]';
      case 'billed': return 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]';
      default: return 'bg-slate-200';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active': return 'bg-white border-[var(--color-sky-blue-2)] shadow-[0_4px_20px_rgba(131,201,244,0.15)] ring-1 ring-[var(--color-sky-blue-2)]/50';
      case 'billed': return 'bg-emerald-50 border-emerald-300 shadow-sm';
      default: return 'bg-white border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('सक्रिय', 'Active');
      case 'billed': return t('बिल झाले', 'Billed');
      default: return t('रिकामे', 'Free');
    }
  };

  const getElapsedTime = (startTime: string) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(startTime).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <div className="bg-white/80 backdrop-blur-md px-5 pt-12 pb-4 border-b border-slate-100 sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">{t('टेबल व्यवस्थापन', 'Table Management')}</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          {tables.filter(t => t.status === 'active').length} {t('सक्रिय', 'active')} •{' '}
          {tables.filter(t => t.status === 'cleared').length} {t('रिकामे', 'free')}
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-5 px-5 py-3 bg-white/50 backdrop-blur-sm border-b border-slate-50">
        {[
          { color: 'bg-slate-200', label: t('रिकामे', 'Free') },
          { color: 'bg-[var(--color-sky-blue-2)]', label: t('सक्रिय', 'Active') },
          { color: 'bg-emerald-400', label: t('बिल झाले', 'Billed') },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24">
        <div className="grid grid-cols-3 gap-3">
          {tables.map(table => (
            <button
              key={table.tableId}
              onClick={() => onNavigate(`table-${table.tableId}`)}
              className={`rounded-2xl p-4 border flex flex-col items-center gap-2 active:scale-[0.98] transition-all duration-300 ${getStatusBg(table.status)} hover:-translate-y-1`}
            >
              <div className="relative">
                <div className="w-14 h-14 bg-white rounded-[14px] shadow-sm flex items-center justify-center border border-slate-100">
                  <span className="text-xl font-extrabold text-slate-700">{table.tableId}</span>
                </div>
                <div className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusColor(table.status)}`} />
                {table.status !== 'cleared' && (
                  <div className="absolute -bottom-1 -right-1 bg-white border border-slate-100 px-1.5 py-0.5 rounded-md shadow-sm">
                    <p className="text-[8px] font-black text-slate-500 whitespace-nowrap">{getElapsedTime(table.startTime)}</p>
                  </div>
                )}
              </div>
              <div className="text-center w-full mt-1">
                <p className="text-xs font-bold text-slate-800 tracking-wide uppercase">{t(`टेबल`, 'Table')} {table.tableId}</p>
                <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${table.status === 'active' ? 'text-[var(--color-sky-blue-2)]' : table.status === 'billed' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {getStatusText(table.status)}
                </p>
                {table.status !== 'cleared' && (
                  <p className="text-sm font-extrabold text-slate-800 mt-1.5">₹{getTableTotal(table.tableId)}</p>
                )}
                {table.status === 'active' && (
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5 bg-slate-50 rounded-md py-0.5 mx-1">{(table.items || []).length} {t('पदार्थ', 'items')}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
