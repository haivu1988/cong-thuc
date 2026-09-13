import React, { useState } from 'react';
import { X, Clock, Droplets, ShieldAlert, CheckSquare, Square, Flame, Sparkles, Edit2, Trash2, Scale, Info, Check } from 'lucide-react';
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
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

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

  const formatAmount = (amount: number, mult: number) => {
    const val = amount * mult;
    if (Number.isInteger(val)) return val.toString();
    return Number(val.toFixed(2)).toString();
  };

  const scaledYield = Number((recipe.yieldAmount * multiplier).toFixed(1));

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
                Thành phẩm ({multiplier}CT):{' '}
                <strong className="text-amber-800">
                  {multiplier === 1 && recipe.yieldDisplay
                    ? recipe.yieldDisplay
                    : multiplier === 3 && recipe.yieldDisplay?.includes('-')
                    ? '5.400 - 6.000 gr'
                    : multiplier === 5 && recipe.yieldDisplay?.includes('-')
                    ? '9.000 - 10.000 gr'
                    : `${scaledYield.toLocaleString('vi-VN')} ${recipe.yieldUnit}`}
                </strong>
                {multiplier !== 1 && (
                  <span className="text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                    ({multiplier}CT)
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
                <strong>Chế độ Nhân viên (Chỉ xem):</strong> Công thức được cố định theo quy chuẩn quán, không thể chỉnh sửa.
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

          {/* BATCH SCALER / ĐỔI MẺ NẤU */}
          <div className="p-4 bg-stone-100/80 rounded-2xl border border-stone-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Chọn Mẻ Nấu Chuẩn Bếp Quán
                </span>
              </div>
              <span className="text-xs text-stone-700 font-medium">
                Đang xem mẻ: <strong className="text-amber-800 font-bold">{multiplier}CT</strong> • Thành phẩm:{' '}
                <strong className="text-stone-900 font-bold">
                  {multiplier === 1 && recipe.yieldDisplay
                    ? recipe.yieldDisplay
                    : multiplier === 3 && recipe.yieldDisplay?.includes('-')
                    ? '5.400 - 6.000 gr'
                    : multiplier === 5 && recipe.yieldDisplay?.includes('-')
                    ? '9.000 - 10.000 gr'
                    : `${scaledYield.toLocaleString('vi-VN')} ${recipe.yieldUnit}`}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[1, 3, 5].map((ct) => (
                <button
                  key={ct}
                  type="button"
                  onClick={() => setMultiplier(ct)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    multiplier === ct
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm ring-2 ring-amber-500/20'
                      : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {ct}CT {ct === 1 ? '(1 Mẻ chuẩn)' : `(Mẻ x${ct})`}
                </button>
              ))}
              <span className="text-stone-300 text-xs mx-1">|</span>
              {[0.5, 2].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMultiplier(m)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    multiplier === m
                      ? 'bg-stone-800 text-white border-stone-800'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {m}x
                </button>
              ))}
            </div>
          </div>

          {/* KITCHEN SHEET 1CT - 3CT - 5CT SPEC TABLE */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <span>1. Bảng Công Thức Chuẩn (1CT • 3CT • 5CT)</span>
              </h3>
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                * Bấm vào cột mẻ để chuyển định lượng
              </span>
            </div>

            <div className="border border-stone-300 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-100 text-stone-800 border-b border-stone-300 font-bold">
                  <tr>
                    <th className="py-3 px-3 sm:px-4">Tên NVL</th>
                    <th className="py-3 px-2 sm:px-3 text-center">ĐV</th>
                    <th
                      onClick={() => setMultiplier(1)}
                      className={`py-3 px-2 sm:px-4 text-right cursor-pointer transition-colors ${
                        multiplier === 1 ? 'bg-amber-100/90 text-amber-950 font-black' : 'hover:bg-stone-200/60'
                      }`}
                    >
                      1CT
                    </th>
                    <th
                      onClick={() => setMultiplier(3)}
                      className={`py-3 px-2 sm:px-4 text-right cursor-pointer transition-colors ${
                        multiplier === 3 ? 'bg-amber-100/90 text-amber-950 font-black' : 'hover:bg-stone-200/60'
                      }`}
                    >
                      3CT
                    </th>
                    <th
                      onClick={() => setMultiplier(5)}
                      className={`py-3 px-2 sm:px-4 text-right cursor-pointer transition-colors ${
                        multiplier === 5 ? 'bg-amber-100/90 text-amber-950 font-black' : 'hover:bg-stone-200/60'
                      }`}
                    >
                      5CT
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {recipe.ingredients.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-2.5 px-3 sm:px-4 font-medium text-stone-900">
                        {item.name}
                        {item.note && (
                          <span className="block text-[11px] text-stone-400 font-normal">
                            {item.note}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 sm:px-3 text-center text-stone-600 font-medium">
                        {item.unit}
                      </td>
                      <td
                        onClick={() => setMultiplier(1)}
                        className={`py-2.5 px-2 sm:px-4 text-right whitespace-nowrap cursor-pointer ${
                          multiplier === 1 ? 'bg-amber-50 font-bold text-amber-900' : 'text-stone-700'
                        }`}
                      >
                        {formatAmount(item.amount, 1)}
                      </td>
                      <td
                        onClick={() => setMultiplier(3)}
                        className={`py-2.5 px-2 sm:px-4 text-right whitespace-nowrap cursor-pointer ${
                          multiplier === 3 ? 'bg-amber-50 font-bold text-amber-900' : 'text-stone-700'
                        }`}
                      >
                        {formatAmount(item.amount, 3)}
                      </td>
                      <td
                        onClick={() => setMultiplier(5)}
                        className={`py-2.5 px-2 sm:px-4 text-right whitespace-nowrap cursor-pointer ${
                          multiplier === 5 ? 'bg-amber-50 font-bold text-amber-900' : 'text-stone-700'
                        }`}
                      >
                        {formatAmount(item.amount, 5)}
                      </td>
                    </tr>
                  ))}

                  {/* THÀNH PHẨM ROW */}
                  <tr className="bg-amber-50/60 font-bold border-t-2 border-stone-300 text-stone-900">
                    <td className="py-3 px-3 sm:px-4 text-amber-950 font-black">
                      Thành phẩm
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-center text-amber-900">
                      {recipe.yieldUnit}
                    </td>
                    <td
                      onClick={() => setMultiplier(1)}
                      className={`py-3 px-2 sm:px-4 text-right cursor-pointer ${
                        multiplier === 1 ? 'bg-amber-200/60 text-amber-950 font-black' : 'text-amber-900'
                      }`}
                    >
                      {recipe.yieldDisplay || recipe.yieldAmount.toLocaleString('vi-VN')}
                    </td>
                    <td
                      onClick={() => setMultiplier(3)}
                      className={`py-3 px-2 sm:px-4 text-right cursor-pointer ${
                        multiplier === 3 ? 'bg-amber-200/60 text-amber-950 font-black' : 'text-amber-900'
                      }`}
                    >
                      {recipe.yieldDisplay?.includes('-')
                        ? '5.400 - 6.000'
                        : (recipe.yieldAmount * 3).toLocaleString('vi-VN')}
                    </td>
                    <td
                      onClick={() => setMultiplier(5)}
                      className={`py-3 px-2 sm:px-4 text-right cursor-pointer ${
                        multiplier === 5 ? 'bg-amber-200/60 text-amber-950 font-black' : 'text-amber-900'
                      }`}
                    >
                      {recipe.yieldDisplay?.includes('-')
                        ? '9.000 - 10.000'
                        : (recipe.yieldAmount * 5).toLocaleString('vi-VN')}
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
