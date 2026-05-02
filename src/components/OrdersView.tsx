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
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] relative">
      <div className="bg-white/80 backdrop-blur-md px-5 pt-12 pb-4 border-b border-slate-100 sticky top-0 z-20">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">{t('सर्व ऑर्डर', 'All Orders')}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-24">
        {/* Active Orders */}
        {activeTables.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2.5 h-2.5 bg-[var(--color-sky-blue-2)] rounded-full shadow-[0_0_8px_var(--color-sky-blue-2)] animate-pulse" />
              <h2 className="font-extrabold text-slate-800 text-base uppercase tracking-widest">{t('सक्रिय ऑर्डर', 'Active Orders')}</h2>
              <span className="bg-[var(--color-alice-blue)] text-[var(--color-sky-blue-2)] text-xs px-2.5 py-0.5 rounded-md font-bold">{activeTables.length}</span>
            </div>
            <div className="space-y-4">
              {activeTables.map(table => (
                <button
                  key={table.tableId}
                  onClick={() => onNavigate(`table-${table.tableId}`)}
                  className="w-full bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 active:scale-[0.98] transition-all hover:shadow-[0_8px_30px_rgba(131,201,244,0.15)] hover:border-[var(--color-sky-blue-2)] group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-[14px] flex items-center justify-center shadow-md shadow-slate-800/20 group-hover:bg-[var(--color-sky-blue-2)] transition-colors">
                        <span className="text-white font-extrabold text-lg">{table.tableId}</span>
                      </div>
                      <div className="text-left">
                        <p className="font-extrabold text-slate-800 text-base">{t(`टेबल ${table.tableId}`, `Table ${table.tableId}`)}</p>
                        <p className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{table.guestCount} {t('अतिथी', 'guests')} • {getElapsedTime(table.startTime)} {t('आधी', 'ago')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-800 text-xl">₹{getTableTotal(table.tableId)}</p>
                      <span className="bg-[var(--color-alice-blue)] text-[var(--color-sky-blue-2)] text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider mt-1 inline-block">{t('सक्रिय', 'Active')}</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-3 mt-1 space-y-2">
                    {(table.items || []).slice(0, 3).map((oi, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-medium text-slate-600 truncate pr-4 text-left">
                          {t(oi.menuItem.nameMarathi, oi.menuItem.nameEnglish)} 
                          {oi.variant ? <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{oi.variant === 'half' ? t('हाफ', 'H') : t('फुल', 'F')}</span> : ''} 
                          <span className="text-slate-400 font-bold ml-1">×{oi.quantity}</span>
                        </span>
                        <span className="font-bold text-slate-700">₹{oi.priceUsed * oi.quantity}</span>
                      </div>
                    ))}
                    {(table.items || []).length > 3 && (
                      <p className="text-[11px] font-bold text-slate-400 text-left uppercase tracking-wider pt-1">+{(table.items || []).length - 3} {t('अधिक...', 'more...')}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Billed Orders */}
        {billedTables.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
              <h2 className="font-extrabold text-slate-800 text-base uppercase tracking-widest">{t('बिल झालेले ऑर्डर', 'Completed Orders')}</h2>
              <span className="bg-emerald-50 text-emerald-600 text-xs px-2.5 py-0.5 rounded-md font-bold">{billedTables.length}</span>
            </div>
            <div className="space-y-4">
              {billedTables.map(table => (
                <div key={table.tableId} className="bg-white/60 rounded-3xl p-5 shadow-sm border border-slate-100 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white border-2 border-emerald-100 rounded-[14px] flex items-center justify-center shadow-sm">
                        <span className="text-emerald-500 font-extrabold text-lg">{table.tableId}</span>
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-800 text-base">{t(`टेबल ${table.tableId}`, `Table ${table.tableId}`)}</p>
                        <p className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{(table.items || []).length} {t('पदार्थ', 'items')} • {table.guestCount} {t('अतिथी', 'guests')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-800 text-xl opacity-80">₹{getTableTotal(table.tableId)}</p>
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider mt-1 inline-block">{t('बिल झाले', 'Billed')}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => clearTable(table.tableId)}
                      className="flex-1 bg-white text-rose-500 py-2.5 rounded-xl text-xs font-bold border border-rose-100 shadow-sm hover:bg-rose-50 transition-colors"
                    >
                      {t('टेबल साफ करा', 'Free Table')}
                    </button>
                    <button
                      onClick={() => onNavigate(`table-${table.tableId}`)}
                      className="flex-1 bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-slate-800/10 hover:bg-slate-700 transition-colors"
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2.5 h-2.5 bg-slate-400 rounded-full" />
              <h2 className="font-extrabold text-slate-800 text-base uppercase tracking-widest">{t('आजचे पूर्ण ऑर्डर', "Today's History")}</h2>
              <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-md font-bold">{todayHistory.length}</span>
            </div>
            <div className="space-y-3">
              {todayHistory.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedHistoryOrder(order)}
                  className="w-full bg-white/40 rounded-2xl p-4 border border-slate-100 flex items-center justify-between opacity-80 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                      <span className="text-slate-500 font-bold text-sm">{order.tableId}</span>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-700 text-sm">{t(`टेबल ${order.tableId}`, `Table ${order.tableId}`)}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{formatTime(order.archivedAt)} • {(order.items || []).length} {t('पदार्थ', 'items')}</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-700 text-sm">₹{order.total}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTables.length === 0 && billedTables.length === 0 && todayHistory.length === 0 && (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-slate-100">
              <span className="text-5xl">📋</span>
            </div>
            <p className="font-extrabold text-slate-800 text-lg">{t('कोणतेही ऑर्डर नाहीत', 'No orders yet')}</p>
            <p className="text-sm font-medium text-slate-500 mt-1">{t('टेबलवर जाऊन ऑर्डर द्या', 'Go to tables to take orders')}</p>
          </div>
        )}
      </div>

      {/* History Detail Modal */}
      {selectedHistoryOrder && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedHistoryOrder(null)}
          />
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-800">{t('ऑर्डर तपशील', 'Order Details')}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                  {t('टेबल', 'Table')} {selectedHistoryOrder.tableId} • {formatTime(selectedHistoryOrder.archivedAt)}
                </p>
              </div>
              <button 
                onClick={() => setSelectedHistoryOrder(null)}
                className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-all"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {(selectedHistoryOrder.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="bg-slate-50 rounded-lg px-2 py-1 h-fit">
                        <span className="text-xs font-bold text-slate-600">×{item.quantity}</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{t(item.menuItem.nameMarathi, item.menuItem.nameEnglish)}</p>
                        {item.variant && (
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {item.variant === 'half' ? t('हाफ', 'Half') : t('फुल', 'Full')}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="font-bold text-slate-700 text-sm">₹{item.priceUsed * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-500 text-sm">
                  <span>{t('अतिथी', 'Guests')}</span>
                  <span className="font-bold">{selectedHistoryOrder.guestCount}</span>
                </div>
                {selectedHistoryOrder.notes && (
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>{t('टिपणी', 'Notes')}</span>
                    <span className="font-bold">{selectedHistoryOrder.notes}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-800 text-xl font-black pt-4">
                  <span>{t('एकूण बिल', 'Total Bill')}</span>
                  <span>₹{selectedHistoryOrder.total}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
              <button 
                onClick={() => setSelectedHistoryOrder(null)}
                className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-slate-800/20 active:scale-[0.98] transition-all"
              >
                {t('बंद करा', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
