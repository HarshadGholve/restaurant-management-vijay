import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { useOrders } from '../context/OrderContext';

export default function SettingsView() {
  const { t, lang, toggleLang } = useLang();
  const { totalTables, setTotalTables, tables, history, getTableTotal } = useOrders();
  const [inputTables, setInputTables] = useState(totalTables.toString());

  const today = new Date().toISOString().split('T')[0];
  
  // Current revenue from tables that are currently billed but not yet cleared
  const currentBilledRevenue = tables
    .filter(tb => tb.status === 'billed')
    .reduce((sum, tb) => sum + getTableTotal(tb.tableId), 0);

  // Revenue from archived (cleared) orders for today
  const archivedRevenue = (history || [])
    .filter(order => order.archivedAt && order.archivedAt.startsWith(today))
    .reduce((sum, order) => sum + (order.total || 0), 0);

  const totalRevenue = currentBilledRevenue + archivedRevenue;

  const handleSaveTables = () => {
    const n = parseInt(inputTables);
    if (n >= 1 && n <= 50) {
      setTotalTables(n);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <div className="bg-white/80 backdrop-blur-md px-5 pt-12 pb-4 border-b border-slate-100 sticky top-0 z-20">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">{t('सेटिंग्ज', 'Settings')}</h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{t('न्यू हॉटेल विजय', 'New Hotel Vijay')}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-24 space-y-5">
        {/* Restaurant Info */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100">
          <h2 className="font-extrabold text-slate-800 mb-4 text-sm uppercase tracking-widest">{t('हॉटेल माहिती', 'Restaurant Info')}</h2>
          <div className="bg-[linear-gradient(135deg,var(--color-alice-blue),var(--color-sky-blue))] rounded-2xl p-5 text-center shadow-inner border border-white">
            <p className="text-2xl font-extrabold text-slate-800 tracking-tight">{t('न्यू हॉटेल विजय', 'New Hotel Vijay')}</p>
            <p className="text-slate-700 text-xs font-bold uppercase tracking-widest mt-1.5">{t('व्हेज - नॉनव्हेज', 'Veg - Non Veg')}</p>
            <div className="flex justify-center gap-3 mt-4">
              <span className="bg-white/50 backdrop-blur-sm text-emerald-700 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm border border-white/60">🟢 {t('व्हेज', 'Veg')}</span>
              <span className="bg-white/50 backdrop-blur-sm text-rose-700 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm border border-white/60">🔴 {t('नॉनव्हेज', 'Non-Veg')}</span>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100">
          <h2 className="font-extrabold text-slate-800 mb-4 text-sm uppercase tracking-widest">{t('भाषा', 'Language')}</h2>
          <div className="flex gap-3">
            <button
              onClick={() => lang !== 'mr' && toggleLang()}
              className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all border-2 ${
                lang === 'mr'
                  ? 'border-slate-800 bg-slate-800 text-white shadow-md shadow-slate-800/20'
                  : 'border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => lang !== 'en' && toggleLang()}
              className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all border-2 ${
                lang === 'en'
                  ? 'border-slate-800 bg-slate-800 text-white shadow-md shadow-slate-800/20'
                  : 'border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Tables Config */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100">
          <h2 className="font-extrabold text-slate-800 mb-2 text-sm uppercase tracking-widest">{t('टेबल सेटिंग', 'Table Settings')}</h2>
          <p className="text-xs font-medium text-slate-500 mb-4">{t('हॉटेलमधील एकूण टेबलची संख्या:', 'Total number of tables in restaurant:')}</p>
          <div className="flex gap-3">
            <input
              type="number"
              min={1}
              max={50}
              value={inputTables}
              onChange={e => setInputTables(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-extrabold text-center outline-none focus:border-slate-400 focus:bg-white transition-all"
            />
            <button
              onClick={handleSaveTables}
              className="bg-[var(--color-sky-blue-2)] text-slate-900 px-6 rounded-xl font-bold text-sm shadow-md shadow-[var(--color-sky-blue-2)]/30 hover:-translate-y-0.5 transition-transform"
            >
              {t('जतन करा', 'Save')}
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[4, 6, 8, 10, 12, 15, 20, 25].map(n => (
              <button
                key={n}
                onClick={() => { setInputTables(n.toString()); setTotalTables(n); }}
                className={`py-2.5 rounded-xl text-sm font-extrabold transition-all border-2 ${
                  totalTables === n
                    ? 'border-slate-800 bg-slate-800 text-white shadow-md'
                    : 'border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100">
          <h2 className="font-extrabold text-slate-800 mb-4 text-sm uppercase tracking-widest">{t('आजचा सारांश', "Today's Summary")}</h2>
          <div className="space-y-1">
            <div className="flex justify-between items-center py-3 border-b border-slate-50">
              <span className="text-slate-600 font-bold text-sm">{t('एकूण टेबल', 'Total Tables')}</span>
              <span className="font-extrabold text-slate-800 text-lg bg-slate-50 px-3 py-1 rounded-lg">{totalTables}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-50">
              <span className="text-slate-600 font-bold text-sm">{t('सक्रिय टेबल', 'Active Tables')}</span>
              <span className="font-extrabold text-[var(--color-sky-blue-2)] text-lg bg-[var(--color-alice-blue)] px-3 py-1 rounded-lg">{tables.filter(tb => tb.status === 'active').length}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-50">
              <span className="text-slate-600 font-bold text-sm">{t('बिल झालेले', 'Completed Bills')}</span>
              <span className="font-extrabold text-emerald-500 text-lg bg-emerald-50 px-3 py-1 rounded-lg">{tables.filter(tb => tb.status === 'billed').length}</span>
            </div>
            <div className="flex justify-between items-center py-4 mt-1 bg-slate-800 rounded-2xl px-4 shadow-lg shadow-slate-900/10">
              <span className="text-slate-300 font-bold text-sm">{t('आजची एकूण कमाई', "Today's Revenue")}</span>
              <span className="font-extrabold text-white text-2xl tracking-tight">₹{totalRevenue}</span>
            </div>
          </div>
        </div>

        {/* Menu Stats */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100">
          <h2 className="font-extrabold text-slate-800 mb-4 text-sm uppercase tracking-widest">{t('मेनू माहिती', 'Menu Info')}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
              <p className="text-3xl font-extrabold text-emerald-600">90+</p>
              <p className="text-[10px] font-bold text-emerald-700 mt-1 uppercase tracking-widest">{t('एकूण पदार्थ', 'Total Items')}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
              <p className="text-3xl font-extrabold text-slate-700">10</p>
              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{t('श्रेणी', 'Categories')}</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-2 pb-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('न्यू हॉटेल विजय मॅनेजर', 'New Hotel Vijay Manager')} <span className="opacity-50">v2.0</span></p>
        </div>
      </div>
    </div>
  );
}
