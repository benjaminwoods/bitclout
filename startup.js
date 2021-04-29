const taiko = require('taiko');

/**
 * Open a browser window.
 *
 * Uses Taiko (Chromium). You can have a maximum of 1 window open.
 *
 * If successful, CloudNav.prototype.status.browser is set to true.
 *
 * @method
 * @async
 */
const open = async function (parent) {
  if (parent.status.browser === false) {
    await taiko.openBrowser({
      headless: false,
      args:['--window-size=600,900']
    });

    taiko.setConfig({
      observeTime: 500,
      observe: true
    })

    parent.status.browser = true;
  } else {
    throw 'Browser already open.';
  }
}

/**
 * Close a browser window.
 *
 * Uses Taiko (Chromium).
 *
 * If successful, CloudNav.prototype.status.browser is set to false.
 *
 * @method
 * @async
 */
const close = async function (parent) {
  await taiko.closeBrowser();
  parent.status.browser = false;
};

module.exports = {
  open: open,
  close: close
};
