const { promiseMe }= require('../../util/promise');
const { CloutNav } = require('../../main');

let nav;

beforeAll(async() => {
  nav = new CloutNav({headless:true});
});


describe('promiseMe', () => {
  afterEach(() => {
    delete nav.test
  });

  test('Empty function', async() => {
    let result = await promiseMe(
      Promise.resolve(nav),
      () => {}
    );
    expect(result).toBe(nav);
  });

  test('Simple function', async() => {
    let result = await promiseMe(
      Promise.resolve(nav),
      nav => nav.options
    );
    expect(result).toBe(nav);
  });

  test('Set nav in function', async() => {
    let result = await promiseMe(
      Promise.resolve(nav),
      nav => {
        nav.test = true;
      }
    );
    expect(result).toBe(nav);
    expect(nav?.test).toBe(true);
  });
});
