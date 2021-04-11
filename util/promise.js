const promiseMe = (p, func) => {
  return p.then(
    async (nav) => {
      func(nav);
      return nav
    }
  )
}
module.exports.promiseMe = promiseMe

module.exports.promiseLoggedIn = p => {
  return promiseMe(p, (nav) => {
    if (nav.status.logged_in === false) {
      throw 'Not logged in.';
    }
  })
}

module.exports.promiseBrowserOpen = p => {
  return promiseMe(p, (nav) => {
    if (nav.browser === false) {
      throw 'No browser open.';
    }
  })
}
