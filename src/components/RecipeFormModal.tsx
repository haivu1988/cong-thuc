import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Save, Sparkles, Layers } from 'lucide-react';
import { Recipe, RecipeType, Ingredient } from '../types';

interface RecipeFormModalProps {
  isOpen: boolean;
  initialRecipe?: Recipe | null;
  defaultType?: RecipeType;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}

const NEN_CATEGORIES = ['Trà Cốt', 'Cà Phê', 'Cốt Sữa', 'Đường & Syrup', 'Trà Trái Cây Nền', 'Sốt Nền Khác'];
const TOPPING_CATEGORIES = ['Trân Châu', 'Kem Cheese & Foam', 'Pudding', 'Thạch', 'Topping Trái Cây', 'Khác'];

export const RecipeFormModal: React.FC<RecipeFormModalProps> = ({
  isOpen,
  initialRecipe,
  defaultType = 'nen',
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<RecipeType>(defaultType);
  const [category, setCategory] = useState('');
  const [yieldAmount, setYieldAmount] = useState<number>(1000);
  const [yieldUnit, setYieldUnit] = useState('ml');
  const [yieldDisplay, setYieldDisplay] = useState('');
  const [ratio, setRatio] = useState('');
  const [specialNote, setSpecialNote] = useState('');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(20);
  const [difficulty, setDifficulty] = useState<'Dễ' | 'Trung bình' | 'Khá' | 'Cần chú ý'>('Dễ');
  const [shelfLife, setShelfLife] = useState('');
  const [storageNote, setStorageNote] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [errors, setErrors] = useState<string>('');

  useEffect(() => {
    if (initialRecipe) {
      setName(initialRecipe.name);
      setType(initialRecipe.type);
      setCategory(initialRecipe.category);
      setYieldAmount(initialRecipe.yieldAmount);
      setYieldUnit(initialRecipe.yieldUnit);
      setYieldDisplay(initialRecipe.yieldDisplay || '');
      setRatio(initialRecipe.ratio || '');
      setSpecialNote(initialRecipe.specialNote || '');
      setPrepTimeMinutes(initialRecipe.prepTimeMinutes);
      setDifficulty(initialRecipe.difficulty || 'Dễ');
      setShelfLife(initialRecipe.shelfLife);
      setStorageNote(initialRecipe.storageNote);
      setIngredients(
        initialRecipe.ingredients.length > 0
          ? initialRecipe.ingredients
          : [{ id: '1', name: '', amount: 10, unit: 'g', note: '' }]
      );
      setSteps(initialRecipe.steps.length > 0 ? initialRecipe.steps : ['']);
      setTips(initialRecipe.tips || []);
    } else {
      // New blank recipe
      setName('');
      setType(defaultType);
      setCategory(defaultType === 'nen' ? 'Trà Cốt' : 'Trân Châu');
      setYieldAmount(defaultType === 'nen' ? 1000 : 500);
      setYieldUnit(defaultType === 'nen' ? 'ml' : 'g');
      setYieldDisplay('');
      setRatio('');
      setSpecialNote('');
      setPrepTimeMinutes(20);
      setDifficulty('Dễ');
      setShelfLife('Dùng trong ngày (8 giờ)');
      setStorageNote('Bảo quản nơi khô ráo, sạch sẽ hoặc tủ mát');
      setIngredients([
        { id: 'i-1', name: '', amount: 50, unit: defaultType === 'nen' ? 'g' : 'g', note: '' },
        { id: 'i-2', name: '', amount: 1000, unit: 'ml', note: '' },
      ]);
      setSteps(['']);
      setTips(['']);
    }
    setErrors('');
  }, [initialRecipe, defaultType, isOpen]);

  if (!isOpen) return null;

  // Ingredient helpers
  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: `i-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`, name: '', amount: 10, unit: 'g', note: '' },
    ]);
  };

  const handleUpdateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length <= 1) return;
    setIngredients(ingredients.filter((_, idx) => idx !== index));
  };

  // Step helpers
  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleUpdateStep = (index: number, value: string) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, idx) => idx !== index));
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...steps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSteps(updated);
  };

  // Tips helpers
  const handleAddTip = () => {
    setTips([...tips, '']);
  };

  const handleUpdateTip = (index: number, value: string) => {
    const updated = [...tips];
    updated[index] = value;
    setTips(updated);
  };

  const handleRemoveTip = (index: number) => {
    setTips(tips.filter((_, idx) => idx !== index));
  };

  // Form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrors('Vui lòng nhập tên công thức.');
      return;
    }

    const validIngredients = ingredients.filter((ing) => ing.name.trim() !== '');
    if (validIngredients.length === 0) {
      setErrors('Vui lòng thêm ít nhất một nguyên liệu với tên cụ thể.');
      return;
    }

    const validSteps = steps.filter((st) => st.trim() !== '');
    if (validSteps.length === 0) {
      setErrors('Vui lòng nhập ít nhất một bước thực hiện.');
      return;
    }

    const cleanedTips = tips.filter((t) => t.trim() !== '');

    const newRecipe: Recipe = {
      id: initialRecipe ? initialRecipe.id : `rec-${Date.now()}`,
      name: name.trim(),
      type,
      category: category.trim() || (type === 'nen' ? 'Trà Cốt' : 'Topping'),
      yieldAmount: Number(yieldAmount) || 1000,
      yieldUnit: yieldUnit.trim() || 'ml',
      yieldDisplay: yieldDisplay.trim() || undefined,
      ratio: ratio.trim() || undefined,
      specialNote: specialNote.trim() || undefined,
      prepTimeMinutes: Number(prepTimeMinutes) || 15,
      difficulty,
      shelfLife: shelfLife.trim() || 'Dùng trong ngày',
      storageNote: storageNote.trim() || 'Bảo quản đúng nhiệt độ tiêu chuẩn',
      ingredients: validIngredients,
      steps: validSteps,
      tips: cleanedTips.length > 0 ? cleanedTips : undefined,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSave(newRecipe);
    onClose();
  };

  const categoryPresets = type === 'nen' ? NEN_CATEGORIES : TOPPING_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        id="recipe-form-dialog"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">
              {initialRecipe ? 'Chỉnh Sửa Công Thức' : 'Thêm Công Thức Mới'}
            </h2>
            <p className="text-xs text-stone-500">
              Điền thông tin và tỷ lệ định lượng chuẩn cho quầy pha chế
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-5 sm:px-7 py-6 overflow-y-auto space-y-6">
          {errors && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold">
              {errors}
            </div>
          )}

          {/* Type selector: Nền vs Topping */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Nhóm Công Thức <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setType('nen');
                  if (!categoryPresets.includes(category)) setCategory('Trà Cốt');
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  type === 'nen'
                    ? 'bg-amber-50 border-amber-600 text-amber-900 ring-2 ring-amber-500/20'
                    : 'bg-white border-stone-300 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-600" />
                <span>1. CÔNG THỨC NỀN (Trà, Cà phê, Sữa, Syrup)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('topping');
                  if (!categoryPresets.includes(category)) setCategory('Trân Châu');
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  type === 'topping'
                    ? 'bg-amber-50 border-amber-600 text-amber-900 ring-2 ring-amber-500/20'
                    : 'bg-white border-stone-300 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>2. TOPPING &amp; FOAM (Trân châu, Thạch, Kem cheese)</span>
              </button>
            </div>
          </div>

          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Tên công thức <span className="text-red-500">*</span>
              </label>
              <input
                id="recipe-form-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Cốt Trà Đen Phúc Long, Trân Châu Hoàng Kim..."
                className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Phân loại con
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="VD: Trà Cốt, Cà Phê, Trân Châu, Kem Cheese..."
                className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              />
              {/* Presets suggestions */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {categoryPresets.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className="text-[10px] px-2 py-0.5 rounded bg-stone-100 hover:bg-amber-100 text-stone-700 transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Yield, Unit, Prep Time, Difficulty */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Sản lượng mẻ
              </label>
              <input
                type="number"
                value={yieldAmount}
                onChange={(e) => setYieldAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600"
                min={1}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Đơn vị sản lượng
              </label>
              <select
                value={yieldUnit}
                onChange={(e) => setYieldUnit(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600 bg-white"
              >
                <option value="ml">ml (mili-lít)</option>
                <option value="lít">lít</option>
                <option value="g">g (gram)</option>
                <option value="kg">kg</option>
                <option value="phần">phần</option>
                <option value="ly">ly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Thời gian (phút)
              </label>
              <input
                type="number"
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600"
                min={1}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Độ khó
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600 bg-white"
              >
                <option value="Dễ">Dễ</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Khá">Khá</option>
                <option value="Cần chú ý">Cần chú ý</option>
              </select>
            </div>
          </div>

          {/* Kitchen Sheet Custom Ratio & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200/60">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Tỉ lệ pha chế (nếu có)
              </label>
              <input
                type="text"
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
                placeholder="VD: Tỉ lệ 1 : 6"
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Hiển thị thành phẩm (tuỳ chọn)
              </label>
              <input
                type="text"
                value={yieldDisplay}
                onChange={(e) => setYieldDisplay(e.target.value)}
                placeholder="VD: 1.800 - 2.000 gr hoặc 7,000 ml"
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Lưu ý kỹ thuật quán (in chữ đỏ/nghiêng)
              </label>
              <input
                type="text"
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                placeholder="VD: Đánh 2-3 công thức 1 lần để đảm bảo đủ độ lạnh, Phô mai (1 viên cắt 11-12)..."
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600 bg-white"
              />
            </div>
          </div>

          {/* Shelf Life & Storage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Hạn dùng (Shelf Life)
              </label>
              <input
                type="text"
                value={shelfLife}
                onChange={(e) => setShelfLife(e.target.value)}
                placeholder="VD: Dùng trong ngày (8 tiếng), 3 ngày trong tủ mát..."
                className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Hướng dẫn bảo quản
              </label>
              <input
                type="text"
                value={storageNote}
                onChange={(e) => setStorageNote(e.target.value)}
                placeholder="VD: Bình giữ nhiệt 65°C, hoặc tủ mát 2-4°C..."
                className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          {/* DYNAMIC INGREDIENTS */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Danh Sách Định Lượng Nguyên Liệu <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 py-1 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Nguyên Liệu</span>
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div
                  key={ing.id || idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ing.name}
                      onChange={(e) => handleUpdateIngredient(idx, 'name', e.target.value)}
                      placeholder="Tên nguyên liệu (VD: Trà đen số 9)"
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      value={ing.amount}
                      onChange={(e) => handleUpdateIngredient(idx, 'amount', Number(e.target.value))}
                      placeholder="Số lượng"
                      className="w-24 px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600 text-right"
                    />

                    <input
                      type="text"
                      value={ing.unit}
                      onChange={(e) => handleUpdateIngredient(idx, 'unit', e.target.value)}
                      placeholder="Đ/vị (g, ml)"
                      className="w-20 px-2 py-1.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600"
                    />

                    <input
                      type="text"
                      value={ing.note || ''}
                      onChange={(e) => handleUpdateIngredient(idx, 'note', e.target.value)}
                      placeholder="Ghi chú (tùy chọn)"
                      className="flex-1 sm:w-40 px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      disabled={ingredients.length <= 1}
                      className="p-1.5 text-stone-400 hover:text-red-600 disabled:opacity-30 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC STEPS */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Các Bước Thực Hiện <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddStep}
                className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 py-1 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Bước</span>
              </button>
            </div>

            <div className="space-y-2">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <span className="font-bold text-xs text-stone-500 py-2 px-1 shrink-0">
                    #{idx + 1}
                  </span>
                  <textarea
                    rows={2}
                    value={step}
                    onChange={(e) => handleUpdateStep(idx, e.target.value)}
                    placeholder={`Nội dung bước ${idx + 1}...`}
                    className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600 resize-y"
                  />
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveStep(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                      title="Di chuyển lên"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveStep(idx, 'down')}
                      disabled={idx === steps.length - 1}
                      className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                      title="Di chuyển xuống"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      disabled={steps.length <= 1}
                      className="p-1 text-stone-400 hover:text-red-600 disabled:opacity-20 cursor-pointer"
                      title="Xóa bước này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BARISTA TIPS / LƯU Ý */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Lưu Ý / Mẹo Barista (Tùy chọn)
              </label>
              <button
                type="button"
                onClick={handleAddTip}
                className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 py-1 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Lưu Ý</span>
              </button>
            </div>

            <div className="space-y-2">
              {tips.map((tip, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => handleUpdateTip(idx, e.target.value)}
                    placeholder="VD: Không ủ quá 20 phút sẽ bị đắng chát..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTip(idx)}
                    className="p-1.5 text-stone-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions footer */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              id="recipe-form-save-btn"
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs shadow-amber-600/20 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{initialRecipe ? 'Lưu Thay Đổi' : 'Thêm Công Thức'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
