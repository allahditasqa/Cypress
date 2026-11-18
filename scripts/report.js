// Turns the mochawesome JSON files of a Cypress run into the module-wise reports (the same files the Playwright and
// restful_booker repositories produce, written by scripts/lib/report-writer.js):
//   reports/index.html and reports/history.json                                  all runs, newest on top
//   reports/<module-slug>/<Module Name> test <DD-MM-YYYY>_<HH-mm-ss>.html        one self-contained HTML report per module
//   reports/<module-slug>/<Module Name> test cases <DD-MM-YYYY>_<HH-mm-ss>.csv   the cases of the module + the real result
// The module of a test comes from its test case document (docs/test-cases), found through the TC_ ID in the test title.
// An old report is never overwritten: the date and time are part of the file name.
// Failure screenshots (cypress/screenshots) are embedded in the HTML report, so the report stays one self-contained file.
const fs = require('fs');
const path = require('path');
const { merge } = require('mochawesome-merge');
const { writeRun } = require('./lib/report-writer');

const root = path.resolve(__dirname, '..');
const jsonDir = path.join(root, 'mochawesome-report');
const shotsDir = path.join(root, 'cypress', 'screenshots');
const API_URL = process.env.API_URL ?? 'https://jsonplaceholder.typicode.com';
const BASE_URL = process.env.BASE_URL ?? 'https://www.saucedemo.com';

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? listFiles(p) : [p];
  });
}

function collect(suite, out) {
  for (const t of suite.tests ?? []) out.push({ ...t, suite: suite.title });
  for (const s of suite.suites ?? []) collect(s, out);
}

(async () => {
  const hasJson = fs.existsSync(jsonDir) && fs.readdirSync(jsonDir).some((f) => f.endsWith('.json') && f !== 'merged.json');
  if (!hasJson) {
    console.log('No report was built: no mochawesome JSON found (run the tests first: npm test).');
    return;
  }
  const merged = await merge({ files: [path.join(jsonDir, '*.json').replace(/\\/g, '/')] });
  fs.writeFileSync(path.join(jsonDir, 'merged.json'), JSON.stringify(merged));

  const screenshots = listFiles(shotsDir).filter((f) => f.endsWith('.png'));
  const tests = [];
  for (const r of merged.results) collect(r, tests);

  const results = [];
  for (const t of tests) {
    const id = t.title.match(/TC_[A-Z0-9_.]+/)?.[0];
    if (!id) continue;
    const status = t.state === 'passed' ? 'passed' : t.pending || t.skipped || t.state === 'pending' ? 'skipped' : 'failed';
    const shots = screenshots
      .filter((f) => path.basename(f).includes(id))
      .map((f) => ({ name: path.basename(f, '.png'), src: `data:image/png;base64,${fs.readFileSync(f).toString('base64')}` }));
    results.push({
      id,
      title: t.title,
      suite: t.suite,
      status,
      duration: t.duration ?? 0,
      error: t.err?.message ? `${t.err.message}${t.err.estack ? `\n${t.err.estack.split('\n').slice(0, 4).join('\n')}` : ''}` : '',
      shots,
    });
  }
  if (!results.length) {
    console.log('No test case with a TC_ ID found in the mochawesome JSON.');
    return;
  }

  const { files, index } = writeRun({
    reportsDir: path.join(root, 'reports'),
    startedAt: new Date(merged.stats?.start ?? Date.now()),
    durationSec: Math.round((merged.stats?.duration ?? 0) / 1000),
    tool: 'Cypress',
    browser: process.env.CY_BROWSER ?? 'Electron (Cypress default)',
    url: `${BASE_URL} (UI), ${API_URL} (API)`,
    results,
  });
  for (const f of files.filter((x) => x.endsWith('.html'))) console.log(`Module report: ${path.relative(root, f)}`);
  console.log(`All reports index: ${path.relative(root, index)}`);
})();
