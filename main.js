/**
 * Class for browser-based navigation.
 *
 * Use methods to perform simple operations on the BitClout website.
 * @class
 */
class CloutNav {
  constructor(options) {
    this.options = {
      nice: {
        on: true,
        fee: 0.0001,
        every: 10
      }
    };

    if (typeof options !== 'undefined') {
      Object.assign(this.options, options);
    }

    this.status = {
      logged_in: false,
      current_url: null,
      browser: false
    };
  }
}

{
  // Attach modules
  let modules = ['auth', 'startup', 'user', 'self', 'transactions'];

  // Nice tracking
  let nice = require(`./nice`);
  let niceCounter = 0;

  for (let module_name of modules) {
    let module = require(`./${module_name}`);
    for (let func of Object.values(module)) {
      CloutNav.prototype[func.name] = async function (...args) {
        // Run function
        let result = await func(this, ...args);

        if (this.options.nice.on) {
          // Try to be nice
          if (!['open', 'close', 'login', 'logout'].includes(func.name)) {
            niceCounter += 1;
            if (niceCounter == this.options.nice.every) {
              try {
                await nice(this);
              } catch (err) {
                console.warn('Nice failed.');
              }
              niceCounter = 0;
            }
          }
        }

        return result
      };
    }
  }
}

module.exports = {
  CloutNav: CloutNav
};
