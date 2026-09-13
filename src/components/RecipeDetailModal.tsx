import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Droplets,
  ShieldAlert,
  CheckSquare,
  Square,
  Flame,
  Sparkles,
  Edit2,
  Trash2,
  Scale,
  Info,
  Check,
  Plus,
  Minus,
  RotateCcw,
  TableProperties,
} from 'lucide-react';
import { Recipe, UserRole } from '../types';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  role: UserRole;
  onClose: () => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  role,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [multiplier, setMultiplier] = useState<number>(1);
  const [showComparisonSheet, setShowComparisonSheet] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Reset multiplier and steps whenever recipe changes
  useEffect(() => {
    setMultiplier(1);
    setShowComparisonSheet(false);
    setCompletedSteps({});
  }, [recipe?.id]);

  if (!recipe) return null;

  const isManager = role === 'manager';

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleResetSteps = () => {
    setCompletedSteps({});
  };

  const formatAmount = (amount: number, mult: number): string => {
    const val = Math.round(amount * mult * 100) / 100;
    if (Number.isInteger(val)) {
      return val.toLocaleString('vi-VN');
    }
    return val.toString().replace('.', ',');
  };

  const getScaledYield = (mult: number): string => {
    if (!recipe) return '';
    if (recipe.id === 'topping-tranchau-nau') {
      if (mult === 1) return '1.800 - 2.000 gr';
      const min = Math.round(1800 * mult);
      const max = Math.round(2000 * mult);
      return `${min.toLocaleString('vi-VN')} - ${max.toLocaleString('vi-VN')} gr`;
    }
    const total = Math.round(recipe.yieldAmount * mult * 10) / 10;
    if (Number.isInteger(total)) {
      return `${total.toLocaleString('vi-VN')} ${recipe.yieldUnit}`;
    }
    return `${total.toString().replace('.', ',')} ${recipe.yieldUnit}`;
  };

  const handleStepDecrease = () => {
    setMultiplier((prev) => {
      const next = prev > 1 ? prev - 0.5 : Math.max(0.25, prev - 0.25);
      return Math.round(next * 100) / 100;
    });
  };

  const handleStepIncrease = () => {
    setMultiplier((prev) => {
      const next = prev >= 1 ? prev + 0.5 : prev + 0.25;
      return Math.round(next * 100) / 100;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        id="recipe-detail-dialog"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Header */}
        <div className="px-5 sm:px-7 py-5 bg-stone-50 border-b border-stone-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60">
                {recipe.type === 'nen' ? 'Công Thức Nền' : 'Topping & Foam'}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700">
                {recipe.category}
              </span>
              {recipe.ratio && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
                  {recipe.ratio}
                </span>
              )}
              {recipe.difficulty && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {recipe.difficulty}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {recipe.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-stone-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-amber-600" />
                Thời gian: <strong>{recipe.prepTimeMinutes} phút</strong>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Droplets className="w-4 h-4 text-amber-600" />
                Thành phẩm ({multiplier} CT):{' '}
                <strong className="text-amber-800 text-sm">
                  {getScaledYield(multiplier)}
                </strong>
                {multiplier !== 1 && (
                  <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                    ({multiplier < 1 ? `Chia nhỏ ${multiplier} CT` : `Gấp ${multiplier} lần`})
                  </span>
                )}
              </span>
            </div>
          </div>

          <button
            id="close-recipe-detail-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="px-5 sm:px-7 py-6 overflow-y-auto space-y-6">
          {/* Read-only notice for Staff */}
          {!isManager && (
            <div className="flex items-center gap-2 p-3 bg-stone-100 rounded-xl text-xs text-stone-600 border border-stone-200">
              <ShieldAlert className="w-4 h-4 text-stone-500 shrink-0" />
              <span>
                <strong>Chế độ Nhân viên:</strong> Công thức chuẩn quầy bar. Bạn có thể chọn số lượng công thức (0.5, 1, 2, 3...) để hệ thống tự động tính toán khối lượng cần làm.
              </span>
            </div>
          )}

          {/* Ratio & Technical Notes Banner */}
          {(recipe.ratio || recipe.specialNote) && (
            <div className="p-3.5 bg-amber-50/90 border border-amber-300/80 rounded-2xl space-y-1">
              {recipe.ratio && (
                <div className="flex items-center gap-2 text-red-700 font-bold text-xs sm:text-sm">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span>{recipe.ratio}</span>
                </div>
              )}
              {recipe.specialNote && (
                <p className="text-xs text-stone-800 italic font-medium leading-relaxed">
                  {recipe.specialNote}
                </p>
              )}
            </div>
          )}

          {/* BATCH SCALER / ĐỔI SỐ LƯỢNG CÔNG THỨC (TỰ ĐỘNG CHIA / NHÂN) */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Chọn Số Lượng Công Thức (Tự Động Chia / Nhân)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {multiplier === 1 ? (
                  <span className="text-xs px-2.5 py-1 bg-stone-100 text-stone-700 font-semibold rounded-full border border-stone-200">
                    Đang xem 1 công thức chuẩn
                  </span>
                ) : multiplier < 1 ? (
                  <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded-full border border-blue-200">
                    Đang chia nhỏ: {multiplier} công thức
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-1 bg-amber-200 text-amber-900 font-bold rounded-full border border-amber-300">
                    Đang nhân lớn: {multiplier} công thức
                  </span>
                )}
                {multiplier !== 1 && (
                  <button
                    type="button"
                    onClick={() => setMultiplier(1)}
                    className="flex items-center gap-1 text-xs text-stone-600 hover:text-amber-800 bg-white hover:bg-stone-50 px-2 py-1 rounded-lg border border-stone-300 transition-colors cursor-pointer font-medium"
                    title="Về 1 công thức chuẩn"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Về 1 CT</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Presets Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[0.5, 1, 1.5, 2, 3, 4, 5].map((val) => {
                const isActive = multiplier === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMultiplier(val)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs ring-2 ring-amber-500/20'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {val === 0.5
                      ? '0.5 CT (Nửa mẻ)'
                      : val === 1
                      ? '1 CT (Chuẩn)'
                      : val === 2
                      ? '2 CT (Gấp đôi)'
                      : `${val} CT`}
                  </button>
                );
              })}
            </div>

            {/* Stepper & Custom Number Input */}
            <div className="flex items-center gap-3 pt-1 border-t border-amber-200/50">
              <span className="text-xs font-medium text-stone-600">Tùy chỉnh số công thức:</span>
              <div className="flex items-center bg-white border border-stone-300 rounded-xl overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={handleStepDecrease}
                  className="p-1.5 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer disabled:opacity-40"
                  disabled={multiplier <= 0.25}
                  title="Giảm bớt công thức"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="0.1"
                  max="50"
                  step="0.5"
                  value={multiplier}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      setMultiplier(Math.round(val * 100) / 100);
                    }
                  }}
                  className="w-14 text-center text-xs font-bold text-stone-900 py-1 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleStepIncrease}
                  className="p-1.5 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                  title="Tăng thêm công thức"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-amber-900 font-medium">
                Thành phẩm dự kiến: <strong className="text-amber-800">{getScaledYield(multiplier)}</strong>
              </span>
            </div>
          </div>

          {/* INGREDIENTS TABLE (AUTO SCALED) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <span>
                  1. Bảng Định Lượng Nguyên Liệu ({multiplier === 1 ? '1 Công Thức Chuẩn' : `Mẻ ${multiplier} Công Thức`})
                </span>
              </h3>
              <span className="text-xs text-stone-500 font-medium">
                {multiplier === 1 ? 'Mẻ chuẩn gốc' : `Đã tự động tính theo x${multiplier} công thức`}
              </span>
            </div>

            {/* If multiplier !== 1, show a helpful indicator banner */}
            {multiplier !== 1 && (
              <div className="mb-2.5 p-2.5 bg-amber-100/70 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-center justify-between">
                <span>
                  ⚡ <strong>Hệ thống đã tự động tính cho {multiplier} công thức:</strong> Bạn chỉ cần cân đúng số lượng tại cột <strong className="text-amber-900 uppercase">"CẦN LẤY ({multiplier} CT)"</strong>.
                </span>
                <span className="font-bold text-amber-800 ml-2 whitespace-nowrap">
                  Thành phẩm: {getScaledYield(multiplier)}
                </span>
              </div>
            )}

            <div className="border border-stone-300 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-100 text-stone-800 border-b border-stone-300 font-bold">
                  <tr>
                    <th className="py-3 px-3 sm:px-4">Tên Nguyên Liệu</th>
                    <th className="py-3 px-2 sm:px-3 text-center">ĐV</th>
                    {multiplier !== 1 && (
                      <th className="py-3 px-2 sm:px-3 text-right text-stone-500 font-medium hidden sm:table-cell">
                        Chuẩn (1 CT)
                      </th>
                    )}
                    <th
                      className={`py-3 px-3 sm:px-4 text-right ${
                        multiplier !== 1
                          ? 'bg-amber-100 text-amber-950 font-black text-sm'
                          : 'text-stone-900'
                      }`}
                    >
                      {multiplier === 1 ? 'Định Lượng (1 CT)' : `CẦN LẤY (${multiplier} CT)`}
                    </th>
                    <th className="py-3 px-3 sm:px-4 hidden md:table-cell">Lưu ý / Loại chuẩn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {recipe.ingredients.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-3 sm:px-4 font-medium text-stone-900">
                        {item.name}
                        {item.note && (
                          <span className="block md:hidden text-[11px] text-stone-500 font-normal mt-0.5">
                            {item.note}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 sm:px-3 text-center text-stone-600 font-medium">
                        {item.unit}
                      </td>
                      {multiplier !== 1 && (
                        <td className="py-3 px-2 sm:px-3 text-right text-stone-400 hidden sm:table-cell whitespace-nowrap">
                          {formatAmount(item.amount, 1)}
                        </td>
                      )}
                      <td
                        className={`py-3 px-3 sm:px-4 text-right whitespace-nowrap ${
                          multiplier !== 1
                            ? 'bg-amber-50/80 font-black text-amber-900 text-sm sm:text-base'
                            : 'font-bold text-amber-800'
                        }`}
                      >
                        {formatAmount(item.amount, multiplier)} {item.unit}
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-xs text-stone-500 hidden md:table-cell">
                        {item.note || '—'}
                      </td>
                    </tr>
                  ))}

                  {/* THÀNH PHẨM ROW */}
                  <tr className="bg-amber-50/70 font-bold border-t-2 border-stone-300 text-stone-900">
                    <td className="py-3.5 px-3 sm:px-4 text-amber-950 font-black">
                      Thành phẩm {multiplier !== 1 ? `(${multiplier} công thức)` : '(1 công thức chuẩn)'}
                    </td>
                    <td className="py-3.5 px-2 sm:px-3 text-center text-amber-900 font-semibold">
                      {recipe.yieldUnit}
                    </td>
                    {multiplier !== 1 && (
                      <td className="py-3.5 px-2 sm:px-3 text-right text-stone-400 font-medium hidden sm:table-cell whitespace-nowrap">
                        {recipe.yieldDisplay || recipe.yieldAmount.toLocaleString('vi-VN')}
                      </td>
                    )}
                    <td
                      className={`py-3.5 px-3 sm:px-4 text-right whitespace-nowrap ${
                        multiplier !== 1
                          ? 'bg-amber-200/70 text-amber-950 font-black text-sm sm:text-base'
                          : 'font-bold text-amber-950'
                      }`}
                    >
                      {getScaledYield(multiplier)}
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 text-xs text-amber-800 hidden md:table-cell">
                      {recipe.storageNote || '—'}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Bottom Special Ratio or Note */}
              {recipe.ratio && (
                <div className="bg-stone-50 px-4 py-2 border-t border-stone-200 text-center font-bold text-red-600 text-xs sm:text-sm">
                  {recipe.ratio}
                </div>
              )}
              {recipe.specialNote && (
                <div className="bg-stone-50 px-4 py-2 border-t border-stone-200 text-center text-stone-700 italic text-xs">
                  {recipe.specialNote}
                </div>
              )}
            </div>

            {/* TOGGLE TO VIEW MASTER COMPARISON SHEET (1CT - 3CT - 5CT) */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowComparisonSheet(!showComparisonSheet)}
                className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-amber-800 font-medium py-1.5 px-3 rounded-xl border border-stone-200 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <TableProperties className="w-3.5 h-3.5 text-amber-700" />
                <span>
                  {showComparisonSheet
                    ? 'Ẩn bảng đối chiếu tổng hợp 1CT • 3CT • 5CT'
                    : 'Xem bảng đối chiếu tổng hợp 3 mẻ (1CT • 3CT • 5CT)'}
                </span>
              </button>

              {/* Collapsible 3-column kitchen sheet */}
              {showComparisonSheet && (
                <div className="mt-3 border border-stone-300 rounded-2xl overflow-hidden shadow-xs animate-in fade-in duration-150">
                  <div className="bg-stone-100 px-4 py-2 border-b border-stone-300 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                      Bảng Quy Chuẩn 3 Mẻ Cố Định (1CT • 3CT • 5CT)
                    </span>
                    <span className="text-[11px] text-stone-500">Bấm vào cột để chọn mẻ</span>
                  </div>
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-stone-50 text-stone-800 border-b border-stone-200 font-bold">
                      <tr>
                        <th className="py-2.5 px-3 sm:px-4">Tên NVL</th>
                        <th className="py-2.5 px-2 sm:px-3 text-center">ĐV</th>
                        <th
                          onClick={() => setMultiplier(1)}
                          className={`py-2.5 px-2 sm:px-4 text-right cursor-pointer ${
                            multiplier === 1 ? 'bg-amber-100 text-amber-950 font-black' : 'hover:bg-stone-200/50'
                          }`}
                        >
                          1CT
                        </th>
                        <th
                          onClick={() => setMultiplier(3)}
                          className={`py-2.5 px-2 sm:px-4 text-right cursor-pointer ${
                            multiplier === 3 ? 'bg-amber-100 text-amber-950 font-black' : 'hover:bg-stone-200/50'
                          }`}
                        >
                          3CT
                        </th>
                        <th
                          onClick={() => setMultiplier(5)}
                          className={`py-2.5 px-2 sm:px-4 text-right cursor-pointer ${
                            multiplier === 5 ? 'bg-amber-100 text-amber-950 font-black' : 'hover:bg-stone-200/50'
                          }`}
                        >
                          5CT
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 bg-white">
                      {recipe.ingredients.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="py-2 px-3 sm:px-4 font-medium text-stone-900">{item.name}</td>
                          <td className="py-2 px-2 sm:px-3 text-center text-stone-600">{item.unit}</td>
                          <td
                            onClick={() => setMultiplier(1)}
                            className={`py-2 px-2 sm:px-4 text-right cursor-pointer ${
                              multiplier === 1 ? 'bg-amber-50 font-bold text-amber-900' : 'text-stone-700'
                            }`}
                          >
                            {formatAmount(item.amount, 1)}
                          </td>
                          <td
                            onClick={() => setMultiplier(3)}
                            className={`py-2 px-2 sm:px-4 text-right cursor-pointer ${
                              multiplier === 3 ? 'bg-amber-50 font-bold text-amber-900' : 'text-stone-700'
                            }`}
                          >
                            {formatAmount(item.amount, 3)}
                          </td>
                          <td
                            onClick={() => setMultiplier(5)}
                            className={`py-2 px-2 sm:px-4 text-right cursor-pointer ${
                              multiplier === 5 ? 'bg-amber-50 font-bold text-amber-900' : 'text-stone-700'
                            }`}
                          >
                            {formatAmount(item.amount, 5)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-amber-50/60 font-bold border-t border-stone-300">
                        <td className="py-2.5 px-3 sm:px-4 text-amber-950">Thành phẩm</td>
                        <td className="py-2.5 px-2 sm:px-3 text-center text-amber-900">{recipe.yieldUnit}</td>
                        <td
                          onClick={() => setMultiplier(1)}
                          className={`py-2.5 px-2 sm:px-4 text-right cursor-pointer ${
                            multiplier === 1 ? 'bg-amber-200/70 font-black text-amber-950' : 'text-amber-900'
                          }`}
                        >
                          {getScaledYield(1)}
                        </td>
                        <td
                          onClick={() => setMultiplier(3)}
                          className={`py-2.5 px-2 sm:px-4 text-right cursor-pointer ${
                            multiplier === 3 ? 'bg-amber-200/70 font-black text-amber-950' : 'text-amber-900'
                          }`}
                        >
                          {getScaledYield(3)}
                        </td>
                        <td
                          onClick={() => setMultiplier(5)}
                          className={`py-2.5 px-2 sm:px-4 text-right cursor-pointer ${
                            multiplier === 5 ? 'bg-amber-200/70 font-black text-amber-950' : 'text-amber-900'
                          }`}
                        >
                          {getScaledYield(5)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* STEPS TO MAKE */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <span>2. Các Bước Thực Hiện ({recipe.steps.length} bước)</span>
              </h3>
              {Object.values(completedSteps).filter(Boolean).length > 0 && (
                <button
                  type="button"
                  onClick={handleResetSteps}
                  className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                >
                  Làm lại từ đầu
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {recipe.steps.map((step, idx) => {
                const isDone = !!completedSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                        : 'bg-white border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 text-stone-400">
                      {isDone ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-400" />
                      )}
                    </div>
                    <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                      <strong className={`font-bold mr-1.5 ${isDone ? 'text-emerald-800' : 'text-stone-900'}`}>
                        Bước {idx + 1}:
                      </strong>
                      <span className={isDone ? 'line-through text-stone-500' : 'text-stone-700'}>
                        {step}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STORAGE & PRESERVATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-xs mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>HẠN SỬ DỤNG</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {recipe.shelfLife}
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-xs mb-1">
                <Droplets className="w-4 h-4 text-amber-600" />
                <span>HƯỚNG DẪN BẢO QUẢN</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {recipe.storageNote}
              </p>
            </div>
          </div>

          {/* BARISTA PRO-TIPS */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Lưu Ý Vàng Cho Barista</span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-amber-900/90 leading-relaxed">
                {recipe.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-7 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          {isManager ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit?.(recipe);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Sửa Công Thức</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete?.(recipe);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-semibold rounded-xl border border-red-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa</span>
              </button>
            </div>
          ) : (
            <div className="text-xs text-stone-500 italic">
              Định lượng được quy chuẩn theo công thức chuẩn của quán
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
