/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Sparkles, Layers, SlidersHorizontal, Lock, CheckCircle2, ShieldAlert, ArrowUpDown } from 'lucide-react';
import { Recipe, RecipeType, UserRole } from './types';
import { DEFAULT_RECIPES } from './data/defaultRecipes';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { RecipeFormModal } from './components/RecipeFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ManagerDashboard } from './components/ManagerDashboard';

const STORAGE_KEY = 'barista_hub_recipes_bep_quan_v2';
const ROLE_STORAGE_KEY = 'barista_hub_user_role';

export default function App() {
  // Load role from storage or start at login screen
  const [role, setRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
    if (savedRole === 'staff' || savedRole === 'manager') {
      return savedRole as UserRole;
    }
    return 'guest';
  });

  // Load recipes from localStorage or use defaults
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading recipes from localStorage', e);
    }
    return DEFAULT_RECIPES;
  });

  // Active tab: 'nen' | 'topping' | 'manage'
  const [activeTab, setActiveTab] = useState<RecipeType | 'manage'>('nen');

  // Search and subcategory filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  // Modals state
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formDefaultType, setFormDefaultType] = useState<RecipeType>('nen');
  const [deletingRecipe, setDeletingRecipe] = useState<Recipe | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Persist recipes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch (e) {
      console.error('Failed to persist recipes', e);
    }
  }, [recipes]);

  // Handle login
  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    localStorage.setItem(ROLE_STORAGE_KEY, selectedRole);
    setActiveTab('nen');
    setSelectedSubCategory('all');
    setSearchQuery('');
  };

  // Handle logout
  const handleLogout = () => {
    setRole('guest');
    localStorage.removeItem(ROLE_STORAGE_KEY);
    setViewingRecipe(null);
    setEditingRecipe(null);
    setIsFormOpen(false);
    setDeletingRecipe(null);
  };

  // Reset category filter on tab switch
  const handleTabChange = (tab: RecipeType | 'manage') => {
    setActiveTab(tab);
    setSelectedSubCategory('all');
    setSearchQuery('');
  };

  // Counts
  const nenRecipes = useMemo(() => recipes.filter((r) => r.type === 'nen'), [recipes]);
  const toppingRecipes = useMemo(() => recipes.filter((r) => r.type === 'topping'), [recipes]);

  // Available categories for currently active tab
  const activeTabCategories = useMemo(() => {
    const list = activeTab === 'nen' ? nenRecipes : toppingRecipes;
    const cats = Array.from(new Set(list.map((r) => r.category))).filter(Boolean);
    return ['all', ...cats];
  }, [activeTab, nenRecipes, toppingRecipes]);

  // Filtered recipes for Nền or Topping tab
  const displayedRecipes = useMemo(() => {
    if (activeTab === 'manage') return [];

    const baseList = activeTab === 'nen' ? nenRecipes : toppingRecipes;
    return baseList.filter((r) => {
      const matchCategory = selectedSubCategory === 'all' || r.category === selectedSubCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchCategory;

      const matchName = r.name.toLowerCase().includes(query);
      const matchCat = r.category.toLowerCase().includes(query);
      const matchIng = r.ingredients.some((i) => i.name.toLowerCase().includes(query));
      return matchCategory && (matchName || matchCat || matchIng);
    });
  }, [activeTab, nenRecipes, toppingRecipes, selectedSubCategory, searchQuery]);

  // CRUD Operations (Manager only)
  const handleOpenAddModal = (typeToCreate?: RecipeType) => {
    const targetType = typeToCreate || (activeTab === 'topping' ? 'topping' : 'nen');
    setFormDefaultType(targetType);
    setEditingRecipe(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (recipeToEdit: Recipe) => {
    setEditingRecipe(recipeToEdit);
    setFormDefaultType(recipeToEdit.type);
    setIsFormOpen(true);
  };

  const handleSaveRecipe = (savedRecipe: Recipe) => {
    const existingIndex = recipes.findIndex((r) => r.id === savedRecipe.id);
    if (existingIndex >= 0) {
      // Update
      const updated = [...recipes];
      updated[existingIndex] = savedRecipe;
      setRecipes(updated);
      showToast(`Đã cập nhật công thức "${savedRecipe.name}"`);
    } else {
      // Create new
      setRecipes([savedRecipe, ...recipes]);
      showToast(`Đã thêm thành công công thức "${savedRecipe.name}"`);
    }

    // If currently viewing the recipe, update it
    if (viewingRecipe && viewingRecipe.id === savedRecipe.id) {
      setViewingRecipe(savedRecipe);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingRecipe) return;
    const name = deletingRecipe.name;
    setRecipes(recipes.filter((r) => r.id !== deletingRecipe.id));
    setDeletingRecipe(null);
    if (viewingRecipe && viewingRecipe.id === deletingRecipe.id) {
      setViewingRecipe(null);
    }
    showToast(`Đã xóa công thức "${name}"`);
  };

  const handleRestoreDefaults = () => {
    setRecipes(DEFAULT_RECIPES);
    showToast('Đã khôi phục danh sách công thức chuẩn ban đầu!');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(recipes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cong-thuc-pha-che-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã xuất file sao lưu JSON thành công!');
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], 'UTF-8');
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRecipes(parsed);
            showToast(`Đã nhập thành công ${parsed.length} công thức!`);
          } else {
            alert('File JSON không hợp lệ hoặc không đúng định dạng mảng công thức.');
          }
        } catch (err) {
          alert('Không thể đọc file JSON. Vui lòng kiểm tra lại định dạng file!');
        }
      };
    }
  };

  // Render Login screen if not logged in
  if (role === 'guest') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const isManager = role === 'manager';

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main App Navigation Header */}
      <Header
        currentRole={role}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        onOpenAddModal={() => handleOpenAddModal()}
        nenCount={nenRecipes.length}
        toppingCount={toppingRecipes.length}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* If Active Tab is 'manage', show Manager section */}
        {activeTab === 'manage' && isManager ? (
          <ManagerDashboard
            recipes={recipes}
            onOpenAddModal={handleOpenAddModal}
            onEdit={handleOpenEditModal}
            onDelete={(r) => setDeletingRecipe(r)}
            onView={(r) => setViewingRecipe(r)}
            onRestoreDefaults={handleRestoreDefaults}
            onExportJSON={handleExportJSON}
            onImportJSON={handleImportJSON}
          />
        ) : (
          /* Normal View for 'nen' or 'topping' tab */
          <div className="space-y-6">
            {/* Staff Read-only Notice Banner */}
            {!isManager && (
              <div className="flex items-center justify-between p-3.5 bg-stone-100/90 border border-stone-200/90 rounded-2xl text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-stone-500 shrink-0" />
                  <span>
                    <strong>Màn hình Nhân Viên:</strong> Bạn đang ở chế độ xem công thức và tra cứu định lượng pha chế. Quyền chỉnh sửa chỉ dành cho Quản lý.
                  </span>
                </div>
              </div>
            )}

            {/* Manager quick notice banner on normal tabs */}
            {isManager && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  <span>
                    <strong>Chế độ Quản Lý:</strong> Bạn có quyền thêm, sửa, xóa công thức trực tiếp tại thẻ hoặc qua tab <strong>Mục Quản Lý</strong>.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAddModal(activeTab as RecipeType)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    Thêm {activeTab === 'nen' ? 'Công Thức Nền' : 'Topping'}
                  </span>
                </button>
              </div>
            )}

            {/* Search and Category Filter Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
              {/* Search input */}
              <div className="relative flex-1 max-w-lg">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="recipe-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Tìm kiếm trong ${activeTab === 'nen' ? 'Công thức nền' : 'Topping'}... (tên, nguyên liệu)`}
                  className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 shadow-xs"
                />
              </div>

              {/* Sub-categories pill filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {activeTabCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedSubCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer border ${
                      selectedSubCategory === cat
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    {cat === 'all' ? 'Tất cả phân loại' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipe Cards Grid */}
            {displayedRecipes.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center max-w-md mx-auto my-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-3">
                  {activeTab === 'nen' ? <Layers className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-1">
                  Chưa tìm thấy công thức phù hợp
                </h3>
                <p className="text-xs text-stone-500 mb-5">
                  Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc phân loại.
                </p>
                {isManager && (
                  <button
                    type="button"
                    onClick={() => handleOpenAddModal(activeTab as RecipeType)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm công thức mới</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    role={role}
                    onView={(r) => setViewingRecipe(r)}
                    onEdit={isManager ? (r) => handleOpenEditModal(r) : undefined}
                    onDelete={isManager ? (r) => setDeletingRecipe(r) : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-4 px-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Hệ thống Quản lý &amp; Tra cứu Công thức Pha chế Quầy Bar</span>
          <span className="text-stone-400">
            {role === 'manager' ? 'Đang truy cập: Quản Lý (Mật khẩu xác thực)' : 'Đang truy cập: Nhân Viên (Chỉ xem)'}
          </span>
        </div>
      </footer>

      {/* DETAIL MODAL (Available to both staff and manager) */}
      <RecipeDetailModal
        recipe={viewingRecipe}
        role={role}
        onClose={() => setViewingRecipe(null)}
        onEdit={isManager ? (r) => handleOpenEditModal(r) : undefined}
        onDelete={isManager ? (r) => setDeletingRecipe(r) : undefined}
      />

      {/* FORM MODAL: Add / Edit (Manager only) */}
      <RecipeFormModal
        isOpen={isFormOpen}
        initialRecipe={editingRecipe}
        defaultType={formDefaultType}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRecipe(null);
        }}
        onSave={handleSaveRecipe}
      />

      {/* DELETE CONFIRMATION MODAL (Manager only) */}
      <DeleteConfirmModal
        recipe={deletingRecipe}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingRecipe(null)}
      />
    </div>
  );
}
