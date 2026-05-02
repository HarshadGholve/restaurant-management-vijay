import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { useOrders, ArchivedOrder } from '../context/OrderContext';

interface OrdersViewProps {
  onNavigate: (page: string) => void;
}

export default function OrdersView({ onNavigate }: OrdersViewProps) {
  const { t } = useLang();
  const { tables, history, getTableTotal, clearTable } = useOrders();
  const [selectedHistoryOrder, setSelectedHistoryOrder] = useState<ArchivedOrder | null>(null);

  const activeTables = tables.filter(tb => tb.status === 'active');
  const billedTables = tables.filter(tb => tb.status === 'billed');
  
  const today = new Date().toISOString().split('T')[0];
  const todayHistory = (history || []).filter(order => order.archivedAt && order.archivedAt.startsWith(today));

  const getElapsedTime = (startTime: string) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(startTime).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins} ${t('मि.', 'min')}`;
    return `${Math.floor(mins / 60)}${t('त', 'h')} ${mins % 60}${t('मि.', 'm')}`;
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] relative">
      {/* Synchronized Header */}
      <div className="bg-white/80 backdrop-blur-md px-6 pt-12 pb-5 border-b border-slate-100 sticky top-0 z-20">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t('सर्व ऑर्डर', 'All Orders')}</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
          {activeTables.length + billedTables.length} {t('सक्रिय', 'active')} • {todayHistory.length} {t('पूर्ण', 'completed today')}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24 no-scrollbar">
        {/* Active Orders */}
        {activeTables.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2.5 h-2.5 bg-sky-500 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.6)] animate-pulse" />
              <h2 className="font-black text-slate-800 text-xs uppercase tracking-[0.15em]">{t('चालू ऑर्डर', 'Active Orders')}</h2>
            </div>
            <div className="space-y-4">
              {activeTables.map(table => (
                <button
                  key={table.tableId}
                  onClick={() => onNavigate(`table-${table.tableId}`)}
                  className="w-full bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 active:scale-[0.98] transition-all hover:border-sky-200"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-black text-lg">{table.tableId}</span>
                      </div>
                      <div className="text-left">
                        <p className="font-black text-slate-800 text-base">{t(`टेबल ${table.tableId}`, `Table ${table.tableId}`)}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{table.guestCount} {t('अतिथी', 'guests')} • {getElapsedTime(table.startTime)} {t('आधी', 'ago')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-800 text-xl">₹{getTableTotal(table.tableId)}</p>
                      <span className="bg-sky-50 text-sky-600 text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest mt-1.5 inline-block">{t('सक्रिय', 'Active')}</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-50 pt-4 space-y-2.5">
                    {(table.items || []).slice(0, 3).map((oi, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500 truncate pr-4">
                          {t(oi.menuItem.nameMarathi, oi.menuItem.nameEnglish)} 
                          {oi.variant ? <span className="text-[9px] font-black text-slate-300 ml-1">({oi.variant === 'half' ? 'H' : 'F'})</span> : ''} 
                          <span className="text-slate-300 font-black ml-1">×{oi.quantity}</span>
                        </span>
                        <span className="font-black text-slate-700">₹{oi.priceUsed * oi.quantity}</span>
                      </div>
                    ))}
                    {(table.items || []).length > 3 && (
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">+{(table.items || []).length - 3} {t('अधिक', 'more')}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Billed Orders */}
        {billedTables.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              <h2 className="font-black text-slate-800 text-xs uppercase tracking-[0.15em]">{t('बिल झालेले', 'Billed Orders')}</h2>
            </div>
            <div className="space-y-4">
              {billedTables.map(table => (
                <div key={table.tableId} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center">
                        <span className="text-emerald-600 font-black text-lg">{table.tableId}</span>
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-base">{t(`टेबल ${table.tableId}`, `Table ${table.tableId}`)}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{(table.items || []).length} {t('पदार्थ', 'items')} • {table.guestCount} {t('अतिथी', 'guests')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-800 text-xl opacity-80">₹{getTableTotal(table.tableId)}</p>
                      <span className="bg-emerald-50 text-emerald-600 text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest mt-1.5 inline-block">{t('पैसे बाकी', 'Billed')}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => clearTable(table.tableId)}
                      className="flex-1 bg-rose-50 text-rose-500 py-3.5 rounded-2xl text-xs font-black border border-rose-100 active:scale-95 transition-all"
                    >
                      {t('टेबल साफ करा', 'Free Table')}
                    </button>
                    <button
                      onClick={() => onNavigate(`table-${table.tableId}`)}
                      className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
                    >
                      {t('पहा', 'View')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Orders (Today) */}
        {todayHistory.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2.5 h-2.5 bg-slate-300 rounded-full" />
              <h2 className="font-black text-slate-800 text-xs uppercase tracking-[0.15em]">{t('आजचा इतिहास', "Today's History")}</h2>
            </div>
            <div className="space-y-3">
              {todayHistory.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedHistoryOrder(order)}
                  className="w-full bg-white/60 rounded-2xl p-4 border border-slate-50 flex items-center justify-between active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <span className="text-slate-500 font-black text-sm">{order.tableId}</span>
                    </div>
                    <div className="text-left">
                      <p className="font-black text-slate-700 text-sm">{t(`टेबल ${order.tableId}`, `Table ${order.tableId}`)}</p>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{formatTime(order.archivedAt)} • {(order.items || []).length} {t('पदार्थ', 'items')}</p>
                    </div>
                  </div>
                  <p className="font-black text-slate-800 text-sm">₹{order.total}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTables.length === 0 && billedTables.length === 0 && todayHistory.length === 0 && (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
              <span className="text-5xl">📋</span>
            </div>
            <p className="font-black text-slate-800 text-lg">{t('कोणतेही ऑर्डर नाहीत', 'No orders yet')}</p>
            <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest leading-loose">{t('सध्या कोणतेही सक्रिय किंवा\nपूर्ण ऑर्डर नाहीत', 'No active or completed\norders right now')}</p>
          </div>
        )}
      </div>

      {/* History Detail Modal (Polished) */}
      {selectedHistoryOrder && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedHistoryOrder(null)}
          />
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-slideUp">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900">{t('ऑर्डर तपशील', 'Order Details')}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1.5">
                  {t('टेबल', 'Table')} {selectedHistoryOrder.tableId} • {formatTime(selectedHistoryOrder.archivedAt)}
                </p>
              </div>
              <button 
                onClick={() => setSelectedHistoryOrder(null)}
                className="w-12 h-12 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-all"
              >
                ✕
              </button>
            </div>
            
            <div className="p-8 max-h-[50vh] overflow-y-auto no-scrollbar">
              <div className="space-y-5">
                {(selectedHistoryOrder.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="bg-slate-100 rounded-xl w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-black text-slate-500">×{item.quantity}</span>
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm leading-tight">{t(item.menuItem.nameMarathi, item.menuItem.nameEnglish)}</p>
                        {item.variant && (
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 inline-block">
                            {item.variant === 'half' ? t('हाफ', 'Half') : t('फुल', 'Full')}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="font-black text-slate-800 text-sm">₹{item.priceUsed * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-dashed border-slate-200 space-y-3">
                <div className="flex justify-between text-slate-400 text-[11px] font-black uppercase tracking-widest">
                  <span>{t('अतिथी', 'Guests')}</span>
                  <span className="text-slate-800">{selectedHistoryOrder.guestCount}</span>
                </div>
                {selectedHistoryOrder.notes && (
                  <div className="flex justify-between text-slate-400 text-[11px] font-black uppercase tracking-widest">
                    <span>{t('टिपणी', 'Notes')}</span>
                    <span className="text-slate-800">{selectedHistoryOrder.notes}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 text-2xl font-black pt-6">
                  <span className="tracking-tighter">{t('एकूण बिल', 'Total Bill')}</span>
                  <span className="text-3xl">₹{selectedHistoryOrder.total}</span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white border-t border-slate-50">
              <button 
                onClick={() => setSelectedHistoryOrder(null)}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-sm shadow-2xl shadow-slate-900/30 active:scale-[0.98] transition-all"
              >
                {t('बंद करा', 'Close Window')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
