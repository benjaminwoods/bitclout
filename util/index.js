const taiko = require('taiko');

module.exports.goto = (nav, url) => {
  if (nav.status.current_url !== url) {
    p = taiko.goto(url).then(
      () => taiko.currentURL()
    ).then(
      data => {
        nav.status.current_url = data;
      }
    )
  } else {
    p = Promise.resolve();
  }

  return p
}
