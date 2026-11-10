import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashPassword, isHashed, ROLES } from './auth.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

export function getInitialData() {
  const products = [{
      id: 1,
      userId: "usr_1",
      name: "iPhone 13 Pro · 256GB",
      sku: "APL-13P-256-GR",
      stock: 3,
      price: "15,999",
      cost: "14,200",
      minPrice: "14,999",
      type: "Smartphones",
      category: "Phones",
      location: "Case A · Row 2",
      variants: [{
          color: "Graphite",
          stock: 1
      }, {
          color: "Sierra Blue",
          stock: 1
      }, {
          color: "Gold",
          stock: 1
      }],
      identifier: {
          barcode: "8901420013179",
          serial: "353909104836421",
          condition: "Nuevo · Sellado",
          added: "12 jun 2024"
      }
  }, {
      id: 2,
      userId: "usr_1",
      name: "Samsung Galaxy A54 · 128GB",
      sku: "SAM-A54-128-BK",
      stock: 6,
      price: "6,499",
      cost: "5,300",
      minPrice: "5,999",
      type: "Smartphones",
      category: "Phones",
      location: "Case A · Row 4",
      variants: [{
          color: "Black",
          stock: 3
      }, {
          color: "Lime",
          stock: 1
      }, {
          color: "Violet",
          stock: 2
      }],
      identifier: {
          barcode: "8901420014282",
          serial: "351728691024875",
          condition: "Nuevo · Sellado",
          added: "10 jun 2024"
      }
  }, {
      id: 3,
      userId: "usr_1",
      name: "Cargador rápido Oraimo 20W",
      sku: "ORA-20W-C-WH",
      stock: 18,
      price: "349",
      cost: "220",
      minPrice: "299",
      type: "Accessories",
      category: "Chargers",
      location: "Wall B · Hook 12",
      variants: [{
          color: "White",
          stock: 11
      }, {
          color: "Black",
          stock: 7
      }],
      identifier: {
          barcode: "8901420015395",
          serial: "ORA20W840219",
          condition: "Nuevo",
          added: "08 jun 2024"
      }
  }];

  const cash = {
      initialBase: 9834,
      entries: [{
          id: 1,
          userId: "usr_1",
          time: "12:42",
          title: "iPhone 13 Pro · 256GB",
          note: "Venta · Tarjeta · Ada Okafor",
          amount: "+15,999",
          kind: "in"
      }, {
          id: 2,
          userId: "usr_1",
          time: "11:18",
          title: "Stock de Bright Mobile",
          note: "Compra de mercancía · Ada Okafor",
          amount: "-7,850",
          kind: "out"
      }],
      closures: []
  };

  const loans = [{
      id: 1,
      userId: "usr_1",
      item: "iPhone 12 · 128GB",
      serial: "35390910483•••",
      fullSerial: "353909104836421",
      stall: "B-14",
      person: "Musa Ade",
      age: "3 h 18 min",
      status: "Atrasado",
      tone: "danger",
      loanedAt: "Hoy, 09:30",
      dueAt: "Hoy, 11:30",
      condition: "Buen estado · 82% batería",
      agreedPrice: "MXN 7,800",
      notes: "Equipo entregado con funda transparente."
  }];

  const orders = [{
      id: "1042",
      userId: "usr_1",
      name: "#1042",
      customer: "Cliente de mostrador",
      type: "Minorista",
      status: "En espera",
      items: {
          1: 1,
          3: 2
      }
  }];

  const users = [{
      id: "usr_1",
      name: "Ada Okafor",
      email: "ada.okafor@imeihub.com",
      password: "Password123!",
      role: ROLES.OWNER,
      storeName: "SmartFix Celulares",
      stallNumber: "A-18",
      createdAt: "2024-01-15T08:00:00.000Z"
  }, {
      id: "usr_2",
      name: "Carlos Mendoza",
      email: "carlos.mendoza@imeihub.com",
      password: "Vendedor123!",
      role: ROLES.SELLER,
      ownerId: "usr_1",
      storeName: "SmartFix Celulares",
      stallNumber: "A-18",
      createdAt: "2024-02-01T08:00:00.000Z"
  }];

  return { products, cash, loans, orders, users };
}

export function loadDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const data = getInitialData();
    migrateDatabase(data);
    saveDatabase(data);
    return data;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    if (migrateDatabase(data)) {
      saveDatabase(data);
    }
    return data;
  } catch (err) {
    console.error('Error reading db.json, recreating with initial seed', err);
    const data = getInitialData();
    migrateDatabase(data);
    saveDatabase(data);
    return data;
  }
}

// Fills missing collections, adds the test users and hashes the plain text passwords
// (the seed passwords are only stored hashed in db.json)
function migrateDatabase(data) {
  let changed = false;
  const seed = getInitialData();

  for (const key of ['products', 'loans', 'orders', 'users']) {
    if (!Array.isArray(data[key])) {
      data[key] = seed[key];
      changed = true;
    }
  }
  if (!data.cash || !Array.isArray(data.cash.entries)) {
    data.cash = seed.cash;
    changed = true;
  }

  for (const seedUser of seed.users) {
    if (!data.users.some(user => user.email?.toLowerCase() === seedUser.email)) {
      data.users.push(seedUser);
      changed = true;
    }
  }

  for (const user of data.users) {
    if (!isHashed(user.password)) {
      user.password = hashPassword(String(user.password || ''));
      changed = true;
    }
    if (user.role !== ROLES.OWNER && user.role !== ROLES.SELLER) {
      user.role = ROLES.OWNER;
      changed = true;
    }
  }

  return changed;
}

export function saveDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
