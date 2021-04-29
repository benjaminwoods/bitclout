const taiko = require('taiko');

const { promiseLoggedIn, promiseBrowserOpen } = require('./util/promise');
const { goto } = require('./util');

/**
 * Get current BitClout price, in USD.
 *
 * @method
 * @async
 * @returns {string} Price in USD.
 */
const bitcloutPrice = async function (parent) {
  // Check browser state
  await promiseLoggedIn(
    promiseBrowserOpen(
      Promise.resolve(parent)
    )
  );

  // Go to home page
  await goto(parent, `https://bitclout.com/browse`);

  let price = await taiko.text('~$').text();
  price = price.split(' USD')[0].slice(2);

  return parseFloat(price);
}

module.exports = {
  bitcloutPrice: bitcloutPrice
}
