import { useState, useMemo } from 'react';
import { useLang } from '../context/LanguageContext';
import { menuItems, categories } from '../data/menuData';

export default function MenuView() {
  const { t } = useLang();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [filterVeg, setFilterVeg] = useState<'veg' | 'nonveg'>('veg');

  // Get visible categories based on the current veg/nonveg filter
  const visibleCategories = useMemo(() => {
    return categories.filter(cat => {
      if (filterVeg === 'veg') return cat.type === 'veg';
      return cat.type === 'nonveg';
    });
  }, [filterVeg]);

  // Handle veg/nonveg filter change — auto-select 'all' categories
  const handleFilterChange = (newFilter: 'veg' | 'nonveg') => {
    setFilterVeg(newFilter);
    setActiveCategory('all');
  };

  // Filter menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      if (search) {
        return item.nameMarathi.includes(search) ||
          item.nameEnglish.toLowerCase().includes(search.toLowerCase());
      }
      if (filterVeg === 'veg' && !item.isVeg) return false;
      if (filterVeg === 'nonveg' && item.isVeg) return false;
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      return true;
    });
  }, [search, activeCategory, filterVeg]);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Synchronized Header */}
      <div className="bg-white/80 backdrop-blur-md px-6 pt-12 pb-5 border-b border-slate-100 sticky top-0 z-20">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t('मेनू कार्ड', 'Menu Card')}</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('न्यू हॉटेल विजय', 'New Hotel Vijay')}</p>

        <div className="relative mt-5">
           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
           <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('पदार्थ शोधा...', 'Search items...')}
            className="w-full bg-slate-100/50 border border-slate-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-slate-800/5 transition-all"
          />
        </div>

        <div className="flex gap-2 mt-4">
          {[
            { key: 'veg', label: t('व्हेज', 'Veg'), color: 'emerald' },
            { key: 'nonveg', label: t('नॉनव्हेज', 'Non-Veg'), color: 'rose' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => handleFilterChange(f.key as 'veg' | 'nonveg')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                filterVeg === f.key 
                  ? f.color === 'emerald' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {!search && (
        <div className="bg-white/40 backdrop-blur-sm border-b border-slate-100 overflow-x-auto no-scrollbar sticky top-[214px] z-10">
          <div className="flex gap-2 px-6 py-3 min-w-max">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2 rounded-full text-[11px] font-black whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-white border border-slate-100 text-slate-600 shadow-sm'
              }`}
            >
              {t('सर्व', 'All')}
            </button>
            {visibleCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-[11px] font-black whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? cat.type === 'nonveg' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                    : 'bg-white border border-slate-100 text-slate-600 shadow-sm'
                }`}
              >
                {t(cat.nameMarathi, cat.nameEnglish)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 pb-24">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-3xl px-5 py-4 shadow-sm border border-slate-100 flex items-center justify-between hover:border-slate-300 transition-all">
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${item.isVeg ? 'border-emerald-500' : 'border-rose-500'}`}>
                <div className={`w-2 h-2 rounded-sm ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </div>
              <div className="min-w-0">
                <p className="font-black text-slate-800 text-sm leading-tight truncate pr-2">{t(item.nameMarathi, item.nameEnglish)}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {t(categories.find(c => c.id === item.category)?.nameMarathi || '',
                    categories.find(c => c.id === item.category)?.nameEnglish || '')}
                </p>
              </div>
            </div>
            <p className="font-black text-slate-800 text-base flex-shrink-0">₹{item.price}</p>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
              <span className="text-4xl">🔍</span>
            </div>
            <p className="font-bold text-slate-800">{t('कोणतेही पदार्थ सापडले नाहीत', 'No items found')}</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">{t('दुसरा शब्द शोधा', 'Try searching something else')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
