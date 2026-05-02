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
      case 'active': return 'bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.4)]';
      case 'billed': return 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.4)]';
      default: return 'bg-slate-200';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active': return 'bg-white border-sky-100 shadow-[0_4px_20px_rgba(56,189,248,0.08)]';
      case 'billed': return 'bg-emerald-50/50 border-emerald-100 shadow-sm';
      default: return 'bg-white border-slate-100 shadow-sm';
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
      {/* Synchronized Header */}
      <div className="bg-white/80 backdrop-blur-md px-6 pt-12 pb-5 border-b border-slate-100 sticky top-0 z-20">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t('टेबल व्यवस्थापन', 'Table Management')}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {tables.filter(t => t.status === 'active').length} {t('सक्रिय', 'active')} •{' '}
            {tables.filter(t => t.status === 'cleared' || t.status === 'cleared').length} {t('रिकामे', 'free')}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 px-6 py-3 bg-white/40 backdrop-blur-sm border-b border-slate-50 overflow-x-auto no-scrollbar">
        {[
          { color: 'bg-slate-200', label: t('रिकामे', 'Free') },
          { color: 'bg-sky-400', label: t('सक्रिय', 'Active') },
          { color: 'bg-emerald-400', label: t('बिल झाले', 'Billed') },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2 flex-shrink-0">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="grid grid-cols-3 gap-4">
          {tables.map(table => (
            <button
              key={table.tableId}
              onClick={() => onNavigate(`table-${table.tableId}`)}
              className={`relative rounded-3xl p-4 border flex flex-col items-center gap-2 active:scale-95 transition-all duration-300 ${getStatusBg(table.status)} hover:shadow-md`}
            >
              <div className="relative">
                <div className={`w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center border ${table.status !== 'cleared' ? 'border-transparent' : 'border-slate-100'}`}>
                  <span className={`text-xl font-black ${table.status !== 'cleared' ? 'text-slate-800' : 'text-slate-400'}`}>{table.tableId}</span>
                </div>
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(table.status)}`} />
                {table.status !== 'cleared' && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-2 py-0.5 rounded-full shadow-lg">
                    <p className="text-[7px] font-black whitespace-nowrap uppercase tracking-tighter">{getElapsedTime(table.startTime)}</p>
                  </div>
                )}
              </div>
              <div className="text-center w-full mt-2">
                <p className={`text-[9px] font-black uppercase tracking-widest ${table.status === 'active' ? 'text-sky-500' : table.status === 'billed' ? 'text-emerald-500' : 'text-slate-300'}`}>
                  {getStatusText(table.status)}
                </p>
                {table.status !== 'cleared' && (
                  <p className="text-sm font-black text-slate-800 mt-1">₹{getTableTotal(table.tableId)}</p>
                )}
                {table.status === 'active' && (
                  <div className="mt-1 flex items-center justify-center gap-1">
                     <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                     <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">{(table.items || []).length} {t('पदार्थ', 'items')}</p>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
