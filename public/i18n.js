class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('biteos-lang') || 'pt-BR';
    this.translations = {
      'pt-BR': {
        // Common
        'app.name': 'BiteOS',
        'common.loading': 'Carregando...',
        'common.error': 'Erro',
        'common.success': 'Sucesso',
        'common.cancel': 'Cancelar',
        'common.confirm': 'Confirmar',
        'common.save': 'Salvar',
        'common.edit': 'Editar',
        'common.delete': 'Excluir',
        'common.search': 'Buscar',
        'common.filter': 'Filtrar',
        'common.total': 'Total',
        'common.quantity': 'Quantidade',
        'common.price': 'Preço',
        'common.name': 'Nome',
        'common.phone': 'Telefone',
        'common.address': 'Endereço',
        'common.notes': 'Observações',
        
        // Customer App
        'customer.title': 'Delivery',
        'customer.restaurants': 'Restaurantes',
        'customer.menu': 'Cardápio',
        'customer.cart': 'Carrinho',
        'customer.checkout': 'Finalizar Pedido',
        'customer.order.tracking': 'Acompanhar Pedido',
        'customer.order.history': 'Histórico',
        
        // POS App
        'pos.title': 'PDV - Caixa',
        'pos.open.register': 'Abrir Caixa',
        'pos.close.register': 'Fechar Caixa',
        'pos.new.order': 'Novo Pedido',
        'pos.payment': 'Pagamento',
        
        // Kitchen App
        'kitchen.title': 'Cozinha',
        'kitchen.orders': 'Pedidos',
        'kitchen.start.production': 'Iniciar Produção',
        'kitchen.mark.ready': 'Marcar Pronto',
        
        // Delivery App
        'delivery.title': 'Entregador',
        'delivery.available': 'Entregas Disponíveis',
        'delivery.pickup': 'Retirar Pedido',
        'delivery.deliver': 'Entregar',
        'delivery.confirmation.code': 'Código de Confirmação',
        
        // Admin App
        'admin.title': 'Administração',
        'admin.products': 'Produtos',
        'admin.categories': 'Categorias',
        'admin.users': 'Usuários',
        'admin.settings': 'Configurações',
        
        // Management App
        'management.title': 'Gerencial',
        'management.dashboard': 'Dashboard',
        'management.reports': 'Relatórios',
        'management.ranking': 'Ranking',
        
        // Order Status
        'order.status.received': 'Recebido',
        'order.status.production': 'Em Produção',
        'order.status.ready': 'Pronto',
        'order.status.out_for_delivery': 'Saiu para Entrega',
        'order.status.delivered': 'Entregue'
      },
      'en-US': {
        // Common
        'app.name': 'BiteOS',
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'common.cancel': 'Cancel',
        'common.confirm': 'Confirm',
        'common.save': 'Save',
        'common.edit': 'Edit',
        'common.delete': 'Delete',
        'common.search': 'Search',
        'common.filter': 'Filter',
        'common.total': 'Total',
        'common.quantity': 'Quantity',
        'common.price': 'Price',
        'common.name': 'Name',
        'common.phone': 'Phone',
        'common.address': 'Address',
        'common.notes': 'Notes',
        
        // Customer App
        'customer.title': 'Delivery',
        'customer.restaurants': 'Restaurants',
        'customer.menu': 'Menu',
        'customer.cart': 'Cart',
        'customer.checkout': 'Checkout',
        'customer.order.tracking': 'Track Order',
        'customer.order.history': 'History',
        
        // POS App
        'pos.title': 'POS - Register',
        'pos.open.register': 'Open Register',
        'pos.close.register': 'Close Register',
        'pos.new.order': 'New Order',
        'pos.payment': 'Payment',
        
        // Kitchen App
        'kitchen.title': 'Kitchen',
        'kitchen.orders': 'Orders',
        'kitchen.start.production': 'Start Production',
        'kitchen.mark.ready': 'Mark Ready',
        
        // Delivery App
        'delivery.title': 'Delivery Driver',
        'delivery.available': 'Available Deliveries',
        'delivery.pickup': 'Pickup Order',
        'delivery.deliver': 'Deliver',
        'delivery.confirmation.code': 'Confirmation Code',
        
        // Admin App
        'admin.title': 'Administration',
        'admin.products': 'Products',
        'admin.categories': 'Categories',
        'admin.users': 'Users',
        'admin.settings': 'Settings',
        
        // Management App
        'management.title': 'Management',
        'management.dashboard': 'Dashboard',
        'management.reports': 'Reports',
        'management.ranking': 'Ranking',
        
        // Order Status
        'order.status.received': 'Received',
        'order.status.production': 'In Production',
        'order.status.ready': 'Ready',
        'order.status.out_for_delivery': 'Out for Delivery',
        'order.status.delivered': 'Delivered'
      }
    };
  }

  t(key) {
    return this.translations[this.currentLang][key] || key;
  }

  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('biteos-lang', lang);
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
  }

  getCurrentLanguage() {
    return this.currentLang;
  }
}

window.i18n = new I18n();