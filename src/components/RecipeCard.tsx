import React from 'react';
import { Clock, Droplets, ShieldAlert, Edit2, Trash2, ChevronRight, Eye } from 'lucide-react';
import { Recipe, UserRole } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  role: UserRole;
  onView: (recipe: Recipe) => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  role,
  onView,
  onEdit,
  onDelete,
}) => {
  const isManager = role === 'manager';

  return (
    <div
      id={`recipe-card-${recipe.id}`}
      className="group bg-white border border-stone-200 hover:border-amber-400/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Top badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-full">
              {recipe.category}
            </span>
            {recipe.ratio && (
              <span className="text-xs font-bold px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full">
                {recipe.ratio}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium shrink-0">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{recipe.prepTimeMinutes} phút</span>
          </div>
        </div>

        {/* Recipe Title */}
        <h3
          onClick={() => onView(recipe)}
          className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors cursor-pointer leading-snug line-clamp-2"
        >
          {recipe.name}
        </h3>

        {/* Special note if exists */}
        {recipe.specialNote && (
          <p className="mt-1.5 text-xs text-amber-800 italic bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/60 line-clamp-2">
            {recipe.specialNote}
          </p>
        )}

        {/* Yield & Shelf Life */}
        <div className="mt-2.5 space-y-1.5 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              Thành phẩm (1CT): <strong className="text-stone-900 font-bold">{recipe.yieldDisplay || `${recipe.yieldAmount} ${recipe.yieldUnit}`}</strong>
            </span>
          </div>

          {/* Quick 1CT / 3CT / 5CT tags */}
          <div className="grid grid-cols-3 gap-1 pt-1 text-center text-[11px]">
            <div className="bg-stone-50 py-1 px-1 rounded border border-stone-200">
              <span className="text-stone-500 font-medium block">1CT</span>
              <strong className="text-stone-800 truncate block">
                {recipe.yieldDisplay || `${recipe.yieldAmount} ${recipe.yieldUnit}`}
              </strong>
            </div>
            <div className="bg-amber-50/60 py-1 px-1 rounded border border-amber-200/60">
              <span className="text-amber-700 font-medium block">3CT</span>
              <strong className="text-amber-900 truncate block">
                {recipe.yieldDisplay?.includes('-')
                  ? recipe.yieldDisplay.replace(/1\.800\s*-\s*2\.000/g, '5.400 - 6.000')
                  : `${(recipe.yieldAmount * 3).toLocaleString('vi-VN')} ${recipe.yieldUnit}`}
              </strong>
            </div>
            <div className="bg-orange-50/60 py-1 px-1 rounded border border-orange-200/60">
              <span className="text-orange-700 font-medium block">5CT</span>
              <strong className="text-orange-900 truncate block">
                {recipe.yieldDisplay?.includes('-')
                  ? recipe.yieldDisplay.replace(/1\.800\s*-\s*2\.000/g, '9.000 - 10.000')
                  : `${(recipe.yieldAmount * 5).toLocaleString('vi-VN')} ${recipe.yieldUnit}`}
              </strong>
            </div>
          </div>
        </div>

        {/* Ingredients preview pill list */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <p className="text-[11px] font-medium text-stone-500 mb-1.5">
            Nguyên liệu chính ({recipe.ingredients.length}):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {recipe.ingredients.slice(0, 3).map((item) => (
              <span
                key={item.id}
                className="text-[11px] px-2 py-0.5 bg-stone-50 text-stone-700 border border-stone-200 rounded-md truncate max-w-[150px]"
              >
                {item.name}
              </span>
            ))}
            {recipe.ingredients.length > 3 && (
              <span className="text-[11px] px-2 py-0.5 bg-stone-100 text-stone-500 rounded-md font-medium">
                +{recipe.ingredients.length - 3} nữa
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        {isManager ? (
          <>
            {/* Manager quick edit/delete buttons */}
            <div className="flex items-center gap-1.5">
              <button
                id={`edit-recipe-${recipe.id}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(recipe);
                }}
                className="p-2 text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors border border-stone-200/80 cursor-pointer"
                title="Sửa công thức"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                id={`delete-recipe-${recipe.id}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(recipe);
                }}
                className="p-2 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-stone-200/80 cursor-pointer"
                title="Xóa công thức"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              id={`view-recipe-${recipe.id}`}
              type="button"
              onClick={() => onView(recipe)}
              className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 py-1.5 px-3 rounded-lg hover:bg-amber-50/80 transition-colors cursor-pointer"
            >
              <span>Xem chi tiết</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          /* Staff view only */
          <button
            id={`view-recipe-staff-${recipe.id}`}
            type="button"
            onClick={() => onView(recipe)}
            className="w-full flex items-center justify-between py-2 px-3 text-xs font-semibold bg-stone-50 hover:bg-amber-50 text-stone-800 hover:text-amber-800 rounded-xl border border-stone-200/80 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              <span>Xem công thức &amp; định lượng</span>
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>
        )}
      </div>
    </div>
  );
};
