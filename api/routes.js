const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Database = require('../database/database');

const router = express.Router();
const db = new Database().getDb();

// Middleware de autenticação
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, 'biteos-secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Auth
router.post('/login', (req, res) => {
  const { login, password } = req.body;
  
  db.get('SELECT * FROM users WHERE login = ? AND active = 1', [login], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, role: user.role }, 'biteos-secret');
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  });
});

// Restaurants
router.get('/restaurants', (req, res) => {
  const { lat, lng, radius } = req.query;
  let query = 'SELECT * FROM restaurants WHERE active = 1';
  
  if (lat && lng && radius) {
    query += ` AND (
      6371 * acos(
        cos(radians(${lat})) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians(${lng})) + 
        sin(radians(${lat})) * sin(radians(latitude))
      )
    ) <= delivery_radius_km`;
  }
  
  db.all(query, (err, restaurants) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(restaurants);
  });
});

// Products
router.get('/restaurants/:id/products', (req, res) => {
  db.all('SELECT * FROM products WHERE restaurant_id = ? AND active = 1', [req.params.id], (err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(products);
  });
});

// Orders
router.post('/orders', (req, res) => {
  const { customer, restaurant_id, items, payment_method, total_amount, notes, origin } = req.body;
  
  // Criar ou buscar cliente
  db.get('SELECT id FROM customers WHERE phone = ?', [customer.phone], (err, existingCustomer) => {
    const customerId = existingCustomer?.id;
    
    const insertCustomer = () => {
      db.run('INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)', 
        [customer.name, customer.phone, customer.address], function(err) {
          if (err) return res.status(500).json({ error: err.message });
          createOrder(this.lastID);
        });
    };
    
    const createOrder = (custId) => {
      db.run('INSERT INTO orders (customer_id, restaurant_id, origin, payment_method, total_amount, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [custId, restaurant_id, origin, payment_method, total_amount, notes], function(err) {
          if (err) return res.status(500).json({ error: err.message });
          
          const orderId = this.lastID;
          
          // Inserir itens
          const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, add_ons, notes, unit_price) VALUES (?, ?, ?, ?, ?, ?)');
          items.forEach(item => {
            stmt.run([orderId, item.product_id, item.quantity, JSON.stringify(item.add_ons), item.notes, item.unit_price]);
          });
          stmt.finalize();
          
          // Criar entrega se necessário
          if (origin === 'app') {
            const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            db.run('INSERT INTO deliveries (order_id, confirmation_code) VALUES (?, ?)', [orderId, confirmationCode]);
          }
          
          // Notificar em tempo real
          global.io.emit('new-order', { orderId, restaurant_id });
          
          res.json({ orderId, confirmationCode: origin === 'app' ? confirmationCode : null });
        });
    };
    
    if (customerId) {
      createOrder(customerId);
    } else {
      insertCustomer();
    }
  });
});

router.get('/orders', auth, (req, res) => {
  const { status, restaurant_id } = req.query;
  let query = `SELECT o.*, c.name as customer_name, c.phone as customer_phone, 
               r.name as restaurant_name FROM orders o 
               LEFT JOIN customers c ON o.customer_id = c.id 
               LEFT JOIN restaurants r ON o.restaurant_id = r.id WHERE 1=1`;
  const params = [];
  
  if (status) {
    query += ' AND o.status = ?';
    params.push(status);
  }
  
  if (restaurant_id) {
    query += ' AND o.restaurant_id = ?';
    params.push(restaurant_id);
  }
  
  query += ' ORDER BY o.created_at DESC';
  
  db.all(query, params, (err, orders) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(orders);
  });
});

router.put('/orders/:id/status', auth, (req, res) => {
  const { status } = req.body;
  
  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    global.io.emit('order-status-updated', { orderId: req.params.id, status });
    res.json({ success: true });
  });
});

// Deliveries
router.get('/deliveries', auth, (req, res) => {
  const query = `SELECT d.*, o.total_amount, c.name as customer_name, c.address as customer_address 
                 FROM deliveries d 
                 JOIN orders o ON d.order_id = o.id 
                 JOIN customers c ON o.customer_id = c.id 
                 WHERE d.status != 'delivered' ORDER BY d.created_at`;
  
  db.all(query, (err, deliveries) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(deliveries);
  });
});

router.put('/deliveries/:id/pickup', auth, (req, res) => {
  db.run('UPDATE deliveries SET driver_id = ?, status = ?, pickup_time = CURRENT_TIMESTAMP WHERE id = ?', 
    [req.user.id, 'out_for_delivery', req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      global.io.emit('delivery-picked-up', { deliveryId: req.params.id });
      res.json({ success: true });
    });
});

router.put('/deliveries/:id/deliver', auth, (req, res) => {
  const { confirmation_code } = req.body;
  
  db.get('SELECT confirmation_code FROM deliveries WHERE id = ?', [req.params.id], (err, delivery) => {
    if (err || !delivery) return res.status(400).json({ error: 'Delivery not found' });
    
    if (delivery.confirmation_code !== confirmation_code) {
      return res.status(400).json({ error: 'Invalid confirmation code' });
    }
    
    db.run('UPDATE deliveries SET status = ?, delivery_time = CURRENT_TIMESTAMP WHERE id = ?', 
      ['delivered', req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        db.run('UPDATE orders SET status = ? WHERE id = (SELECT order_id FROM deliveries WHERE id = ?)', 
          ['delivered', req.params.id]);
        
        global.io.emit('delivery-completed', { deliveryId: req.params.id });
        res.json({ success: true });
      });
  });
});

// Cash Register
router.post('/cash-register/open', auth, (req, res) => {
  const { opening_amount, restaurant_id } = req.body;
  
  db.run('INSERT INTO cash_register (user_id, restaurant_id, opening_amount) VALUES (?, ?, ?)',
    [req.user.id, restaurant_id, opening_amount], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ registerId: this.lastID });
    });
});

router.put('/cash-register/:id/close', auth, (req, res) => {
  const { closing_amount } = req.body;
  
  db.run('UPDATE cash_register SET closing_amount = ?, closed_at = CURRENT_TIMESTAMP WHERE id = ?',
    [closing_amount, req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
});

// Reports
router.get('/reports/sales', auth, (req, res) => {
  const { start_date, end_date, restaurant_id } = req.query;
  
  let query = `SELECT DATE(created_at) as date, COUNT(*) as orders, SUM(total_amount) as revenue 
               FROM orders WHERE created_at BETWEEN ? AND ?`;
  const params = [start_date, end_date];
  
  if (restaurant_id) {
    query += ' AND restaurant_id = ?';
    params.push(restaurant_id);
  }
  
  query += ' GROUP BY DATE(created_at) ORDER BY date';
  
  db.all(query, params, (err, sales) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(sales);
  });
});

module.exports = router;