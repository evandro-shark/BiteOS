export type Language = 'pt' | 'en';

export type UserRole = 'admin' | 'manager' | 'cashier' | 'cook' | 'driver';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  active: boolean;
  avatar?: string;
  performanceScore?: number; // For drivers
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  active: boolean;
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
export type OrderOrigin = 'app' | 'pos' | 'table';
export type PaymentMethod = 'credit' | 'debit' | 'cash' | 'pix';

export interface Order {
  id: string;
  restaurantId: string;
  customerName: string;
  address?: string; // If delivery
  items: CartItem[];
  total: number;
  status: OrderStatus;
  origin: OrderOrigin;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  confirmationCode?: string; // For delivery
  driverId?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  deliveryRadiusKm: number;
  image: string;
  category: string;
}

// Translations
export type TranslationKey = 
  | 'welcome' | 'select_module' | 'customer_app' | 'pos_app' | 'kds_app' 
  | 'driver_app' | 'admin_app' | 'manager_app' | 'orders' | 'menu' 
  | 'settings' | 'login' | 'logout' | 'total' | 'status' | 'add_to_cart'
  | 'checkout' | 'pending' | 'preparing' | 'ready' | 'delivering' 
  | 'completed' | 'items' | 'payment' | 'address' | 'confirm_delivery'
  | 'enter_code' | 'dashboard' | 'sales' | 'open_register' | 'close_register';

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currentModule: string | null;
  setCurrentModule: (module: string | null) => void;
  
  // Data
  orders: Order[];
  products: Product[];
  users: User[];
  restaurants: Restaurant[];
  
  // Actions
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, driverId?: string) => void;
  
  // Auth (Simulated)
  currentUser: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}