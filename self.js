const taiko = require('taiko');

const { promiseLoggedIn, promiseBrowserOpen } = require('./util/promise');
const { goto } = require('./util');

/**
 * Check BitClout balance of logged in user.
 *
 * @method
 * @async
 * @returns {Number} Amount of BitClout.
 */
const balance = async function (parent) {
  // Check browser state
  await promiseLoggedIn(
    promiseBrowserOpen(
      Promise.resolve(parent)
    )
  );

  // Go to wallet
  await goto(parent, 'https://bitclout.com/wallet');

  // Resolve with balance
  amount = await taiko.$(
    'div.global__mobile-scrollable-section div div div div'
  ).text();

  return parseFloat(amount)
}

/**
 * Check creator coin portfolio of logged in user.
 *
 * @method
 * @async
 * @returns {Object}
 *          The portfolio. Keys are usernames (each as a string), values are
 *          holdings (number of creator coin, as a float). The values are
 *          only accurate to 4 decimal places (0.0001 BTCLT).
 */
const portfolio = async function (parent) {
  // Check browser state
  await promiseLoggedIn(
    promiseBrowserOpen(
      Promise.resolve(parent)
    )
  );

  // Go to wallet
  await goto(parent, 'https://bitclout.com/wallet');

  let holdings = {};

  let nameElements = await taiko.$('div.holdings__name span').elements();
  for (let element of nameElements) {
    let name = await element.text();
    if (name !== '') {
      holdings[name] = {};
    }
  }
  let names = Object.keys(holdings);

  let amountElements = await taiko.$(
    'div.holdings__creator-coin-total div.text-right'
  ).elements();
  for (let i in names) {
    let amount = await amountElements[i].text();
    holdings[names[i]] = {amount: parseFloat(amount)};
  }

  return holdings
}

/**
 * Check Bitcoin address of logged in user.
 *
 * @method
 * @async
 * @returns {string} Bitcoin address.
 */
const bitcoinAddress = async function (parent) {
  // Check browser state
  await promiseLoggedIn(
    promiseBrowserOpen(
      Promise.resolve(parent)
    )
  );

  // Go to wallet
  await goto(parent, 'https://bitclout.com/buy-bitclout');

  let addr = await taiko.textBox(taiko.toLeftOf('Copy')).value();
  return addr
}

module.exports = {
  balance: balance,
  portfolio: portfolio,
  bitcoinAddress: bitcoinAddress
}
