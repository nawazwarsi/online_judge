// Suppress specific deprecation warnings
const originalEmit = process.emit;
process.emit = function (type, ...args) {
  if (type === 'warning' && args[0]?.name === 'DeprecationWarning' && args[0]?.message.includes('punycode')) {
    return false;
  }
  return originalEmit.apply(this, arguments);
}; 