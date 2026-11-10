import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load ImeiHub/.env if it exists (Node >= 20.12), the file is never committed
try {
  process.loadEnvFile(path.join(__dirname, '..', '.env'));
} catch {
  // No .env file, fall back to the process environment
}

export const ROLES = {
  OWNER: 'owner',
  SELLER: 'seller'
};

const JWT_SECRET = process.env['JWT_SECRET'] || crypto.randomBytes(48).toString('hex');
const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '2h';
const BCRYPT_ROUNDS = 10;

if (!process.env['JWT_SECRET']) {
  console.warn('[ImeiHub Express API] JWT_SECRET no está definido en .env, se generó uno temporal. Las sesiones se invalidan al reiniciar el servidor.');
}

// Routes that can be called without a token
const PUBLIC_ROUTES = [
  { method: 'GET', path: '/api/health' },
  { method: 'POST', path: '/api/auth/login' },
  { method: 'POST', path: '/api/auth/register' }
];

export function hashPassword(plain) {
  return bcrypt.hashSync(plain, BCRYPT_ROUNDS);
}

export function isHashed(value) {
  return typeof value === 'string' && /^\$2[aby]\$/.test(value);
}

export function verifyPassword(plain, hash) {
  if (!isHashed(hash)) return false;
  return bcrypt.compareSync(plain, hash);
}

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Data of a seller belongs to the store of its owner
export function tenantId(user) {
  return user.ownerId || user.id;
}

export function toSafeUser(user) {
  const { password: _, ...safe } = user;
  return safe;
}

function unauthorized(res, code, message) {
  return res.status(401).json({
    statusCode: 401,
    error: 'Unauthorized',
    code,
    message
  });
}

// Validates the Bearer token on every private route and attaches req.user
export function authenticate(req, res, next) {
  if (req.method === 'OPTIONS') return next();

  const isPublic = PUBLIC_ROUTES.some(route => route.method === req.method && route.path === req.path);
  if (isPublic || !req.path.startsWith('/api/')) return next();

  const header = req.headers['authorization'] || '';
  if (!header.startsWith('Bearer ')) {
    return unauthorized(res, 'TOKEN_MISSING', 'Debes iniciar sesión para continuar');
  }

  let payload;
  try {
    payload = jwt.verify(header.substring(7), JWT_SECRET);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return unauthorized(res, 'TOKEN_EXPIRED', 'Tu sesión expiró, inicia sesión de nuevo');
    }
    return unauthorized(res, 'TOKEN_INVALID', 'Tu sesión no es válida, inicia sesión de nuevo');
  }

  const user = req.db.users?.find(u => u.id === payload.sub);
  if (!user) {
    return unauthorized(res, 'TOKEN_INVALID', 'La cuenta de esta sesión ya no existe');
  }

  req.user = user;
  next();
}

// Restricts a route to the given roles, answers 403 otherwise
export function requireRole(...roles) {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) return next();
    return res.status(403).json({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Tu rol no tiene permiso para realizar esta acción. Pide ayuda al propietario de la tienda.'
    });
  };
}
