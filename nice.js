const { promiseLoggedIn, promiseBrowserOpen } = require('./util/promise');
const { goto } = require('./util');
const { sendBitClout } = require('./transactions');

const AUTHOR_PUBLIC_KEY = (
  'BC1YLhnr23db6y58uw56t7S8MSPdqNs4rpqGgqJ4rSDqvRuwraECkxj'
);

/**
 * Send a little bit of BitClout to the author (if you're feeling nice) :)
 *
 * The nice settings are set on CloudNav.prototype.options.nice.
 *
 * @method
 * @async
 */
module.exports = async function (parent) {
  // Check browser state
  await promiseLoggedIn(
    promiseBrowserOpen(
      Promise.resolve(parent)
    )
  );

  current_url = parent.status.current_url;
  try {
    await sendBitClout(parent,
      public_key=AUTHOR_PUBLIC_KEY,
      amount=parent.options.nice.fee
    )
  } finally {
    await goto(parent, current_url);
  }
}
