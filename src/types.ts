export type RecipeType = 'nen' | 'topping';

export type UserRole = 'guest' | 'staff' | 'manager';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  note?: string;
}

export interface Recipe {
  id: string;
  name: string;
  type: RecipeType; // 'nen' (Trà/Cà phê/Cốt nền) hoặc 'topping' (Trân châu/Thạch/Foam)
  category: string; // Phân loại con: Bí Đao, Nước Đường, Sữa Nền, Matcha, Trân Châu, Thạch, Pudding, Khúc Bạch, v.v.
  yieldAmount: number; // Sản lượng cơ bản theo 1CT (VD: 7000, 64, 450)
  yieldUnit: string; // Đơn vị sản lượng (ml, viên, gr, cái)
  yieldDisplay?: string; // Hiển thị sản lượng đặc biệt như dải số (VD: '1.800 - 2.000 gr')
  ratio?: string; // Tỉ lệ đặc biệt (VD: '1 : 6')
  specialNote?: string; // Ghi chú kỹ thuật của bếp quán
  shelfLife: string; // Hạn dùng & bảo quản
  storageNote: string; // Hướng dẫn bảo quản nhiệt độ, đồ đựng
  prepTimeMinutes: number; // Thời gian thực hiện (phút)
  difficulty?: 'Dễ' | 'Trung bình' | 'Khá' | 'Cần chú ý';
  ingredients: Ingredient[];
  steps: string[];
  tips?: string[]; // Mẹo quan trọng cho barista / phụ bếp
  updatedAt: string;
}
