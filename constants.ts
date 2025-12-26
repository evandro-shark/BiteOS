import { Product, Restaurant, User, Order } from './types';

export const TRANSLATIONS = {
  pt: {
    welcome: 'Bem-vindo ao BiteOS',
    select_module: 'Selecione um Módulo',
    customer_app: 'Cliente',
    pos_app: 'Caixa (PDV)',
    kds_app: 'Cozinha (KDS)',
    driver_app: 'Entregador',
    admin_app: 'Administração',
    manager_app: 'Gerencial',
    orders: 'Pedidos',
    menu: 'Cardápio',
    settings: 'Configurações',
    login: 'Entrar',
    logout: 'Sair',
    total: 'Total',
    status: 'Status',
    add_to_cart: 'Adicionar',
    checkout: 'Finalizar',
    pending: 'Pendente',
    preparing: 'Produzindo',
    ready: 'Pronto',
    delivering: 'Em Entrega',
    completed: 'Entregue',
    items: 'Itens',
    payment: 'Pagamento',
    address: 'Endereço',
    confirm_delivery: 'Confirmar Entrega',
    enter_code: 'Digite o Código',
    dashboard: 'Painel',
    sales: 'Vendas',
    open_register: 'Abrir Caixa',
    close_register: 'Fechar Caixa',
    new_order: 'Novo Pedido',
    kitchen_view: 'Visão da Cozinha',
    available_deliveries: 'Entregas Disponíveis',
    my_deliveries: 'Minhas Entregas',
    products: 'Produtos',
    users: 'Usuários',
    analytics: 'Indicadores',
  },
  en: {
    welcome: 'Welcome to BiteOS',
    select_module: 'Select Module',
    customer_app: 'Customer',
    pos_app: 'POS',
    kds_app: 'Kitchen (KDS)',
    driver_app: 'Driver',
    admin_app: 'Admin',
    manager_app: 'Management',
    orders: 'Orders',
    menu: 'Menu',
    settings: 'Settings',
    login: 'Login',
    logout: 'Logout',
    total: 'Total',
    status: 'Status',
    add_to_cart: 'Add to Cart',
    checkout: 'Checkout',
    pending: 'Pending',
    preparing: 'Preparing',
    ready: 'Ready',
    delivering: 'Delivering',
    completed: 'Delivered',
    items: 'Items',
    payment: 'Payment',
    address: 'Address',
    confirm_delivery: 'Confirm Delivery',
    enter_code: 'Enter Code',
    dashboard: 'Dashboard',
    sales: 'Sales',
    open_register: 'Open Register',
    close_register: 'Close Register',
    new_order: 'New Order',
    kitchen_view: 'Kitchen View',
    available_deliveries: 'Available Deliveries',
    my_deliveries: 'My Deliveries',
    products: 'Products',
    users: 'Users',
    analytics: 'Analytics',
  }
};

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Burger Kingpin',
    address: 'Av. Paulista, 1000',
    rating: 4.8,
    deliveryRadiusKm: 5,
    category: 'Burgers',
    image: 'https://picsum.photos/seed/burger/400/300'
  },
  {
    id: 'r2',
    name: 'Pizza Planet',
    address: 'Rua Augusta, 500',
    rating: 4.5,
    deliveryRadiusKm: 8,
    category: 'Pizza',
    image: 'https://picsum.photos/seed/pizza/400/300'
  },
  {
    id: 'r3',
    name: 'Sushi Zen',
    address: 'Rua Oscar Freire, 200',
    rating: 4.9,
    deliveryRadiusKm: 10,
    category: 'Japanese',
    image: 'https://picsum.photos/seed/sushi/400/300'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'X-Bacon Supreme',
    description: 'Double burger, crispy bacon, cheddar.',
    price: 32.90,
    category: 'Burgers',
    image: 'https://picsum.photos/seed/p1/200/200',
    active: true
  },
  {
    id: 'p2',
    name: 'Veggie Delight',
    description: 'Plant-based patty, lettuce, tomato.',
    price: 28.50,
    category: 'Burgers',
    image: 'https://picsum.photos/seed/p2/200/200',
    active: true
  },
  {
    id: 'p3',
    name: 'Cola 350ml',
    description: 'Ice cold soda.',
    price: 6.00,
    category: 'Drinks',
    image: 'https://picsum.photos/seed/p3/200/200',
    active: true
  },
  {
    id: 'p4',
    name: 'Fries',
    description: 'Crispy golden fries.',
    price: 12.00,
    category: 'Sides',
    image: 'https://picsum.photos/seed/p4/200/200',
    active: true
  },
  {
    id: 'p5',
    name: 'Pepperoni Pizza',
    description: 'Large pizza with double pepperoni.',
    price: 45.00,
    category: 'Pizza',
    image: 'https://picsum.photos/seed/p5/200/200',
    active: true
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', role: 'admin', active: true },
  { id: 'u2', name: 'Manager Mike', role: 'manager', active: true },
  { id: 'u3', name: 'Cashier Clara', role: 'cashier', active: true },
  { id: 'u4', name: 'Chef Gordon', role: 'cook', active: true },
  { id: 'u5', name: 'Driver Dave', role: 'driver', active: true, performanceScore: 4.9 },
  { id: 'u6', name: 'Driver Sarah', role: 'driver', active: true, performanceScore: 4.7 }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1001',
    restaurantId: 'r1',
    customerName: 'John Doe',
    status: 'pending',
    origin: 'app',
    paymentMethod: 'credit',
    total: 38.90,
    createdAt: new Date(new Date().getTime() - 1000 * 60 * 5), // 5 mins ago
    items: [
      { ...MOCK_PRODUCTS[0], cartId: 'c1', quantity: 1, notes: 'No onion' },
      { ...MOCK_PRODUCTS[2], cartId: 'c2', quantity: 1 }
    ]
  },
  {
    id: 'o1002',
    restaurantId: 'r1',
    customerName: 'Maria Silva',
    status: 'preparing',
    origin: 'pos',
    paymentMethod: 'cash',
    total: 45.00,
    createdAt: new Date(new Date().getTime() - 1000 * 60 * 15), // 15 mins ago
    items: [
      { ...MOCK_PRODUCTS[4], cartId: 'c3', quantity: 1 }
    ]
  },
  {
    id: 'o1003',
    restaurantId: 'r1',
    customerName: 'Carlos Santos',
    address: 'Rua das Flores, 123',
    status: 'ready',
    origin: 'app',
    paymentMethod: 'pix',
    total: 60.00,
    createdAt: new Date(new Date().getTime() - 1000 * 60 * 25), // 25 mins ago
    confirmationCode: '1234',
    items: [
      { ...MOCK_PRODUCTS[0], cartId: 'c4', quantity: 2 }
    ]
  }
];
