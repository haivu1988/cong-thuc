import React from 'react';
import { Coffee, LogOut, ShieldCheck, UserCheck, Plus, Sparkles, Layers, SlidersHorizontal } from 'lucide-react';
import { RecipeType, UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  activeTab: RecipeType | 'manage';
  onTabChange: (tab: RecipeType | 'manage') => void;
  onLogout: () => void;
  onOpenAddModal: () => void;
  nenCount: number;
  toppingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  activeTab,
  onTabChange,
  onLogout,
  onOpenAddModal,
  nenCount,
  toppingCount,
}) => {
  const isManager = currentRole === 'manager';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar: Brand & Role info & Logout */}
        <div className="flex items-center justify-between py-3 sm:py-3.5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                  Công Thức Pha Chế
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                  Barista Hub
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Tiêu chuẩn hóa định lượng nguyên liệu nền &amp; topping
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Badge */}
            {isManager ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-lg text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span className="hidden xs:inline">Vai trò:</span>
                <span className="text-amber-700 font-bold">Quản Lý</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 border border-stone-200 rounded-lg text-xs font-medium">
                <UserCheck className="w-4 h-4 text-stone-600" />
                <span className="hidden xs:inline">Vai trò:</span>
                <span className="text-stone-900 font-semibold">Nhân Viên</span>
                <span className="text-[10px] text-stone-500 bg-stone-200/70 px-1.5 py-0.2 rounded ml-1">Chỉ xem</span>
              </div>
            )}

            {/* Quick Add Button for Manager */}
            {isManager && (
              <button
                id="header-add-recipe-btn"
                onClick={onOpenAddModal}
                type="button"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Công Thức</span>
              </button>
            )}

            {/* Logout button */}
            <button
              id="header-logout-btn"
              onClick={onLogout}
              type="button"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200/70 cursor-pointer"
              title="Đăng xuất và trở về màn hình chọn vai trò"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đổi Vai Trò</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation: 2 main tabs: Nền & Topping (+ Quản lý for Manager) */}
        <div className="flex items-center justify-between pt-1 overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-2 sm:gap-4 -mb-px">
            {/* Tab 1: Nền */}
            <button
              id="tab-nen-btn"
              type="button"
              onClick={() => onTabChange('nen')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'nen'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Công Thức Nền</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  activeTab === 'nen'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {nenCount}
              </span>
            </button>

            {/* Tab 2: Topping */}
            <button
              id="tab-topping-btn"
              type="button"
              onClick={() => onTabChange('topping')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'topping'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Topping &amp; Foam</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  activeTab === 'topping'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {toppingCount}
              </span>
            </button>

            {/* Tab 3: Mục Quản Lý (CHỈ HIỆN KHI LÀ QUẢN LÝ) */}
            {isManager && (
              <button
                id="tab-manage-btn"
                type="button"
                onClick={() => onTabChange('manage')}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'manage'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Mục Quản Lý</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                  CRUD
                </span>
              </button>
            )}
          </nav>

          {/* Quick Add mobile button for manager */}
          {isManager && (
            <button
              onClick={onOpenAddModal}
              type="button"
              className="md:hidden flex items-center gap-1 my-1 px-2.5 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
