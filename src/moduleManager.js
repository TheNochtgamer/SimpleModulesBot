const fs = require('fs');
const path = require('path');
const cache = require('./utils/globalcache');
const build = require('./utils/cacheFactory');

cache.set('modules', [], 0);

async function start(moduleName) {
  const module = cache.modules.find(m => m.name === moduleName);

  if (!module) throw new Error(`No se encontro el modulo ${moduleName}`);

  if (
    module.handlers &&
    typeof module.handlers === 'object' &&
    module.handlers.length
  ) {
    module.handlers.forEach(h => {
      if (!h.name || !h.run) return;
      cache.client.on(h.name, h.run);
    });
  }

  if (module.start) {
    const CACHE_MODULE = build(60 * 1000);
    try {
      await module.start(cache.client, CACHE_MODULE);
    } catch (error) {
      console.log(error);
    }
  }
}

async function stop(moduleName) {
  const module = cache.modules.find(m => m.name === moduleName);

  if (!module) throw new Error(`No se encontro el modulo ${moduleName}`);

  if (
    module.handlers &&
    typeof module.handlers === 'object' &&
    module.handlers.length
  ) {
    module.handlers.forEach(h => {
      if (!h.name || !h.run) return;
      cache.client.removeListener(h.name, h.run);
    });
  }

  if (module.stop) {
    try {
      await module.stop();
    } catch (error) {
      console.log(error);
    }
  }
}

async function load() {
  const files = fs.readdirSync(path.join(__dirname, 'modules'));
  let loaded = 0;

  for (let index = 0; index < files.length; index++) {
    const f = files[index];
    let module = null;
    try {
      if (fs.existsSync(path.join(__dirname, 'modules', f, 'index.js'))) {
        module = require(path.join(__dirname, 'modules', f, 'index.js'));
      } else if (
        fs.existsSync(
          path.join(__dirname, 'modules', f, `${f.split('.')[0]}.js`),
        )
      ) {
        module = require(path.join(
          __dirname,
          'modules',
          f,
          `${f.split('.')[0]}.js`,
        ));
      } else {
        module = require(path.join(__dirname, 'modules', f, `${f}.js`));
      }

      if (!module.name || typeof module.name !== 'string')
        throw new Error(`Nombre del modulo invalido`);
      if (cache.modules.some(m => m.name === module.name))
        throw new Error(`Ya existe el modulo ${module.name}`);
      if (!module.start && !module.handlers) {
        throw new Error(
          'Modulo invalido, ausenta de un metodo start o handler',
        );
      }

      cache.modules.push(module);
      loaded += 1;

      if (module.off || module.startAfterLogin) continue;

      await start(module.name);
    } catch (error) {
      console.log(__dirname, error);
    }
  }
  console.log(`Se cargaron '${loaded}' modulos de '${files.length}'`);
}

module.exports.load = load;
module.exports.start = start;
module.exports.stop = stop;
