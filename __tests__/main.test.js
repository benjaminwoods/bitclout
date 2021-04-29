const { CloutNav } = require('../main');

describe('CloutNav', () => {
  test('CloutNav constructor', () => {
    let nav = new CloutNav;
    expect(nav.options).toStrictEqual({
      nice: {
        on: true,
        fee: 0.0001,
        every: 10
      }
    })
  
    expect(nav.status).toStrictEqual({
      logged_in: false,
      current_url: null,
      browser: false
    })
  })

  test('CloutNav methods', () => {
    let modules = [
      'auth', 'interact', 'global', 'startup', 'user', 'self', 'transactions'
    ]
    let method_names = Object.keys(CloutNav.prototype);
    for (let module_name of modules) {
      let mod = require(`../${module_name}`);
      for (let func_name of Object.keys(mod)) {
        // Contains method
        expect(method_names).toContain(func_name);
        expect(CloutNav.prototype[func_name]).toBeInstanceOf(Function);
      }
    }
  })
})
