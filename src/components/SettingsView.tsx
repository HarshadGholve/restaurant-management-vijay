import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { useOrders } from '../context/OrderContext';

export default function SettingsView() {
  const { t, lang, toggleLang } = useLang();
  const { totalTables, setTotalTables, tables, history, getTableTotal } = useOrders();
  const [inputTables, setInputTables] = useState(totalTables.toString());

  // Using UTC-based reset (resets around 5:30 AM local time)
  const today = new Date().toISOString().split('T')[0];
  
  const currentBilledRevenue = tables
    .filter(tb => tb.status === 'billed')
    .reduce((sum, tb) => sum + getTableTotal(tb.tableId), 0);

  const todayHistory = (history || [])
    .filter(order => order.archivedAt && order.archivedAt.startsWith(today));

  const archivedRevenue = todayHistory
    .reduce((sum, order) => sum + (order.total || 0), 0);
  
  const totalRevenue = currentBilledRevenue + archivedRevenue;

  // Group history by date for the summary list
  const historyByDate = (history || []).reduce((acc, order) => {
    const date = new Date(order.archivedAt).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + (order.total || 0);
    return acc;
  }, {} as Record<string, number>);

  const last7Days = Object.keys(historyByDate)
    .sort()
    .reverse()
    .slice(0, 7);

  const handleSaveTables = () => {
    const n = parseInt(inputTables);
    if (n >= 1 && n <= 50) {
      setTotalTables(n);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Synchronized Header */}
      <div className="bg-white/80 backdrop-blur-md px-6 pt-12 pb-5 border-b border-slate-100 sticky top-0 z-20">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t('सेटिंग्ज', 'App Settings')}</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('न्यू हॉटेल विजय', 'New Hotel Vijay')}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24 space-y-6 no-scrollbar">
        {/* Restaurant Card */}
        <div className="bg-[linear-gradient(135deg,var(--color-alice-blue),var(--color-sky-blue))] rounded-[2.5rem] p-8 text-center shadow-md border border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <p className="text-2xl font-black text-slate-900 tracking-tight relative z-10">{t('न्यू हॉटेल विजय', 'New Hotel Vijay')}</p>
          <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.2em] mt-2 relative z-10">{t('व्हेज - नॉनव्हेज', 'Veg - Non Veg')}</p>
          <div className="flex justify-center gap-3 mt-6 relative z-10">
            <span className="bg-white/40 backdrop-blur-md text-emerald-800 font-black text-[9px] px-4 py-2 rounded-full uppercase tracking-widest border border-white/40 shadow-sm">🟢 {t('व्हेज', 'Veg')}</span>
            <span className="bg-white/40 backdrop-blur-md text-rose-800 font-black text-[9px] px-4 py-2 rounded-full uppercase tracking-widest border border-white/40 shadow-sm">🔴 {t('नॉनव्हेज', 'Non-Veg')}</span>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h2 className="font-black text-slate-800 mb-5 text-xs uppercase tracking-widest">{t('अ‍ॅपची भाषा', 'Language Selection')}</h2>
          <div className="flex gap-3">
            {[
              { id: 'mr', label: 'मराठी' },
              { id: 'en', label: 'English' },
            ].map(l => (
              <button
                key={l.id}
                onClick={() => lang !== l.id && toggleLang()}
                className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                  lang === l.id
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                    : 'border-slate-50 bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tables Configuration */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h2 className="font-black text-slate-800 mb-2 text-xs uppercase tracking-widest">{t('टेबल संख्या', 'Table Configuration')}</h2>
          <p className="text-[10px] font-bold text-slate-400 mb-5 uppercase tracking-widest leading-relaxed">{t('एकूण किती टेबल आहेत?', 'How many tables are there?')}</p>
          <div className="flex gap-3">
            <input
              type="number"
              min={1}
              max={50}
              value={inputTables}
              onChange={e => setInputTables(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xl font-black text-center outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/5 transition-all"
            />
            <button
              onClick={handleSaveTables}
              className="bg-slate-900 text-white px-8 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
            >
              {t('जतन करा', 'Save')}
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-5">
            {[4, 6, 8, 12, 15, 20, 25, 30].map(n => (
              <button
                key={n}
                onClick={() => { setInputTables(n.toString()); setTotalTables(n); }}
                className={`py-3 rounded-xl text-sm font-black transition-all border-2 ${
                  totalTables === n
                    ? 'border-slate-800 bg-slate-800 text-white shadow-md'
                    : 'border-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Business Summary Stats */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h2 className="font-black text-slate-800 mb-5 text-xs uppercase tracking-widest">{t('आजचा व्यवसाय', "Business Summary")}</h2>
          <div className="space-y-2 mb-6">
            {[
              { label: t('एकूण टेबल', 'Total Tables'), value: totalTables, color: 'text-slate-800', bg: 'bg-slate-50' },
              { label: t('सक्रिय', 'Active'), value: tables.filter(tb => tb.status === 'active').length, color: 'text-sky-500', bg: 'bg-sky-50' },
              { label: t('पूर्ण', 'Completed'), value: tables.filter(tb => tb.status === 'billed').length + todayHistory.length, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            ].map(stat => (
              <div key={stat.label} className="flex justify-between items-center p-4 bg-white border border-slate-50 rounded-2xl">
                <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">{stat.label}</span>
                <span className={`font-black text-lg ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
            
            <div className="flex justify-between items-center p-6 mt-4 bg-slate-900 rounded-[1.5rem] shadow-2xl shadow-slate-900/20">
              <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{t('आजची एकूण कमाई', "Today's Revenue")}</span>
              <span className="font-black text-white text-2xl tracking-tighter">₹{totalRevenue}</span>
            </div>
          </div>

          {/* Revenue History List */}
          <div className="border-t border-slate-50 pt-6">
            <h3 className="font-black text-slate-800 mb-4 text-[10px] uppercase tracking-[0.2em]">{t('मागील ७ दिवसांची कमाई', 'Last 7 Days History')}</h3>
            <div className="space-y-2">
              {last7Days.map(date => (
                <div key={date} className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-xl">
                  <span className="text-[11px] font-black text-slate-500">
                    {date === today ? t('आज', 'Today') : new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                  <span className="font-black text-slate-800 text-sm">₹{historyByDate[date]}</span>
                </div>
              ))}
              {last7Days.length === 0 && (
                <p className="text-[10px] text-slate-400 font-bold text-center py-4 uppercase tracking-widest">{t('अद्याप कोणताही इतिहास नाही', 'No history yet')}</p>
              )}
            </div>
          </div>
        </div>

        <div className="text-center pt-4 pb-10">
          <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-full">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">{t('न्यू हॉटेल विजय अ‍ॅडमिन', 'New Hotel Vijay Admin')} • v2.1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
