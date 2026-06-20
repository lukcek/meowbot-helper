require('dotenv').config();

function getAdminIds() {
  return (process.env.BOT_ADMIN_IDS || '')
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);
}

function isAdminUser(userId) {
  return getAdminIds().includes(userId);
}

function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  const pick = (length) =>
    Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

  return `${pick(3)}-${pick(4)}-${pick(4)}`;
}

module.exports = {
  isAdminUser,
  generateInviteCode,
};