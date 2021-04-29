const taiko = require('taiko');

const { promiseLoggedIn, promiseBrowserOpen } = require('./util/promise');
const { goto } = require('./util');

/**
 * Post as the logged in user.
 *
 * @method
 * @async
 * @param {string} text - Text content for the post.
 */
const post = async function (parent, text) {
  // Check browser state
  await promiseLoggedIn(
    promiseBrowserOpen(
      Promise.resolve(parent)
    )
  );

  // Go to new post page
  await goto(parent, 'https://bitclout.com/posts/new')

  // Write text
  let element = taiko.$('textarea');
  await taiko.focus(element);
  await taiko.clear();
  await taiko.write(text);

  // Submit
  await taiko.click(taiko.button('Post'));
}

/**
 * Like/unlike a post.
 *
 * @method
 * @async
 * @param {string} postID - ID for the post.
 */
const like = async function (parent, postID) {
  // Check browser state
  await promiseLoggedIn(
    promiseBrowserOpen(
      Promise.resolve(parent)
    )
  );

  // Go to the post
  await goto(parent, `https://bitclout.com/posts/${postID}`);

  // Click
  await taiko.click(taiko.$('i.icon-heart'));
}

/**
 * Reclout a post.
 *
 * @method
 * @async
 * @param {string} postID - ID for the post.
 */
const reclout = async function (parent, postID) {
  // Check browser state
  await promiseLoggedIn(
    promiseBrowserOpen(
      Promise.resolve(parent)
    )
  );

  // Go to the post
  await goto(parent, `https://bitclout.com/posts/${postID}`);

  // Click reclout button
  await taiko.click(taiko.$('i.icon-repost'));

  // Get links from dropdown menu
  let elements = await taiko.$(
    '.js-feed-post-icon-row__container .dropdown-menu a'
  ).elements();

  // Vanilla reclout
  await taiko.click(elements[0]);
}

/**
 * Comment on a post.
 *
 * @method
 * @async
 * @param {string} postID - ID for the post.
 * @param {string} text - Text for the comment.
 */
const comment = async function (parent, postID, text) {
  // Check browser state
  await promiseLoggedIn(
    promiseBrowserOpen(
      Promise.resolve(parent)
    )
  );

  // Go to the post
  await goto(parent, `https://bitclout.com/posts/${postID}`);

  // Click comment button
  await taiko.click(taiko.$('i.icon-reply'));
  let textbox = await taiko.$('textarea[placeholder="Post your reply"]');

  // Write comment
  await taiko.focus(textbox);
  await taiko.clear()
  await taiko.write(text);

  // Submit
  await taiko.click(taiko.link('Post'));
}

module.exports = {
  like: like,
  comment: comment,
  reclout: reclout,
  post: post
}
