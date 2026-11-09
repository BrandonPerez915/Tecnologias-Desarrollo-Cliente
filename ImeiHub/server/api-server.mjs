import express from 'express';
import cors from 'cors';
import { loadDatabase, saveDatabase } from './db.mjs';
import {
  ROLES,
  authenticate,
  hashPassword,
  requireRole,
  signToken,
  tenantId,
  toSafeUser,
  verifyPassword
} from './auth.mjs';

const app = express();
const PORT = process.env['PORT'] || 3000;
const SIMULATED_LATENCY_MS = 1000;

// Global CORS configuration to allow requests from any origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['*']
}));
// Global JSON body parser with a size limit of 10MB
app.use(express.json({ limit: '10mb' }));

// Middleware to simulate network latency for testing purposes
if (SIMULATED_LATENCY_MS > 0) {
  app.use((req, res, next) => setTimeout(next, SIMULATED_LATENCY_MS));
}
// Middleware to log incoming requests for debugging and monitoring
app.use((req, res, next) => {
  console.log(`[ImeiHub Express API] ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware to inject the db into the request
app.use((req, res, next) => {
  req.db = loadDatabase();
  next();
});
// Every route except health, login and register requires a valid JWT
app.use(authenticate);

// ==========================================
// 1. HEALTH CHECK
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ImeiHub API REST (Express)',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 2. AUTH
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const db = req.db;
  const email = (req.body.email || '').trim().toLowerCase();
  const password = (req.body.password || '').trim();

  if (!email || !password) {
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Ingresa correo y contraseña'
    });
  }

  const user = db.users?.find(u => (u.email || '').toLowerCase() === email);
  if (!user || !verifyPassword(password, user.password)) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Correo o contraseña incorrectos. Verifica tus credenciales.'
    });
  }

  res.json({
    message: 'Sesión iniciada con éxito',
    token: signToken(user),
    user: toSafeUser(user)
  });
});

app.post('/api/auth/register', (req, res) => {
  const db = req.db;
  if (!Array.isArray(db.users)) db.users = [];

  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = (req.body.password || '').trim();
  const storeName = (req.body.storeName || '').trim() || 'Mi Tienda';
  const stallNumber = (req.body.stallNumber || '').trim() || 'A-01';
  const phone = (req.body.phone || '').trim();

  if (!name || !email || !password) {
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Nombre, correo y contraseña son obligatorios'
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: 'La contraseña debe tener al menos 8 caracteres'
    });
  }

  const exists = db.users.some(user => user.email?.toLowerCase() === email);
  if (exists) {
    return res.status(409).json({
      statusCode: 409,
      error: 'Conflict',
      message: `Ya existe una cuenta registrada con el correo ${email}`
    });
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    name,
    email,
    password: hashPassword(password),
    // Whoever registers a store is its owner, the role is never taken from the request
    role: ROLES.OWNER,
    storeName,
    stallNumber,
    phone,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDatabase(db);

  res.status(201).json({
    message: 'Cuenta registrada exitosamente',
    token: signToken(newUser),
    user: toSafeUser(newUser)
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ user: toSafeUser(req.user) });
});

// ==========================================
// PRODUCTS CRUD
// ==========================================
app.get('/api/products', (req, res) => {
  const db = req.db;
  let list = db.products?.filter(product => product.userId === tenantId(req.user));
  const category = req.query.category;
  const search = req.query.search;

  if (category && category !== 'all') {
    list = list.filter(product => product.category?.toLowerCase() === String(category).toLowerCase());
  }

  if (search && String(search).trim()) {
    const query = String(search).trim().toLowerCase();
    list = list?.filter(product => product.name?.toLowerCase().includes(query) || product.sku?.toLowerCase().includes(query));
  }

  res.json(list);
});

app.get('/api/products/:id', (req, res) => {
  const db = req.db;
  const id = parseInt(req.params.id, 10);
  const product = db.products?.find(product => product.id === id && product.userId === tenantId(req.user));

  if (!product) {
    return res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: `Producto con ID ${id} no encontrado`
    });
  }

  res.json(product);
});

app.post('/api/products', (req, res) => {
  const db = req.db;
  const body = req.body;
  if (!body.name || !body.name.trim()) {
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: 'El nombre del producto es obligatorio'
    });
  }

  // Parse and validate price, cost, and minPrice fields
  let priceNum = body.price;
  if (typeof priceNum !== 'number') {
    priceNum = parseFloat(String(priceNum || 0).replace(/,/g, ''));
  }

  if (isNaN(priceNum) || priceNum <= 0) {
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: 'El precio debe ser un número mayor a 0'
    });
  }

  // Get the next available product ID, defaulting to 1 if there are no products yet
  let nextId = 1;
  if (db.products.length > 0) {
    nextId = Math.max(...db.products.map(product => product.id)) + 1;
  }
  // Parse and validate variants, at least one variant exists with a default color and stock
  let variants = [{ color: 'Estándar', stock: 1 }];
  if (body.variants?.length > 0) {
    variants = body.variants.map(variant => ({
      color: variant.color || 'Estándar',
      stock: parseInt(variant.stock, 10) || 0
    }));
  }
  const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);

  let costNum = body.cost
  if (typeof costNum !== 'number') {
    costNum = parseFloat(String(body.cost || priceNum * 0.85).replace(/,/g, ''));
  }

  let minPriceNum = body.minPrice;
  if (typeof minPriceNum !== 'number') {
    minPriceNum = parseFloat(String(body.minPrice || priceNum * 0.9).replace(/,/g, ''));
  }

  if (priceNum < minPriceNum) {
    return res.status(422).json({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: 'El precio ideal de venta no puede ser menor al precio mínimo'
    });
  }

  const newProduct = {
    id: nextId,
    userId: tenantId(req.user),
    name: body.name.trim(),
    sku: body.sku?.trim() || `SKU-${nextId}`,
    stock: totalStock,
    price: priceNum.toLocaleString('es-MX'),
    cost: costNum.toLocaleString('es-MX'),
    minPrice: minPriceNum.toLocaleString('es-MX'),
    type: body.type || 'Smartphones',
    category: body.category || 'Phones',
    location: body.location || 'Vitrina Principal',
    variants,
    identifier: {
      barcode: '8901420' + String(nextId).padStart(6, '0'),
      serial: body.serial?.trim() || `SN-${nextId}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      condition: body.condition || 'Nuevo · Sellado',
      added: 'Hoy'
    }
  };

  db.products.unshift(newProduct);
  saveDatabase(db);
  res.status(201).json(newProduct);
});

// Only the owner can change prices and data of the catalog
app.put('/api/products/:id', requireRole(ROLES.OWNER), (req, res) => {
  const db = req.db;
  const id = parseInt(req.params.id, 10);
  const index = (db.products || []).findIndex(p => p.id === id && p.userId === tenantId(req.user));

  if (index === -1) {
    return res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: `Producto con ID ${id} no encontrado`
    });
  }

  const body = req.body;
  const existing = db.products[index];

  let priceNum = parseFloat(existing.price.replace(/,/g, ''))
  if (body.price !== undefined) {
    if (typeof body.price === 'number') priceNum = body.price;
    else priceNum = parseFloat(String(body.price).replace(/,/g, ''));
  }

  let minPriceNum = parseFloat(existing.minPrice.replace(/,/g, ''));
  if (body.minPrice !== undefined) {
    if (typeof body.minPrice === 'number') minPriceNum = body.minPrice;
    else minPriceNum = parseFloat(String(body.minPrice).replace(/,/g, ''));
  }

  if (priceNum < minPriceNum) {
    return res.status(422).json({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: 'El precio ideal de venta no puede ser menor al precio mínimo'
    });
  }

  const updated = {
    ...existing,
    name: body.name !== undefined ? body.name.trim() : existing.name,
    sku: body.sku !== undefined ? body.sku.trim() : existing.sku,
    stock: body.stock !== undefined ? parseInt(body.stock, 10) : existing.stock,
    price: priceNum.toLocaleString('es-MX'),
    cost: body.cost !== undefined ? (typeof body.cost === 'number' ? body.cost : parseFloat(String(body.cost).replace(/,/g, ''))).toLocaleString('es-MX') : existing.cost,
    minPrice: minPriceNum.toLocaleString('es-MX'),
    variants: body.variants || existing.variants
  };

  db.products[index] = updated;
  saveDatabase(db);
  res.json(updated);
});

// Only the owner can remove products from the inventory
app.delete('/api/products/:id', requireRole(ROLES.OWNER), (req, res) => {
  const db = req.db;
  const id = parseInt(req.params.id, 10);
  const index = (db.products || []).findIndex(p => p.id === id && p.userId === tenantId(req.user));

  if (index === -1) {
    return res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: `Producto con ID ${id} no encontrado`
    });
  }

  const deleted = db.products.splice(index, 1)[0];
  saveDatabase(db);
  res.json({ message: `Producto "${deleted.name}" eliminado correctamente`, id });
});

// ==========================================
// CASH MANAGEMENT
// ==========================================
app.get('/api/cash', (req, res) => {
  const db = req.db;
  const storeId = tenantId(req.user);
  const userEntries = db.cash.entries?.filter(e => e.userId === storeId);
  const initialBase = storeId === 'usr_1' ? (db.cash.initialBase || 9834) : 0;

  res.json({
    initialBase,
    entries: userEntries
  });
});

app.post('/api/cash/entries', (req, res) => {
  const db = req.db;
  const authUser = req.user;
  const body = req.body;
  const amountNum = parseFloat(String(body.amount || 0).replace(/[^0-9.]/g, ''));

  if (isNaN(amountNum) || amountNum <= 0) {
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: 'El monto debe ser mayor a 0'
    });
  }

  const nextId = db.cash.entries.length > 0 ? Math.max(...db.cash.entries.map(e => e.id || 0)) + 1 : 1;
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newEntry = {
    id: nextId,
    userId: tenantId(authUser),
    time: timeStr,
    title: body.title || 'Movimiento de caja',
    note: body.note || `${authUser.name} · Mostrador`,
    amount: (body.kind === 'out' ? '-' : '+') + amountNum.toLocaleString('es-MX'),
    kind: body.kind === 'out' ? 'out' : 'in'
  };

  db.cash.entries.unshift(newEntry);
  saveDatabase(db);
  res.status(201).json(newEntry);
});

// Closing the shift and reconciling cash is reserved to the owner
app.post('/api/cash/close', requireRole(ROLES.OWNER), (req, res) => {
  const db = req.db;
  const body = req.body;

  const closure = {
    id: Date.now(),
    userId: tenantId(req.user),
    date: new Date().toISOString(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    countedCash: body.countedCash,
    notes: body.notes || 'Cierre regular de jornada',
    expectedCash: body.expectedCash,
    difference: body.difference
  };

  if (!Array.isArray(db.cash.closures)) db.cash.closures = [];
  db.cash.closures.unshift(closure);
  saveDatabase(db);
  res.json({ message: 'Caja cerrada y conciliada con éxito', closure });
});

// ==========================================
// LOANS MANAGEMENT
// ==========================================
app.get('/api/loans', (req, res) => {
  const db = req.db;
  const userLoans = (db.loans || []).filter(l => l.userId === tenantId(req.user));
  res.json(userLoans);
});

app.post('/api/loans', (req, res) => {
  const db = req.db;
  const body = req.body;

  if (!body.item || !body.stall || !body.person) {
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Artículo, puesto y persona responsable son requeridos'
    });
  }

  const nextId = db.loans.length > 0 ? Math.max(...db.loans.map(l => l.id || 0)) + 1 : 1;
  const masked = body.serial && body.serial.length > 8
    ? body.serial.substring(0, 8) + '•••'
    : body.serial || 'SN-TEMPORAL';

  const newLoan = {
    id: nextId,
    userId: tenantId(req.user),
    item: body.item.trim(),
    serial: masked,
    fullSerial: body.serial?.trim() || 'SN-TEMPORAL',
    stall: body.stall.trim(),
    person: body.person.trim(),
    age: '1 min',
    status: 'Pendiente',
    tone: 'neutral',
    loanedAt: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    dueAt: 'Hoy, 2 horas',
    condition: 'Buen estado',
    agreedPrice: 'MXN 0.00',
    notes: body.notes?.trim() || 'Préstamo registrado en mostrador.'
  };

  db.loans.unshift(newLoan);
  saveDatabase(db);
  res.status(201).json(newLoan);
});

const returnLoanHandler = (req, res) => {
  const db = req.db;
  const id = parseInt(req.params.id, 10);
  const loan = (db.loans || []).find(l => l.id === id && l.userId === tenantId(req.user));

  if (!loan) {
    return res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: `Préstamo con ID ${id} no encontrado`
    });
  }

  loan.status = 'Devuelto';
  loan.tone = 'success';
  saveDatabase(db);
  res.json(loan);
};

app.patch('/api/loans/:id/return', returnLoanHandler);
app.post('/api/loans/:id/return', returnLoanHandler);

// ==========================================
// ORDERS MANAGEMENT
// ==========================================
app.get('/api/orders', (req, res) => {
  const db = req.db;
  const userOrders = (db.orders || []).filter(o => o.userId === tenantId(req.user));
  res.json(userOrders);
});

app.post('/api/orders', (req, res) => {
  const db = req.db;
  const body = req.body;

  const nextNum = db.orders.length > 0 ? Math.max(...db.orders.map(o => parseInt(String(o.id).replace(/\D/g, '') || '0', 10))) + 1 : 1043;
  const nextId = String(nextNum);

  const newOrder = {
    id: nextId,
    userId: tenantId(req.user),
    name: body.name?.trim() || `#${nextId}`,
    customer: body.customer?.trim() || (body.type === 'Mayorista' ? 'Distribuidor mayorista' : 'Cliente de mostrador'),
    type: body.type || 'Minorista',
    status: 'En espera',
    items: {}
  };

  db.orders.unshift(newOrder);
  saveDatabase(db);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/items', (req, res) => {
  const db = req.db;
  const orderId = req.params.id;
  const order = (db.orders || []).find(o => o.id === orderId && o.userId === tenantId(req.user));

  if (!order) {
    return res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: `Orden ${orderId} no encontrada`
    });
  }

  order.items = req.body.items || {};
  saveDatabase(db);
  res.json(order);
});

app.post('/api/orders/:id/checkout', (req, res) => {
  const db = req.db;
  const orderId = req.params.id;
  const order = (db.orders || []).find(o => o.id === orderId && o.userId === tenantId(req.user));

  if (!order) {
    return res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: `Orden ${orderId} no encontrada`
    });
  }

  const body = req.body;

  // Discount and total validation
  if (body.items && Array.isArray(body.items)) {
    for (const item of body.items) {
      const prod = db.products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
      }
    }
  }

  // Record the cash entry for the order payment if the total is greater than 0
  const amountNum = typeof body.total === 'number' ? body.total : parseFloat(String(body.total).replace(/,/g, ''));
  if (amountNum > 0) {
    const nextCashId = db.cash.entries.length > 0 ? Math.max(...db.cash.entries.map(e => e.id || 0)) + 1 : 1;
    db.cash.entries.unshift({
      id: nextCashId,
      userId: tenantId(req.user),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `Orden ${order.name}`,
      note: `Venta · ${body.paymentMethod || 'Efectivo'} · Mostrador`,
      amount: `+${amountNum.toLocaleString('es-MX')}`,
      kind: 'in'
    });
  }

  order.status = 'Pagada';
  order.items = {};
  saveDatabase(db);
  res.json({ message: 'Orden liquidada y cobrada con éxito', order });
});

// ==========================================
// RUTES NOT FOUND (404)
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    error: 'Not Found',
    message: `Ruta ${req.method} ${req.originalUrl} no existe en ImeiHub API`
  });
});

// ==========================================
// ERROR HANDLING (500)
// ==========================================
app.use((err, req, res, next) => {
  console.error('[ImeiHub Express API Error]', err);
  res.status(500).json({
    statusCode: 500,
    error: 'Internal Server Error',
    message: err.message || 'Error interno en el servidor API'
  });
});

// Server startup
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[ImeiHub Express API] Servidor Express escuchando en http://localhost:${PORT}`);
  console.log(`[ImeiHub Express API] Accesible también en http://127.0.0.1:${PORT}`);
  console.log(`[ImeiHub Express API] Base de datos JSON sincronizada.`);
});
