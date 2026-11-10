const bcrypt = require('bcryptjs');

async function hashPassword(plano) {
  return bcrypt.hash(plano, 12);
}

async function verifyPassword(plano, hash) {
  return bcrypt.compare(plano, hash);
}

module.exports = { hashPassword, verifyPassword };
