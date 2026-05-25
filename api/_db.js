// Shared database helper — used by all API routes
const { neon } = require('@neondatabase/serverless');

function getDb() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL env var not set');
  return neon(process.env.DATABASE_URL);
}

// CORS headers — allow calls from the same Vercel domain
function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

// JWT helper
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'salespulse-secret-change-me';

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

function verifyToken(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return null;
  try { return jwt.verify(token, SECRET); }
  catch { return null; }
}

module.exports = { getDb, cors, signToken, verifyToken };
