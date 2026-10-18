import type { Product, ProductIdentifier } from "../types/inventory";
import type { CashEntry } from "../types/cash";
import type { LoanEntry } from "../types/loans";

export const products: Product[] = [
  { id: 1, name: "iPhone 13 Pro · 256GB", sku: "APL-13P-256-GR", stock: 3, price: "15,999", cost: "14,200", type: "Smartphones", category: "Phones", location: "Case A · Row 2", variants: [{ color: "Graphite", stock: 1 }, { color: "Sierra Blue", stock: 1 }, { color: "Gold", stock: 1 }] },
  { id: 2, name: "Samsung Galaxy A54 · 128GB", sku: "SAM-A54-128-BK", stock: 6, price: "6,499", cost: "5,300", type: "Smartphones", category: "Phones", location: "Case A · Row 4", variants: [{ color: "Black", stock: 3 }, { color: "Lime", stock: 1 }, { color: "Violet", stock: 2 }] },
  { id: 3, name: "Cargador rápido Oraimo 20W", sku: "ORA-20W-C-WH", stock: 18, price: "349", cost: "220", type: "Accessories", category: "Chargers", location: "Wall B · Hook 12", variants: [{ color: "White", stock: 11 }, { color: "Black", stock: 7 }] },
  { id: 4, name: "AirPods Pro · 2.ª gen.", sku: "APL-APP2-WH", stock: 2, price: "4,699", cost: "4,050", type: "Accessories", category: "Audio", location: "Glass B · Row 1", variants: [{ color: "White", stock: 2 }] },
  { id: 5, name: "Funda de silicona para iPhone 14", sku: "CAS-IP14-SI-BK", stock: 24, price: "449", cost: "210", type: "Accessories", category: "Cases", location: "Wall A · Hook 06", variants: [{ color: "Black", stock: 8 }, { color: "Blue", stock: 6 }, { color: "Red", stock: 5 }, { color: "Purple", stock: 5 }] },
  { id: 6, name: "Cable USB-C trenzado · 2 m", sku: "CBL-USBC-2M-BK", stock: 1, price: "329", cost: "160", type: "Accessories", category: "Cables", location: "Counter bin 3", variants: [{ color: "Black", stock: 1 }, { color: "White", stock: 0 }] },
  { id: 7, name: "MacBook Air M2 · 256GB", sku: "APL-MBA-M2-256", stock: 4, price: "21,999", cost: "19,200", type: "Laptops", category: "Computers", location: "Case C · Row 1", variants: [{ color: "Midnight", stock: 2 }, { color: "Silver", stock: 1 }, { color: "Starlight", stock: 1 }] },
  { id: 8, name: "iPad 10.ª gen. · 64GB", sku: "APL-IPD10-64-BL", stock: 5, price: "8,999", cost: "7,800", type: "Tablets", category: "Tablets", location: "Case C · Row 3", variants: [{ color: "Blue", stock: 2 }, { color: "Silver", stock: 2 }, { color: "Yellow", stock: 1 }] },
  { id: 9, name: "Google Pixel 8 · 128GB", sku: "GOO-PX8-128-OB", stock: 7, price: "12,999", cost: "11,350", type: "Smartphones", category: "Phones", location: "Case A · Row 3", variants: [{ color: "Obsidian", stock: 3 }, { color: "Hazel", stock: 2 }, { color: "Pink", stock: 2 }] },
  { id: 10, name: "Xiaomi Redmi Note 13 · 256GB", sku: "XIA-RN13-256-BK", stock: 9, price: "4,799", cost: "4,050", type: "Smartphones", category: "Phones", location: "Case A · Row 5", variants: [{ color: "Black", stock: 4 }, { color: "Blue", stock: 3 }, { color: "Gold", stock: 2 }] },
  { id: 11, name: "Motorola Edge 40 · 256GB", sku: "MOT-E40-256-GR", stock: 4, price: "7,999", cost: "6,900", type: "Smartphones", category: "Phones", location: "Case A · Row 6", variants: [{ color: "Black", stock: 2 }, { color: "Green", stock: 2 }] },
  { id: 12, name: "Samsung Galaxy S23 · 128GB", sku: "SAM-S23-128-CR", stock: 6, price: "13,499", cost: "11,900", type: "Smartphones", category: "Phones", location: "Case A · Row 2", variants: [{ color: "Cream", stock: 2 }, { color: "Black", stock: 2 }, { color: "Green", stock: 2 }] },
  { id: 13, name: "Apple Watch SE · 44 mm", sku: "APL-WSE-44-MN", stock: 5, price: "5,499", cost: "4,700", type: "Accessories", category: "Audio", location: "Glass B · Row 2", variants: [{ color: "Midnight", stock: 3 }, { color: "Starlight", stock: 2 }] },
  { id: 14, name: "Samsung Galaxy Tab A9 · 64GB", sku: "SAM-TA9-64-GR", stock: 8, price: "4,299", cost: "3,650", type: "Tablets", category: "Tablets", location: "Case C · Row 4", variants: [{ color: "Gray", stock: 5 }, { color: "Blue", stock: 3 }] },
  { id: 15, name: "Lenovo IdeaPad Slim 3 · 512GB", sku: "LEN-IPS3-512-GR", stock: 3, price: "14,999", cost: "13,250", type: "Laptops", category: "Computers", location: "Case C · Row 2", variants: [{ color: "Gray", stock: 3 }] },
  { id: 16, name: "Power bank Xiaomi · 10,000 mAh", sku: "XIA-PB10-BK", stock: 15, price: "699", cost: "430", type: "Accessories", category: "Chargers", location: "Wall B · Hook 08", variants: [{ color: "Black", stock: 9 }, { color: "White", stock: 6 }] },
  { id: 17, name: "Bocina JBL Go 3", sku: "JBL-GO3-BL", stock: 11, price: "899", cost: "620", type: "Accessories", category: "Audio", location: "Glass B · Row 3", variants: [{ color: "Blue", stock: 4 }, { color: "Red", stock: 4 }, { color: "Black", stock: 3 }] },
  { id: 18, name: "Cristal templado iPhone 15 Pro", sku: "GLS-IP15P-CL", stock: 32, price: "249", cost: "85", type: "Accessories", category: "Cases", location: "Wall A · Hook 10", variants: [{ color: "Clear", stock: 32 }] },
  { id: 19, name: "Cargador inalámbrico Belkin 15W", sku: "BLK-WC15-WH", stock: 6, price: "1,199", cost: "870", type: "Accessories", category: "Chargers", location: "Wall B · Hook 05", variants: [{ color: "White", stock: 4 }, { color: "Black", stock: 2 }] },
  { id: 20, name: "Hub USB-C 7 en 1", sku: "HUB-USBC-7-GR", stock: 10, price: "849", cost: "540", type: "Accessories", category: "Cables", location: "Counter bin 5", variants: [{ color: "Gray", stock: 7 }, { color: "Silver", stock: 3 }] },
];

export const colorLabels: Record<string, string> = {
  "All variants": "Todos los colores",
  Graphite: "Grafito",
  "Sierra Blue": "Azul Sierra",
  Gold: "Dorado",
  Black: "Negro",
  Lime: "Lima",
  Violet: "Violeta",
  White: "Blanco",
  Blue: "Azul",
  Red: "Rojo",
  Purple: "Morado",
  Midnight: "Medianoche",
  Silver: "Plata",
  Starlight: "Blanco estrella",
  Yellow: "Amarillo",
  Obsidian: "Obsidiana",
  Hazel: "Avellana",
  Pink: "Rosa",
  Green: "Verde",
  Cream: "Crema",
  Gray: "Gris",
  Clear: "Transparente",
};

export const typeLabels: Record<string, string> = {
  "All types": "Todos los tipos",
  Smartphones: "Teléfonos",
  Laptops: "Portátiles",
  Tablets: "Tabletas",
  Accessories: "Accesorios",
};

export const categoryLabels: Record<string, string> = {
  Phones: "Teléfonos",
  Chargers: "Cargadores",
  Audio: "Audio",
  Cases: "Fundas",
  Cables: "Cables",
  Computers: "Ordenadores",
  Tablets: "Tabletas",
};

export const productIdentifiers: Record<number, ProductIdentifier> = {
  1: { barcode: "8901420013179", serial: "353909104836421", condition: "Nuevo · Sellado", added: "12 jun 2024" },
  2: { barcode: "8901420014282", serial: "351728691024875", condition: "Nuevo · Sellado", added: "10 jun 2024" },
  3: { barcode: "8901420015395", serial: "ORA20W840219", condition: "Nuevo", added: "08 jun 2024" },
  4: { barcode: "8901420016408", serial: "H2YJ39K2Q6L7", condition: "Nuevo · Sellado", added: "14 jun 2024" },
  5: { barcode: "8901420017511", serial: "CAS14SI9184", condition: "Nuevo", added: "05 jun 2024" },
  6: { barcode: "8901420018624", serial: "CBL2M483021", condition: "Nuevo", added: "07 jun 2024" },
  7: { barcode: "8901420019737", serial: "C02X31M9JHD3", condition: "Nuevo · Sellado", added: "15 jun 2024" },
  8: { barcode: "8901420020840", serial: "359184105728640", condition: "Nuevo · Sellado", added: "16 jun 2024" },
  9: { barcode: "8901420021953", serial: "356918420573164", condition: "Nuevo · Sellado", added: "17 jun 2024" },
  10: { barcode: "8901420022066", serial: "867421059384216", condition: "Nuevo · Sellado", added: "17 jun 2024" },
  11: { barcode: "8901420023179", serial: "359480217635901", condition: "Nuevo · Sellado", added: "18 jun 2024" },
  12: { barcode: "8901420024282", serial: "352706481950327", condition: "Nuevo · Sellado", added: "18 jun 2024" },
  13: { barcode: "8901420025395", serial: "H4K29WSE18MN", condition: "Nuevo · Sellado", added: "18 jun 2024" },
  14: { barcode: "8901420026408", serial: "R9XT40A926GR", condition: "Nuevo · Sellado", added: "19 jun 2024" },
  15: { barcode: "8901420027511", serial: "PF4Z8L3M2Q1R", condition: "Nuevo · Sellado", added: "19 jun 2024" },
  16: { barcode: "8901420028624", serial: "XMPB10K48219", condition: "Nuevo", added: "20 jun 2024" },
  17: { barcode: "8901420029737", serial: "JBLGO3BL29018", condition: "Nuevo", added: "20 jun 2024" },
  18: { barcode: "8901420030840", serial: "GLS15P984201", condition: "Nuevo", added: "20 jun 2024" },
  19: { barcode: "8901420031953", serial: "BLK15W730194", condition: "Nuevo", added: "21 jun 2024" },
  20: { barcode: "8901420032066", serial: "HUB7IN148205", condition: "Nuevo", added: "21 jun 2024" },
};

export const minimumPrices: Record<number, string> = {
  1: "14,999",
  2: "5,999",
  3: "299",
  4: "4,399",
  5: "399",
  6: "279",
  7: "20,999",
  8: "8,499",
  9: "12,299",
  10: "4,399",
  11: "7,499",
  12: "12,799",
  13: "5,099",
  14: "3,999",
  15: "14,299",
  16: "599",
  17: "799",
  18: "199",
  19: "1,099",
  20: "749",
};

export const cashEntries: CashEntry[] = [
  { time: "12:42", title: "iPhone 13 Pro · 256GB", note: "Venta · Tarjeta · KO", amount: "+15,999", kind: "in" },
  { time: "11:18", title: "Stock de Bright Mobile", note: "Compra de mercancía · AD", amount: "−7,850", kind: "out" },
  { time: "10:36", title: "Cargador Oraimo × 2", note: "Venta · Efectivo · KO", amount: "+698", kind: "in" },
  { time: "09:52", title: "Desayuno del equipo", note: "Comida / aperitivos · AD", amount: "−420", kind: "out" },
  { time: "09:14", title: "Galaxy A54 · 128GB", note: "Venta · Transferencia · KO", amount: "+6,499", kind: "in" },
  { time: "08:41", title: "Envío al cliente", note: "Transporte · AD", amount: "−180", kind: "out" },
];

export const loanEntries: LoanEntry[] = [
  { item: "iPhone 12 · 128GB", serial: "35390910483•••", fullSerial: "353909104836421", stall: "B-14", person: "Musa Ade", age: "3 h 18 min", status: "Atrasado", tone: "danger", loanedAt: "Hoy, 09:30", dueAt: "Hoy, 11:30", condition: "Buen estado · 82% batería", agreedPrice: "MXN 7,800", notes: "Equipo entregado con funda transparente." },
  { item: "AirPods Pro · 2.ª gen.", serial: "H2YJ39K2•••", fullSerial: "H2YJ39K2Q6L7", stall: "C-07", person: "Tayo Okun", age: "1 h 05 min", status: "Vence pronto", tone: "warning", loanedAt: "Hoy, 11:43", dueAt: "Hoy, 13:43", condition: "Buen estado · Estuche incluido", agreedPrice: "MXN 3,950", notes: "Préstamo para demostración a cliente." },
  { item: "Samsung A34 · 128GB", serial: "35172869102•••", fullSerial: "351728691024875", stall: "A-22", person: "Chidi N.", age: "24 min", status: "Pendiente", tone: "neutral", loanedAt: "Hoy, 12:24", dueAt: "Hoy, 14:24", condition: "Nuevo · Sin accesorios", agreedPrice: "MXN 4,600", notes: "Devolver antes del cierre del puesto." },
  { item: "Adaptador USB-C 20W", serial: "ORA20W-840•••", fullSerial: "ORA20W840219", stall: "D-03", person: "Amina Bello", age: "12 min", status: "Pendiente", tone: "neutral", loanedAt: "Hoy, 12:36", dueAt: "Hoy, 14:36", condition: "Nuevo", agreedPrice: "MXN 280", notes: "Adaptador prestado para prueba rápida." },
];
