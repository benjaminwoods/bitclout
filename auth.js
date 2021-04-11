const taiko = require('taiko');

const { promiseBrowserOpen } = require('./util/promise');
const { goto } = require('./util');

const { open, close } = require('./startup');

/**
 * Login to the BitClout website.
 *
 * @method
 * @async
 * @param {string} phrase - Seed phrase.
 */
const login = async function (parent, phrase) {
  // Check browser state
  await promiseBrowserOpen(
    Promise.resolve(parent)
  );

  // Set secret phrase
  let secret_phrase = parent.options.phrase;
  if (typeof phrase !== 'undefined') {
    secret_phrase = phrase;
  }

  // Login
  await goto(parent, "https://bitclout.com/log-in");
  await taiko.focus(taiko.$('textarea.form-control'));
  await taiko.clear();
  await taiko.write(secret_phrase);
  await taiko.click(taiko.button('Load Account'));

  // Set new URL
  parent.status.current_url = await taiko.currentURL();
  parent.status.logged_in = true;
}

/**
 * Logout of the BitClout website.
 *
 * @method
 * @async
 */
const logout = async function (parent) {
  // Check browser state
  await promiseBrowserOpen(
    Promise.resolve(parent)
  );

  // Restart browser
  await close(parent);
  await open(parent);

  // Login
  await goto(parent, "https://bitclout.com");

  // Set new URL
  parent.status.current_url = await taiko.currentURL();
  parent.status.logged_in = true;
};

module.exports = {
  login: login,
  logout: logout
};
