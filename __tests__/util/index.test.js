const taiko = require('taiko');

const { goto } = require('../../util/index');
const { CloutNav } = require('../../main');

let nav;

beforeAll(async() => {
  nav = new CloutNav({headless:true});
  await nav.open();
});

afterAll(async() => {
  await nav.close();
});

describe('goto', () => {
  beforeEach(() => {
    nav.status.current_url = null;
  });

  test('current_url !== url; reload !== true', async() => {
    nav.status.current_url = null;
    let url = 'http://date.jsontest.com/';
    await goto(nav, url);

    let taiko_url = await taiko.currentURL();
    expect(url).toEqual(taiko_url);
    expect(nav.status.current_url).toEqual(taiko_url);
  })

  test('current_url === url; reload !== true', async() => {
    nav.status.current_url = null;
    let url = 'http://date.jsontest.com/';
    await goto(nav, url);

    // Get JSON
    let j1 = await taiko.text('date').text();
    j1 = JSON.parse(j1);
    await goto(nav, url);

    // Get JSON again
    let j2 = await taiko.text('date').text();
    j2 = JSON.parse(j2);

    expect(nav.status.current_url).toEqual(url);
    expect(j1).toEqual(j2);
  });

  test('current_url !== url; reload === true', async() => {
    nav.options.reload = true;
    let url = 'http://date.jsontest.com/';
    await goto(nav, url);

    // Get JSON
    let j1 = await taiko.text('date').text();
    j1 = JSON.parse(j1);

    await goto(nav, url);

    // Get JSON again
    let j2 = await taiko.text('date').text();
    j2 = JSON.parse(j2);

    expect(nav.status.current_url).toEqual(url);
    expect(j1).toEqual(j2);
  });
});
