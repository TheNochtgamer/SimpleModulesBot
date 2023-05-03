const cache = require('../../utils/globalcache');
const manager = require('../../moduleManager');

module.exports = {
  name: 'globalThis',
  start: client => {
    globalThis._ = Object.create(null);
    globalThis._.client = client;
    globalThis._.cache = cache;
    globalThis._.modules = cache.modules;
    globalThis._.manager = manager;
  },
};
