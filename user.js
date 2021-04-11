const taiko = require('taiko');

const { promiseLoggedIn, promiseBrowserOpen } = require('./util/promise');
const { goto } = require('./util');

/**
 * @typedef {Object} Profile
 * @property {string} username - Username.
 * @property {string} text - Headline text field on profile.
 * @property {number} numFollowers - Number of followers.
 * @property {number} price - Coin price, in USD.
 * @property {string} publicKey - User public key.
 */

/**
 * Follow/unfollow a user.
 *
 * @method
 * @async
 * @param {string} username - Username to follow/unfollow.
 * @returns {boolean} After running this function, true if following, false if not.
 */
const follow = async function (parent, username) {
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

  // Go to user profile
  await goto(parent, `https://bitclout.com/u/${username}`);

  // Check if this is the logged in user
  logged_in_user = await taiko.text('Update profile').exists()
  if (logged_in_user) {
    throw 'Cannot follow logged in user (self).'
  }

  // Attempt to follow/unfollow
  await taiko.click('Follow', taiko.toLeftOf('Buy'), taiko.toRightOf(username));

  let errorPrompt = await taiko.$('.swal2-x-mark').exists();
  if (errorPrompt) {
    // Failed.
    err = await taiko.$('.swal2-content').text();
    throw err;
  }

  // Check current state
  following = await taiko.text(
    'Unfollow', taiko.toLeftOf('Buy'), taiko.toRightOf('diamondhands')
  ).exists()

  return following
};

/**
 * Extract metadata from profile.
 *
 * @method
 * @async
 * @param {string} username - Username to extract metadata from.
 * @returns {Profile}
 *          Profile object.
 */
const profile = async function (parent, username) {
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

  // Go to user profile
  await goto(parent, `https://bitclout.com/u/${username}`);

  let result = {
    username: username
  }

  // Get profile info from DOM
  let elements = await taiko.$(
    'creator-profile-top-card div div div'
  ).elements();
  let bottomLineProfile;
  let numFollowers;
  let followersText;
  // Find bottomLineProfile
  let index;
  for (let i of elements.keys()) {
    let text = await elements[i].text();
    if (text == `@${username}`) {
      text = await elements[i+1].text();
      if (text == '') {
        index = i+2
      } else {
        index = i+1
      }
      break
    }
  }

  // Profile text
  result.text = await elements[index].text();
  while (true) {
    bottomLineProfile = await elements[index+1].text();
    bottomLineProfile = bottomLineProfile.split('\n')
    if (bottomLineProfile.length != 3) {
      // Number of followers hasn't loaded yet
      await new Promise(resolve => setTimeout(resolve, 100))
      elements = await taiko.$(
        'creator-profile-top-card div div div'
      ).elements();
    } else {
      break
    }
  }

  result.numFollowers = parseFloat(bottomLineProfile[0].split('Followers')[0])
  result.price = parseFloat(
    bottomLineProfile[1].slice(
      // Convert '~$1,200.00 Coin Price ' to '1,200.00 Coin Price '
      2
    ).split(
      // Convert '1,200.00 Coin Price ' to '1,200.00'
      'Coin Price'
    )[0].replace(
      // Convert '1,200.00' to '1200.00'
      ',',''
    ))
  result.publicKey = bottomLineProfile[2].slice(1)

  return result
}

module.exports = {
  follow: follow,
  profile: profile
};
