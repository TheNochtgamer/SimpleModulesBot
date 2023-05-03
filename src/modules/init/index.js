const cache = require('../../utils/globalcache');
const { start } = require('../../moduleManager');

module.exports = {
  name: 'init',
  handlers: [
    {
      name: 'ready',
      run: client => {
        console.log('Bot online como', client.user.tag);
        cache.modules
          .filter(m => !m.off && m.startAfterLogin)
          .forEach(async m => {
            try {
              await start(m.name);
            } catch (error) {
              console.log(error);
            }
          });
      },
    },
  ],
};
