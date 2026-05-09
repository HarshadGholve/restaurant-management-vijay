import { useState, useMemo } from 'react';
import { useLang } from '../context/LanguageContext';
import { useMenu } from '../context/MenuContext';
import { MenuItem } from '../data/menuData';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ItemFormData {
  nameEnglish: string;
  nameMarathi: string;
  price: string;
  category: string;
  isVeg: boolean;
}

const emptyForm = (): ItemFormData => ({
  nameEnglish: '',
  nameMarathi: '',
  price: '',
  category: 'maincourse',
  isVeg: true,
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function MenuView() {
  const { t } = useLang();
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();

  // View filters
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [filterVeg, setFilterVeg] = useState<'veg' | 'nonveg'>('veg');

  // Edit mode
  const [editMode, setEditMode] = useState(false);

  // Add / Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<ItemFormData>(emptyForm());
  const [formError, setFormError] = useState('');

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);

  // ── Filtered categories (for tab pills) ──────────────────────────────────

  const visibleCategories = useMemo(() => {
    return categories.filter((cat) =>
      filterVeg === 'veg' ? cat.type === 'veg' : cat.type === 'nonveg'
    );
  }, [categories, filterVeg]);

  const handleFilterChange = (newFilter: 'veg' | 'nonveg') => {
    setFilterVeg(newFilter);
    setActiveCategory('all');
  };

  // ── Filtered items ────────────────────────────────────────────────────────

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (search) {
        return (
          item.nameMarathi.includes(search) ||
          item.nameEnglish.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (filterVeg === 'veg' && !item.isVeg) return false;
      if (filterVeg === 'nonveg' && item.isVeg) return false;
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      return true;
    });
  }, [menuItems, search, activeCategory, filterVeg]);

  // ── Modal helpers ─────────────────────────────────────────────────────────

  const openAddModal = () => {
    setEditingItem(null);
    setForm({ ...emptyForm(), category: visibleCategories[0]?.id || 'maincourse', isVeg: filterVeg === 'veg' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setForm({
      nameEnglish: item.nameEnglish,
      nameMarathi: item.nameMarathi,
      price: String(item.price),
      category: item.category,
      isVeg: item.isVeg,
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const validateAndSave = () => {
    if (!form.nameEnglish.trim()) {
      setFormError(t('इंग्रजी नाव आवश्यक आहे', 'English name is required'));
      return;
    }
    if (!form.price.trim()) {
      setFormError(t('किंमत आवश्यक आहे', 'Price is required'));
      return;
    }
    // Validate price: number OR "number/number"
    const priceStr = form.price.trim();
    const validPrice = /^\d+$/.test(priceStr) || /^\d+\/\d+$/.test(priceStr);
    if (!validPrice) {
      setFormError(t('किंमत चुकीची आहे (उदा: 120 किंवा 100/200)', 'Invalid price (e.g. 120 or 100/200)'));
      return;
    }

    const nameMarathi = form.nameMarathi.trim() || form.nameEnglish.trim();
    const price: number | string = /^\d+$/.test(priceStr) ? parseInt(priceStr) : priceStr;

    if (editingItem) {
      updateMenuItem({ ...editingItem, nameEnglish: form.nameEnglish.trim(), nameMarathi, price, category: form.category, isVeg: form.isVeg });
    } else {
      addMenuItem({ nameEnglish: form.nameEnglish.trim(), nameMarathi, price, category: form.category, isVeg: form.isVeg });
    }
    closeModal();
  };

  // ── Delete helpers ────────────────────────────────────────────────────────

  const requestDelete = (item: MenuItem) => setDeleteTarget(item);
  const confirmDelete = () => {
    if (deleteTarget) deleteMenuItem(deleteTarget.id);
    setDeleteTarget(null);
  };
  const cancelDelete = () => setDeleteTarget(null);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className={`bg-white/80 backdrop-blur-md px-6 pt-12 pb-5 border-b sticky top-0 z-20 transition-all duration-300 ${editMode ? 'border-amber-300 bg-amber-50/80' : 'border-slate-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t('मेनू कार्ड', 'Menu Card')}</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('न्यू हॉटेल विजय', 'New Hotel Vijay')}</p>
          </div>

          {/* Edit mode toggle */}
          <button
            onClick={() => { setEditMode((v) => !v); setSearch(''); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all shadow-sm ${
              editMode
                ? 'bg-amber-500 text-white shadow-amber-500/30'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {editMode ? '🔓' : '✏️'}
            <span>{editMode ? t('संपादन बंद', 'Done') : t('मेनू संपादित करा', 'Edit Menu')}</span>
          </button>
        </div>

        {editMode && (
          <div className="mt-3 flex items-center gap-2 bg-amber-100 rounded-xl px-3 py-2">
            <span className="text-amber-600 text-sm">⚠️</span>
            <p className="text-xs font-bold text-amber-700">{t('संपादन मोड सुरू आहे', 'Edit mode is active — changes are saved instantly')}</p>
          </div>
        )}

        {/* Search */}
        <div className="relative mt-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('पदार्थ शोधा...', 'Search items...')}
            className="w-full bg-slate-100/50 border border-slate-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-slate-800/5 transition-all"
          />
        </div>

        {/* Veg / Non-Veg toggle */}
        <div className="flex gap-2 mt-4">
          {[
            { key: 'veg', label: t('व्हेज', 'Veg'), color: 'emerald' },
            { key: 'nonveg', label: t('नॉनव्हेज', 'Non-Veg'), color: 'rose' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => handleFilterChange(f.key as 'veg' | 'nonveg')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                filterVeg === f.key
                  ? f.color === 'emerald'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Category Pills ────────────────────────────────────────────────── */}
      {!search && (
        <div className="bg-white/40 backdrop-blur-sm border-b border-slate-100 overflow-x-auto no-scrollbar sticky top-[214px] z-10">
          <div className="flex gap-2 px-6 py-3 min-w-max">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2 rounded-full text-[11px] font-black whitespace-nowrap transition-all ${
                activeCategory === 'all' ? 'bg-slate-800 text-white' : 'bg-white border border-slate-100 text-slate-600 shadow-sm'
              }`}
            >
              {t('सर्व', 'All')}
            </button>
            {visibleCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-[11px] font-black whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? cat.type === 'nonveg'
                      ? 'bg-rose-500 text-white'
                      : 'bg-emerald-500 text-white'
                    : 'bg-white border border-slate-100 text-slate-600 shadow-sm'
                }`}
              >
                {t(cat.nameMarathi, cat.nameEnglish)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Item List ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 pb-28">
        {/* Add item button (edit mode) */}
        {editMode && !search && (
          <button
            onClick={openAddModal}
            className="w-full bg-amber-50 border-2 border-dashed border-amber-300 rounded-3xl py-4 text-amber-600 font-black text-sm hover:bg-amber-100 transition-all active:scale-[0.98]"
          >
            + {t('नवीन पदार्थ जोडा', 'Add New Item')}
          </button>
        )}

        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-3xl px-5 py-4 shadow-sm border transition-all ${
              editMode ? 'border-amber-200 hover:border-amber-400' : 'border-slate-100 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              {/* Left: veg dot + name */}
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${item.isVeg ? 'border-emerald-500' : 'border-rose-500'}`}>
                  <div className={`w-2 h-2 rounded-sm ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-800 text-sm leading-tight truncate pr-2">
                    {t(item.nameMarathi, item.nameEnglish)}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {t(
                      categories.find((c) => c.id === item.category)?.nameMarathi || '',
                      categories.find((c) => c.id === item.category)?.nameEnglish || ''
                    )}
                  </p>
                </div>
              </div>

              {/* Right: price + edit/delete OR just price */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <p className="font-black text-slate-800 text-base">₹{item.price}</p>
                {editMode && (
                  <>
                    <button
                      onClick={() => openEditModal(item)}
                      title="Edit"
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => requestDelete(item)}
                      title="Delete"
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </div>
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

      {/* ── Delete Confirmation Modal ──────────────────────────────────────── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-5 animate-fadeIn"
          onClick={cancelDelete}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="bg-rose-50 flex items-center justify-center py-8">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-3xl">🗑️</span>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pt-5 pb-6">
              <h3 className="text-xl font-black text-slate-800 text-center">
                {t('पदार्थ काढायचा?', 'Remove Item?')}
              </h3>
              <p className="text-sm text-slate-500 text-center mt-2 font-medium">
                <span className="font-bold text-slate-700">"{t(deleteTarget.nameMarathi, deleteTarget.nameEnglish)}"</span>
                {' '}{t('मेनूमधून कायमचे काढले जाईल.', 'will be permanently removed from the menu.')}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={cancelDelete}
                  className="py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  {t('नाही, ठेवा', 'Cancel')}
                </button>
                <button
                  onClick={confirmDelete}
                  className="py-3.5 rounded-2xl bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:bg-rose-600 transition-colors active:scale-[0.98]"
                >
                  {t('हो, काढा', 'Yes, Delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Item Modal ─────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-end z-[100]"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-t-[2rem] w-full p-6 pb-safe max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

            <h3 className="font-extrabold text-slate-800 text-xl mb-5">
              {editingItem ? t('पदार्थ संपादित करा', 'Edit Item') : t('नवीन पदार्थ जोडा', 'Add New Item')}
            </h3>

            <div className="space-y-4">
              {/* English Name */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  {t('इंग्रजी नाव *', 'English Name *')}
                </label>
                <input
                  type="text"
                  value={form.nameEnglish}
                  onChange={(e) => setForm({ ...form, nameEnglish: e.target.value })}
                  placeholder="e.g. Paneer Masala"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              {/* Marathi Name */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  {t('मराठी नाव (पर्यायी)', 'Marathi Name (optional)')}
                </label>
                <input
                  type="text"
                  value={form.nameMarathi}
                  onChange={(e) => setForm({ ...form, nameMarathi: e.target.value })}
                  placeholder="उदा. पनिर मसाला"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  {t('किंमत (₹) *', 'Price (₹) *')}
                </label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 170  or  100/200 (half/full)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                  {t('हाफ/फुल साठी 100/200 असे लिहा', 'Use 100/200 for half/full pricing')}
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  {t('प्रकार', 'Category')}
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-slate-400 transition-all appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameEnglish} ({cat.nameMarathi})
                    </option>
                  ))}
                </select>
              </div>

              {/* Veg / Non-Veg */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  {t('प्रकार', 'Type')}
                </label>
                <div className="flex gap-3">
                  {[
                    { value: true, label: t('व्हेज', 'Veg'), color: 'emerald' },
                    { value: false, label: t('नॉनव्हेज', 'Non-Veg'), color: 'rose' },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      onClick={() => setForm({ ...form, isVeg: opt.value })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        form.isVeg === opt.value
                          ? opt.color === 'emerald'
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {formError && (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">
                  <p className="text-rose-600 text-sm font-bold">⚠️ {formError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  {t('रद्द करा', 'Cancel')}
                </button>
                <button
                  onClick={validateAndSave}
                  className="py-3.5 rounded-2xl bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-800/20 hover:bg-slate-700 transition-colors active:scale-[0.98]"
                >
                  {editingItem ? t('जतन करा', 'Save Changes') : t('जोडा', 'Add Item')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
