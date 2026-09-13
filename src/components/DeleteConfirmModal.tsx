import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Recipe } from '../types';

interface DeleteConfirmModalProps {
  recipe: Recipe | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  recipe,
  onConfirm,
  onCancel,
}) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200/80 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Xác Nhận Xóa Công Thức
            </h3>
            <p className="text-xs text-stone-500">
              Hành động này không thể hoàn tác
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
          Bạn có chắc chắn muốn xóa công thức{' '}
          <strong className="text-stone-900 font-bold">"{recipe.name}"</strong> thuộc nhóm{' '}
          <span className="font-semibold text-amber-800">
            {recipe.type === 'nen' ? 'Công Thức Nền' : 'Topping'}
          </span>{' '}
          không?
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button
            id="confirm-delete-button"
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xác Nhận Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
