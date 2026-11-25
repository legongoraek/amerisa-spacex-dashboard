import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { fetchSpaceXLaunches, getLaunchpadInfo, normalizeLaunchFromApi } from '../src/services/spacexService.js';

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

const apiLaunch = (overrides = {}) => ({
  id: 'l1',
  name: 'Starlink 1',
  date_utc: '2026-01-01T00:00:00.000Z',
  success: true,
  details: 'Misión de prueba',
  launchpad: '5e9e4501f5090910d4566f83',
  links: { flickr: { original: ['https://img/1.jpg', 'https://img/2.jpg'] }, patch: { large: 'https://img/patch.png' } },
  ...overrides,
});

test('known launchpads resolve to name and coordinates', () => {
  assert.deepEqual(getLaunchpadInfo('5e9e4502f509092b78566f87'), {
    name: 'Vandenberg SFB SLC-4E',
    latitude: 34.632093,
    longitude: -120.610829,
  });
});

test('unknown launchpads fall back instead of breaking the map', () => {
  assert.deepEqual(getLaunchpadInfo('nope'), { name: 'Ubicación no disponible', latitude: 0, longitude: 0 });
});

test('normalizes an API launch into the dashboard shape', () => {
  assert.deepEqual(normalizeLaunchFromApi(apiLaunch()), {
    id: 'l1',
    name: 'Starlink 1',
    date_utc: '2026-01-01T00:00:00.000Z',
    success: true,
    rocket_name: 'SpaceX Rocket',
    launchpad_name: 'Kennedy Space Center LC-39A',
    launchpad_location: { latitude: 28.608389, longitude: -80.604333 },
    details: 'Misión de prueba',
    images: ['https://img/1.jpg', 'https://img/2.jpg'],
  });
});

test('images fall back to the mission patch, then to none', () => {
  const patchOnly = normalizeLaunchFromApi(apiLaunch({ links: { flickr: { original: [] }, patch: { large: 'p.png' } } }));
  assert.deepEqual(patchOnly.images, ['p.png']);
  assert.deepEqual(normalizeLaunchFromApi(apiLaunch({ links: undefined })).images, []);
});

test('null success and missing details get safe defaults', () => {
  const launch = normalizeLaunchFromApi(apiLaunch({ success: null, details: null }));
  assert.equal(launch.success, false);
  assert.equal(launch.details, 'Sin detalles disponibles.');
});

test('fetchSpaceXLaunches queries the latest 20 launches and normalizes them', async () => {
  let request;
  globalThis.fetch = async (url, init) => {
    request = { url, init };
    return new Response(JSON.stringify({ docs: [apiLaunch()] }), { status: 200 });
  };
  const launches = await fetchSpaceXLaunches();
  assert.equal(request.url, '/spacex-api/v4/launches/query');
  assert.equal(request.init.method, 'POST');
  const body = JSON.parse(request.init.body);
  assert.equal(body.options.limit, 20);
  assert.deepEqual(body.options.sort, { date_utc: 'desc' });
  assert.equal(launches.length, 1);
  assert.equal(launches[0].launchpad_name, 'Kennedy Space Center LC-39A');
});

test('fetchSpaceXLaunches surfaces API errors with a readable message', async () => {
  globalThis.fetch = async () => new Response('down', { status: 503 });
  await assert.rejects(fetchSpaceXLaunches(), /No se pudo obtener información desde la API de SpaceX/);
});
