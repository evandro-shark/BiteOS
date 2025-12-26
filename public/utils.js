class BiteOSUtils {
  constructor() {
    this.baseURL = window.location.origin;
    this.socket = io();
    this.token = localStorage.getItem('biteos-token');
  }

  // API calls
  async api(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` })
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${this.baseURL}/api${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  // Auth
  async login(credentials) {
    const result = await this.api('/login', {
      method: 'POST',
      body: credentials
    });
    
    this.token = result.token;
    localStorage.setItem('biteos-token', result.token);
    localStorage.setItem('biteos-user', JSON.stringify(result.user));
    
    return result;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('biteos-token');
    localStorage.removeItem('biteos-user');
    window.location.href = '/';
  }

  getUser() {
    const user = localStorage.getItem('biteos-user');
    return user ? JSON.parse(user) : null;
  }

  // WebSocket
  joinRoom(room) {
    this.socket.emit('join-room', room);
  }

  onOrderUpdate(callback) {
    this.socket.on('new-order', callback);
    this.socket.on('order-status-updated', callback);
  }

  onDeliveryUpdate(callback) {
    this.socket.on('delivery-picked-up', callback);
    this.socket.on('delivery-completed', callback);
  }

  // Utilities
  formatCurrency(amount) {
    return new Intl.NumberFormat(i18n.getCurrentLanguage(), {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  formatDate(date) {
    return new Intl.DateTimeFormat(i18n.getCurrentLanguage()).format(new Date(date));
  }

  formatTime(date) {
    return new Intl.DateTimeFormat(i18n.getCurrentLanguage(), {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  generateConfirmationCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

window.biteOS = new BiteOSUtils();