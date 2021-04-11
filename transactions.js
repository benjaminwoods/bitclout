const taiko = require('taiko');

const { promiseLoggedIn, promiseBrowserOpen } = require('./util/promise');
const { goto } = require('./util');

/**
 * Send BitClout to a user.
 *
 * @method
 * @async
 * @param {string} username - Username to send to.
 * @param {number} amount - Amount of Bitclout to send.
 */
const sendBitClout = async function (parent, username, amount) {
  // Check browser state
  await promiseLoggedIn(
    promiseBrowserOpen(
      Promise.resolve(parent)
    )
  );

  // Check username
  if (typeof username === 'undefined') {
    throw 'No username given.';
  }

  // Check amount
  if (typeof amount === 'undefined') {
    throw 'No amount given.';
  }

  // Go to send BitClout
  await goto(parent, 'https://bitclout.com/send-bitclout');

  // Set username
  await taiko.focus(
    taiko.$('input[placeholder="Enter a public key or username."]')
  );
  await taiko.clear();
  await taiko.write(username);

  // Set amount
  await taiko.focus(
    taiko.$('input[placeholder="0"]')
  );
  await taiko.clear();
  await taiko.write(amount);
  await taiko.click(taiko.button('Send BitClout'));
  await taiko.click(taiko.button('OK'));

  let success = await taiko.text('Success!').exists();
  if (!success) {
    // Failed.
    let element = taiko.$('.swal2-content');
    if (await element.exists()) {
      err = await element.text()
    } else {
      err = 'Failed to sendBitClout.'
    }
    throw err;
  }
};

/**
 * Buy creator coins.
 *
 * @method
 * @async
 * @param {string} username - Username corresponding to the coin.
 * @param {number} amount - Amount of Bitclout to use for the purchase.
 */
const buy = async function (parent, username, amount) {
  // Check browser state
  await promiseLoggedIn(
    promiseBrowserOpen(
      Promise.resolve(parent)
    )
  );

  // Check username
  if (typeof username === 'undefined') {
    throw 'No username given.';
  }

  // Check amount
  if (typeof amount === 'undefined') {
    throw 'No amount given.';
  }

  // Go to buy
  await goto(parent, `https://bitclout.com/u/${username}/buy`);

  // Set amount
  await taiko.focus(
    taiko.$('select')
  );
  await taiko.press('ArrowUp');
  await taiko.focus(taiko.textBox(taiko.below('Amount')));
  await taiko.clear();
  await taiko.write(amount);

  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 2000))

  buttonDisabled = await taiko.$('a.btn.disabled').exists()
  if (buttonDisabled) {
    throw 'Insufficient balance.'
  } else {
    await taiko.click(taiko.link('Review'));
    await taiko.click(taiko.button('Confirm Buy'));
    let success = await taiko.text('Success!').exists();

    if (!success) {
      // Failed.
      let element = taiko.$('.swal2-content');
      if (await element.exists()) {
        err = await element.text()
      } else {
        err = 'Failed to buy.'
      }
      throw err;
    }
  }
}

/**
 * Sell creator coins.
 *
 * @method
 * @async
 * @param {string} username - Username corresponding to the coin.
 * @param {number} amount - Amount of creator coin to sell.
 */
const sell = async function (parent, username, amount) {
  // Check browser state
  await promiseLoggedIn(
    promiseBrowserOpen(
      Promise.resolve(parent)
    )
  );

  // Check username
  if (typeof username === 'undefined') {
    throw 'No username given.';
  }

  // Check amount
  if (typeof amount === 'undefined') {
    throw 'No amount given.';
  } else if (amount <= 0.0001) {
    throw 'Amount must be greater than 0.0001 (to cover fees).';
  }

  // Go to sell
  await goto(parent, `https://bitclout.com/u/${username}/sell`);

  // If selling own coin, skip the warning
  sellingOwnCoin = await taiko.$('button.swal2-deny').exists()
  if (sellingOwnCoin) {
    await taiko.click(taiko.button('Proceed'))
  }

  // Set amount
  await taiko.focus(taiko.textBox(taiko.below('Amount')));
  await taiko.clear();
  await taiko.write(amount);

  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 2000))

  buttonDisabled = await taiko.$('a.btn.disabled').exists()
  if (buttonDisabled) {
    throw 'Insufficient balance.'
  } else {
    await taiko.click(taiko.link('Review'));
    await taiko.click(taiko.button('Confirm Sell'));

    let success = await taiko.text('Success!').exists();
    if (!success) {
      // Failed.
      let element = taiko.$('.swal2-content');
      if (await element.exists()) {
        err = await element.text()
      } else {
        err = 'Failed to sell.'
      }
      throw err;
    }
  }
}

module.exports = {
  sendBitClout: sendBitClout,
  buy: buy,
  sell: sell
};
