import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { useOrders } from '../context/OrderContext';
import { menuItems, categories, MenuItem } from '../data/menuData';

interface TableOrderViewProps {
  tableId: number;
  onNavigate: (page: string) => void;
}

export default function TableOrderView({ tableId, onNavigate }: TableOrderViewProps) {
  const { t } = useLang();
  const { tables, addItemToTable, updateQuantity, removeItemFromTable, getTableTotal, setGuestCount, setNotes, billTable, clearTable } = useOrders();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'order' | 'cart'>('order');
  const [search, setSearch] = useState('');
  const [showVariantModal, setShowVariantModal] = useState<MenuItem | null>(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [filterVeg, setFilterVeg] = useState<'veg' | 'nonveg'>('veg');

  const table = tables.find(tb => tb.tableId === tableId);
  if (!table) return null;

  const isBilled = table.status === 'billed';

  // Get visible categories based on the current veg/nonveg filter
  const visibleCategories = categories.filter(cat => {
    if (filterVeg === 'veg') return cat.type === 'veg';
    return cat.type === 'nonveg';
  });

  const handleFilterChange = (newFilter: 'veg' | 'nonveg') => {
    setFilterVeg(newFilter);
    setActiveCategory('all');
  };

  const filteredItems = menuItems.filter(item => {
    if (search) {
      return item.nameMarathi.includes(search) ||
        item.nameEnglish.toLowerCase().includes(search.toLowerCase());
    }
    if (filterVeg === 'veg' && !item.isVeg) return false;
    if (filterVeg === 'nonveg' && item.isVeg) return false;
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    return true;
  });

  const hasVariant = (item: MenuItem) => typeof item.price === 'string' && item.price.includes('/');

  const handleAddItem = (item: MenuItem) => {
    if (hasVariant(item)) {
      setShowVariantModal(item);
    } else {
      addItemToTable(tableId, item);
    }
  };

  const getItemQty = (itemId: string, variant?: 'half' | 'full') => {
    const oi = (table.items || []).find(o => o.menuItem.id === itemId && o.variant === variant);
    return oi?.quantity || 0;
  };

  const total = getTableTotal(tableId);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-0 border-b border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('tables')} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors">
              <span className="text-xl">←</span>
            </button>
            <div>
              <h1 className="font-extrabold text-slate-800 text-xl tracking-tight">{t(`टेबल ${tableId}`, `Table ${tableId}`)}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isBilled ? 'bg-emerald-500' : table.status === 'active' ? 'bg-[var(--color-sky-blue-2)]' : 'bg-slate-300'}`}></span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isBilled ? t('बिल झाले', 'Billed') : table.status === 'active' ? t('सक्रिय', 'Active') : t('रिकामे', 'Free')}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isBilled ? (
              <button
                onClick={() => { clearTable(tableId); onNavigate('tables'); }}
                className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-[0_4px_15px_rgba(16,185,129,0.2)] active:scale-95 transition-transform"
              >
                ✅ {t('टेबल साफ करा', 'Free Table')}
              </button>
            ) : table.status === 'active' && (
              <button
                onClick={() => setShowBillModal(true)}
                className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-[0_4px_15px_rgba(30,41,59,0.2)] active:scale-95 transition-transform"
              >
                💰 {t('बिल', 'Bill')}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        {!isBilled && (
          <div className="flex gap-2">
            {[
              { key: 'order', label: t('मेनू', 'Menu'), icon: '📋' },
              { key: 'cart', label: `${t('ऑर्डर', 'Order')} (${(table.items || []).length})`, icon: '🛒' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'order' | 'cart')}
                className={`flex-1 py-3 text-sm font-bold border-b-[3px] transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'border-slate-800 text-slate-800'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.icon} <span className="ml-1">{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {isBilled ? (
        /* BILLED / SUMMARY VIEW */
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-24">
          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="text-3xl">💰</span>
            </div>
            <h2 className="text-emerald-800 font-black text-xl">{t('बिल तयार आहे', 'Bill is Ready')}</h2>
            <p className="text-emerald-600/70 text-xs font-bold uppercase tracking-widest mt-1">{t('कृपया पैसे स्वीकारा', 'Please collect payment')}</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-5 pb-4 border-b border-slate-100 text-center uppercase tracking-widest text-xs">{t('बिल सारांश', 'Bill Summary')}</h3>
            <div className="space-y-4">
              {(table.items || []).map((oi, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 text-sm leading-tight">{t(oi.menuItem.nameMarathi, oi.menuItem.nameEnglish)}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">₹{oi.priceUsed} × {oi.quantity}</p>
                  </div>
                  <p className="font-extrabold text-slate-800">₹{oi.priceUsed * oi.quantity}</p>
                </div>
              ))}
              <div className="pt-5 border-t border-dashed border-slate-200 mt-2 flex justify-between items-end">
                <span className="text-slate-500 font-bold text-sm uppercase tracking-widest">{t('एकूण', 'Total')}</span>
                <span className="text-3xl font-black text-slate-800">₹{total}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
             <button
              onClick={() => { clearTable(tableId); onNavigate('tables'); }}
              className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all"
            >
              ✅ {t('पैसे मिळाले व टेबल साफ करा', 'Paid & Free Table')}
            </button>
            <button
              onClick={() => { 
                // Allow going back to edit if needed (un-bill)
                billTable(tableId); // This is just a placeholder, maybe we need an un-bill?
                // For now, let's just let them go back to the tables.
                onNavigate('tables');
              }}
              className="w-full bg-white text-slate-400 py-4 rounded-2xl font-bold text-sm border border-slate-100"
            >
              {t('परत जा', 'Go Back')}
            </button>
          </div>
        </div>
      ) : activeTab === 'order' ? (
        <div className="flex flex-col flex-1 overflow-hidden relative z-10">
          {/* Search & Filter */}
          <div className="px-5 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.01)]">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('पदार्थ शोधा...', 'Search items...')}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-slate-300 focus:shadow-sm transition-all"
            />
            <div className="flex gap-2 mt-3">
              {[
                { key: 'veg', label: t('व्हेज', 'Veg') },
                { key: 'nonveg', label: t('नॉनव्हेज', 'Non-Veg') },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => handleFilterChange(f.key as 'veg' | 'nonveg')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filterVeg === f.key ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          {!search && (
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 overflow-x-auto">
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

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto px-5 py-4 pb-24 space-y-3">
            {filteredItems.map(item => {
              const qty = hasVariant(item)
                ? (getItemQty(item.id, 'half') + getItemQty(item.id, 'full'))
                : getItemQty(item.id);
              return (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`mt-1 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${item.isVeg ? 'border-emerald-500' : 'border-rose-500'}`}>
                      <div className={`w-2 h-2 rounded-sm ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm leading-snug pr-2">{t(item.nameMarathi, item.nameEnglish)}</p>
                      <p className="text-slate-800 text-sm font-extrabold mt-1">₹{item.price}</p>
                    </div>
                  </div>
                  <div>
                    {qty === 0 ? (
                      <button
                        onClick={() => handleAddItem(item)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                          item.isVeg
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                      >
                        + {t('जोडा', 'Add')}
                      </button>
                    ) : (
                      <div className="flex items-center gap-0 bg-slate-50 rounded-xl p-1 border border-slate-100">
                        <button
                          onClick={() => {
                            if (hasVariant(item)) setShowVariantModal(item);
                            else updateQuantity(tableId, item.id, -1);
                          }}
                          className="w-8 h-8 bg-white text-slate-700 rounded-lg font-bold text-lg leading-none flex items-center justify-center shadow-sm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-slate-800">{qty}</span>
                        <button
                          onClick={() => handleAddItem(item)}
                          className="w-8 h-8 bg-slate-800 text-white rounded-lg font-bold text-lg leading-none flex items-center justify-center shadow-sm shadow-slate-800/20"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* CART VIEW */
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-24">
          {(table.items || []).length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-slate-100">
                <span className="text-5xl">🛒</span>
              </div>
              <p className="font-bold text-slate-800 text-lg">{t('ऑर्डर रिकामी आहे', 'Order is empty')}</p>
              <button
                onClick={() => setActiveTab('order')}
                className="mt-4 px-6 py-2.5 bg-slate-800 text-white rounded-full text-sm font-bold shadow-md shadow-slate-800/20 hover:-translate-y-0.5 transition-transform"
              >
                {t('मेनूवर जा', 'Go to Menu')}
              </button>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">{t('ऑर्डर केलेले पदार्थ', 'Ordered Items')}</h3>
                <div className="space-y-4">
                  {(table.items || []).map((oi, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 flex-1">
                          <div className={`mt-0.5 w-3.5 h-3.5 rounded-sm border-2 flex-shrink-0 flex items-center justify-center ${oi.menuItem.isVeg ? 'border-emerald-500' : 'border-rose-500'}`}>
                            <div className={`w-1.5 h-1.5 rounded-sm ${oi.menuItem.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm leading-tight">{t(oi.menuItem.nameMarathi, oi.menuItem.nameEnglish)}</p>
                            {oi.variant && (
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{oi.variant === 'half' ? t('हाफ', 'Half') : t('फुल', 'Full')}</p>
                            )}
                            <p className="text-xs text-slate-400 mt-1 font-medium">₹{oi.priceUsed} × {oi.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="font-extrabold text-slate-800">₹{oi.priceUsed * oi.quantity}</p>
                          <div className="flex items-center gap-0 bg-slate-50 rounded-lg p-0.5 border border-slate-100">
                            <button
                              onClick={() => updateQuantity(tableId, oi.menuItem.id, -1, oi.variant)}
                              className="w-7 h-7 bg-white text-slate-700 rounded-md font-bold flex items-center justify-center shadow-sm"
                            >
                              −
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-slate-800">{oi.quantity}</span>
                            <button
                              onClick={() => updateQuantity(tableId, oi.menuItem.id, 1, oi.variant)}
                              className="w-7 h-7 bg-slate-800 text-white rounded-md font-bold flex items-center justify-center shadow-sm shadow-slate-800/20"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">{t('नोट्स:', 'Notes:')}</label>
                <textarea
                  value={table.notes}
                  onChange={e => setNotes(tableId, e.target.value)}
                  placeholder={t('विशेष सूचना...', 'Special instructions...')}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-3 text-sm font-medium outline-none resize-none text-slate-700 focus:bg-white focus:border-slate-300 transition-colors"
                  rows={2}
                />
              </div>

              {/* Total */}
              <div className="bg-slate-800 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center text-sm text-slate-300 font-medium">
                    <span>{t('एकूण पदार्थ:', 'Total Items:')}</span>
                    <span className="font-bold text-white">{(table.items || []).reduce((s, o) => s + o.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between items-end mt-3 pt-3 border-t border-white/10">
                    <span className="font-bold text-slate-200">{t('एकूण रक्कम:', 'Total Amount:')}</span>
                    <span className="text-3xl font-extrabold tracking-tight">₹{total}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-4">
                <button
                  onClick={() => { clearTable(tableId); onNavigate('tables'); }}
                  className="bg-white text-rose-500 border border-rose-100 py-3.5 rounded-2xl font-bold text-sm shadow-sm hover:bg-rose-50 transition-colors"
                >
                  {t('रद्द करा', 'Clear Order')}
                </button>
                <button
                  onClick={() => setShowBillModal(true)}
                  className="bg-[var(--color-sky-blue-2)] text-slate-900 py-3.5 rounded-2xl font-bold text-sm shadow-md hover:-translate-y-0.5 transition-transform"
                >
                  💰 {t('बिल बनवा', 'Generate Bill')}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Cart Button */}
      {!isBilled && activeTab === 'order' && (table.items || []).length > 0 && (
        <div className="absolute bottom-6 left-5 right-5 z-[60]">
          <button
            onClick={() => setActiveTab('cart')}
            className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-900/20 flex items-center justify-between px-5 hover:-translate-y-1 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-xl w-8 h-8 flex items-center justify-center backdrop-blur-sm">
                <span className="text-sm">{(table.items || []).length}</span>
              </div>
              <span className="tracking-wide">{t('ऑर्डर पहा', 'View Order')}</span>
            </div>
            <span className="text-lg font-extrabold">₹{total}</span>
          </button>
        </div>
      )}

      {/* Variant Modal */}
      {showVariantModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end z-50 transition-opacity" onClick={() => setShowVariantModal(null)}>
          <div className="bg-white rounded-t-[2rem] w-full p-6 pb-safe animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <h3 className="font-extrabold text-slate-800 text-xl mb-1">{t(showVariantModal.nameMarathi, showVariantModal.nameEnglish)}</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">{t('प्रकार निवडा', 'Select variant')}</p>
            <div className="grid grid-cols-2 gap-4">
              {(String(showVariantModal.price).split('/') as string[]).map((p, idx) => {
                const variant = idx === 0 ? 'half' : 'full';
                const qty = getItemQty(showVariantModal!.id, variant);
                return (
                  <div key={variant} className={`border-2 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${qty > 0 ? 'border-slate-800 bg-slate-50' : 'border-slate-100 bg-white'}`}>
                    <p className="font-bold text-slate-700 uppercase tracking-wider text-xs">{variant === 'half' ? t('हाफ', 'Half') : t('फुल', 'Full')}</p>
                    <p className="text-slate-800 font-extrabold text-xl">₹{p}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(tableId, showVariantModal!.id, -1, variant)}
                        className="w-10 h-10 bg-white border border-slate-200 rounded-xl font-bold text-xl flex items-center justify-center shadow-sm text-slate-600 hover:bg-slate-50"
                      >−</button>
                      <span className="w-6 text-center font-bold text-slate-800">{qty}</span>
                      <button
                        onClick={() => addItemToTable(tableId, showVariantModal!, variant)}
                        className="w-10 h-10 bg-slate-800 text-white rounded-xl font-bold text-xl flex items-center justify-center shadow-md shadow-slate-800/20"
                      >+</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setShowVariantModal(null)}
              className="w-full mt-6 bg-slate-800 text-white py-4 rounded-2xl font-bold text-base shadow-xl shadow-slate-800/20 active:scale-[0.98] transition-transform"
            >
              {t('ठीक आहे', 'Done')}
            </button>
          </div>
        </div>
      )}

      {/* Bill Modal */}
      {showBillModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-[2rem] w-full max-w-sm max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fadeIn">
            <div className="overflow-y-auto p-6 pb-2">
              <div className="text-center border-b-2 border-dashed border-slate-200 pb-5 mb-5">
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{t('न्यू हॉटेल विजय', 'New Hotel Vijay')}</h2>
                <p className="text-slate-500 text-xs mt-1 font-bold tracking-widest uppercase">{t('व्हेज - नॉनव्हेज', 'Veg - Non Veg')}</p>
                <div className="mt-4 bg-slate-50 rounded-xl p-3 inline-block w-full">
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>{t(`टेबल`, `Table`)}: {tableId}</span>
                    <span>{t(`अतिथी`, `Guests`)}: {table.guestCount}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">{new Date().toLocaleString(t('mr-IN', 'en-IN'))}</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {(table.items || []).map((oi, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-bold text-slate-800 leading-snug">{t(oi.menuItem.nameMarathi, oi.menuItem.nameEnglish)}</p>
                      {oi.variant && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{oi.variant === 'half' ? t('हाफ', 'Half') : t('फुल', 'Full')}</p>}
                      <p className="text-xs text-slate-500 font-medium mt-0.5">₹{oi.priceUsed} × {oi.quantity}</p>
                    </div>
                    <p className="font-extrabold text-slate-800">₹{oi.priceUsed * oi.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 mb-2">
                <div className="flex justify-between text-sm font-bold text-slate-600">
                  <span>{t('उपएकूण', 'Subtotal')}</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between font-extrabold text-xl text-slate-800 pt-2 border-t border-slate-200">
                  <span>{t('एकूण', 'Total')}</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <p className="text-center text-xs font-bold text-slate-400 mt-6 uppercase tracking-widest">{t('धन्यवाद! पुन्हा या', 'Thank you! Visit again')}</p>
            </div>

            <div className="p-5 bg-white border-t border-slate-100">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  onClick={() => setShowBillModal(false)}
                  className="bg-white border border-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50"
                >
                  {t('बंद करा', 'Close')}
                </button>
                <button
                  onClick={() => {
                    billTable(tableId);
                    setShowBillModal(false);
                    onNavigate('tables');
                  }}
                  className="bg-slate-800 text-white py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-slate-800/20"
                >
                  ✅ {t('बिल पूर्ण', 'Mark Paid')}
                </button>
              </div>
              <button
                onClick={() => { clearTable(tableId); setShowBillModal(false); onNavigate('tables'); }}
                className="w-full bg-rose-50 text-rose-500 py-3 rounded-2xl font-bold text-sm border border-rose-100 hover:bg-rose-100"
              >
                {t('टेबल साफ करा', 'Clear & Free Table')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
