if (typeof process !== 'undefined' && !process.browser && process.platform !== 'browser' && parseInt(process.versions.node.split('.')[0]) < 18) {
  console.error('Your node version is currently', process.versions.node)
  console.error('Please update it to a version >= 22.x.x from https://nodejs.org/')
  process.exit(1)
}

const { registerHooks, stripTypeScriptTypes } = require('node:module');

const tsRegex = /^file:.*(?<!\.d)\.m?ts$/;

// Intercept .ts / .mts files (skipping .d.ts files) and
// transpile to JS, returning ES module
registerHooks({
  load(url, context, nextLoad) {
    if (tsRegex.test(url)) {
      return {
        format: 'module',
        source: stripTypeScriptTypes(
          /** @type {import('node:module').ModuleSource} */ (
            // eslint-disable-next-line @typescript-eslint/no-base-to-string -- ModuleSource returns useful information from .toString()
            nextLoad(url).source
          ).toString(),
          {
            mode: 'transform',
            sourceUrl: url,
          },
        ),
      };
    }

    return nextLoad(url, context);
  },
});


module.exports = require('./lib/loader.js')
