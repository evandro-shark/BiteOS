const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'biteos.db'));
    this.init();
  }

  init() {
    this.db.serialize(() => {
      // Clientes
      this.db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        address TEXT,
        preferred_language TEXT DEFAULT 'pt-BR',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Lanchonetes
      this.db.run(`CREATE TABLE IF NOT EXISTS restaurants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        delivery_radius_km INTEGER DEFAULT 3,
        active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Produtos
      this.db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        restaurant_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        price REAL NOT NULL,
        image TEXT,
        add_ons TEXT,
        active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
      )`);

      // Operadores
      this.db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        login TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        restaurant_id INTEGER,
        active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
      )`);

      // Pedidos
      this.db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        restaurant_id INTEGER,
        origin TEXT NOT NULL,
        status TEXT DEFAULT 'received',
        payment_method TEXT,
        total_amount REAL NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers (id),
        FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
      )`);

      // Itens do Pedido
      this.db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        add_ons TEXT,
        notes TEXT,
        unit_price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )`);

      // Caixa
      this.db.run(`CREATE TABLE IF NOT EXISTS cash_register (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        restaurant_id INTEGER NOT NULL,
        opening_amount REAL NOT NULL,
        closing_amount REAL,
        withdrawals REAL DEFAULT 0,
        deposits REAL DEFAULT 0,
        opened_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        closed_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
      )`);

      // Entregas
      this.db.run(`CREATE TABLE IF NOT EXISTS deliveries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        driver_id INTEGER,
        status TEXT DEFAULT 'waiting',
        confirmation_code TEXT,
        pickup_time DATETIME,
        delivery_time DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (driver_id) REFERENCES users (id)
      )`);

      // Contestações
      this.db.run(`CREATE TABLE IF NOT EXISTS disputes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        delivery_id INTEGER NOT NULL,
        origin TEXT NOT NULL,
        reason TEXT NOT NULL,
        evidence TEXT,
        status TEXT DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (delivery_id) REFERENCES deliveries (id)
      )`);

      console.log('Database initialized');
    });
  }

  getDb() {
    return this.db;
  }
}

module.exports = Database;