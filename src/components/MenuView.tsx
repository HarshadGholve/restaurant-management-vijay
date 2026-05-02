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
      // nonveg: only show nonveg categories (no cold drinks, no veg categories)
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
      // Search filter: match name in either language
      if (search) {
        return item.nameMarathi.includes(search) ||
          item.nameEnglish.toLowerCase().includes(search.toLowerCase());
      }

      // Veg/NonVeg dietary filter
      if (filterVeg === 'veg' && !item.isVeg) return false;
      if (filterVeg === 'nonveg' && item.isVeg) return false;

      // Category filter: item must belong to the active sub-category, unless 'all'
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;

      return true;
    });
  }, [search, activeCategory, filterVeg]);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <div className="bg-white/80 backdrop-blur-md px-5 pt-12 pb-4 border-b border-slate-100 sticky top-0 z-20">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">{t('मेनू', 'Menu')}</h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{t('न्यू हॉटेल विजय', 'New Hotel Vijay')}</p>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('पदार्थ शोधा...', 'Search items...')}
          className="w-full mt-4 bg-white border border-slate-200 shadow-sm rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-slate-400 focus:shadow-md transition-all"
        />

        <div className="flex gap-2 mt-4">
          {[
            { key: 'veg', label: t('व्हेज', 'Veg') },
            { key: 'nonveg', label: t('नॉनव्हेज', 'Non-Veg') },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => handleFilterChange(f.key as 'veg' | 'nonveg')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filterVeg === f.key ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {!search && (
        <div className="bg-white/60 backdrop-blur-md border-b border-slate-100 overflow-x-auto sticky top-[168px] z-10">
          <div className="flex gap-2 px-5 py-3 min-w-max">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
              }`}
            >
              {t('सर्व', 'All')}
            </button>
            {visibleCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? cat.type === 'nonveg' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' : 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                }`}
              >
                {t(cat.nameMarathi, cat.nameEnglish)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 pb-24">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-2xl px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${item.isVeg ? 'border-emerald-500' : 'border-rose-500'}`}>
                <div className={`w-2 h-2 rounded-sm ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm leading-snug">{t(item.nameMarathi, item.nameEnglish)}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  {t(categories.find(c => c.id === item.category)?.nameMarathi || '',
                    categories.find(c => c.id === item.category)?.nameEnglish || '')}
                </p>
              </div>
            </div>
            <p className="font-extrabold text-slate-800 text-lg">₹{item.price}</p>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
              <span className="text-4xl">🔍</span>
            </div>
            <p className="font-bold text-slate-600">{t('कोणतेही पदार्थ सापडले नाहीत', 'No items found')}</p>
            <p className="text-xs text-slate-400 mt-1">{t('कृपया दुसरा शब्द शोधा', 'Try a different search term')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
