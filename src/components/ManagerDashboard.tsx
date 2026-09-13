import React, { useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Eye, Download, Upload, RotateCcw, 
  Layers, Sparkles, Filter, CheckCircle2, Clock, Droplets 
} from 'lucide-react';
import { Recipe, RecipeType } from '../types';

interface ManagerDashboardProps {
  recipes: Recipe[];
  onOpenAddModal: (type: RecipeType) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onView: (recipe: Recipe) => void;
  onRestoreDefaults: () => void;
  onExportJSON: () => void;
  onImportJSON: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  recipes,
  onOpenAddModal,
  onEdit,
  onDelete,
  onView,
  onRestoreDefaults,
  onExportJSON,
  onImportJSON,
}) => {
  const [filterType, setFilterType] = useState<'all' | RecipeType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [restoreConfirm, setRestoreConfirm] = useState(false);

  const nenCount = recipes.filter((r) => r.type === 'nen').length;
  const toppingCount = recipes.filter((r) => r.type === 'topping').length;

  const filteredRecipes = recipes.filter((r) => {
    const matchType = filterType === 'all' || r.type === filterType;
    const matchQuery =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchQuery;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Banner & Stats */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
              Khu Vực Quản Trị Hệ Thống
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Quản Lý Kho Công Thức Pha Chế
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
              Thêm mới, điều chỉnh tỷ lệ nguyên liệu, xóa công thức lỗi thời và sao lưu dữ liệu cho toàn bộ quầy bar.
            </p>
          </div>

          {/* Quick Add Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              id="mgr-add-nen-btn"
              type="button"
              onClick={() => onOpenAddModal('nen')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Công Thức Nền</span>
            </button>
            <button
              id="mgr-add-topping-btn"
              type="button"
              onClick={() => onOpenAddModal('topping')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-700 hover:bg-stone-600 text-white text-xs font-bold rounded-xl border border-stone-600 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Topping Mới</span>
            </button>
          </div>
        </div>

        {/* Counter cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-stone-700/60">
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-xs text-stone-400 font-medium">Tổng Công Thức</span>
            <div className="text-2xl font-bold mt-1 text-white">{recipes.length}</div>
          </div>
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
              <Layers className="w-3.5 h-3.5" />
              <span>Công Thức Nền</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-white">{nenCount}</div>
          </div>
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Topping &amp; Foam</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-white">{toppingCount}</div>
          </div>
        </div>
      </div>

      {/* Filter & Search & Backup Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm công thức, nguyên liệu..."
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Filter Type Pills */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tất cả ({recipes.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('nen')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterType === 'nen'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Nền ({nenCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('topping')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterType === 'topping'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Topping ({toppingCount})
            </button>
          </div>

          {/* Backup / Export / Import / Reset tools */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              title="Xuất file JSON sao lưu"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sao lưu JSON</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nhập JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={onImportJSON}
                className="hidden"
              />
            </label>

            {restoreConfirm ? (
              <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                <span className="text-[11px] text-red-700 font-bold px-1">Khôi phục gốc?</span>
                <button
                  type="button"
                  onClick={() => {
                    onRestoreDefaults();
                    setRestoreConfirm(false);
                  }}
                  className="px-2 py-0.5 bg-red-600 text-white rounded text-[11px] font-bold cursor-pointer"
                >
                  Có
                </button>
                <button
                  type="button"
                  onClick={() => setRestoreConfirm(false)}
                  className="px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded text-[11px] cursor-pointer"
                >
                  Không
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setRestoreConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Khôi phục lại danh sách công thức mẫu ban đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Khôi phục mẫu</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recipes Management Table */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">
            Danh Sách Công Thức ({filteredRecipes.length})
          </h3>
          <span className="text-xs text-stone-500">
            Nhấp 'Sửa' để thay đổi tỷ lệ hoặc 'Xóa' để gỡ bỏ
          </span>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-stone-500 text-sm font-medium">
              Không tìm thấy công thức nào phù hợp.
            </p>
            <button
              type="button"
              onClick={() => onOpenAddModal('nen')}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo công thức ngay</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 text-stone-700 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Tên Công Thức</th>
                  <th className="py-3 px-4">Loại</th>
                  <th className="py-3 px-4">Phân Loại</th>
                  <th className="py-3 px-4">Định Lượng Chuẩn</th>
                  <th className="py-3 px-4 hidden md:table-cell">Nguyên Liệu</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Thời Gian</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {filteredRecipes.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      <div
                        onClick={() => onView(r)}
                        className="cursor-pointer hover:text-amber-700 transition-colors"
                      >
                        {r.name}
                      </div>
                      <div className="text-[11px] text-stone-400 font-normal mt-0.5">
                        Cập nhật: {r.updatedAt}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          r.type === 'nen'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-stone-100 text-stone-800 border border-stone-200'
                        }`}
                      >
                        {r.type === 'nen' ? 'Nền' : 'Topping'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600 font-medium">
                      {r.category}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-stone-800">
                      {r.yieldAmount} {r.yieldUnit}
                    </td>

                    <td className="py-3.5 px-4 text-stone-500 hidden md:table-cell">
                      {r.ingredients.length} nguyên liệu
                    </td>

                    <td className="py-3.5 px-4 text-stone-500 hidden lg:table-cell">
                      {r.prepTimeMinutes} phút
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onView(r)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          title="Xem công thức & định lượng"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(r)}
                          className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Sửa công thức"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(r)}
                          className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa công thức"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
