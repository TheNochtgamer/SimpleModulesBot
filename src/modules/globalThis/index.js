const cache = require('../../utils/cacheMe');
const manager = require('../../moduleManager');

module.exports = {
  name: 'globalThis',
  start: client => {
    globalThis.client = client;
    globalThis.modules = cache.modules;
    globalThis.manager = manager;
  },
};
