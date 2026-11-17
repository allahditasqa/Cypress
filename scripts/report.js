// Merges the mochawesome JSON files of a run into one self-contained HTML report.
// The file name contains the date and time, so an old report is never overwritten:
//   reports/cypress test DD-MM-YYYY_HH-mm.html
// Reports open without a server or internet access. Failure screenshots are in cypress/screenshots.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { merge } = require('mochawesome-merge');

const root = path.resolve(__dirname, '..');
const jsonDir = path.join(root, 'mochawesome-report');
const outDir = path.join(root, 'reports');
const two = (n) => String(n).padStart(2, '0');

(async () => {
  const hasJson = fs.existsSync(jsonDir) && fs.readdirSync(jsonDir).some((f) => f.endsWith('.json') && f !== 'merged.json');
  if (!hasJson) {
    console.log('No report was built: no mochawesome JSON found (run the tests first: npm test).');
    return;
  }
  const merged = await merge({ files: [path.join(jsonDir, '*.json').replace(/\\/g, '/')] });
  const mergedFile = path.join(jsonDir, 'merged.json');
  fs.writeFileSync(mergedFile, JSON.stringify(merged));

  const d = new Date();
  const stamp = `${two(d.getDate())}-${two(d.getMonth() + 1)}-${d.getFullYear()}_${two(d.getHours())}-${two(d.getMinutes())}`;
  fs.mkdirSync(outDir, { recursive: true });
  let name = `cypress test ${stamp}`;
  if (fs.existsSync(path.join(outDir, `${name}.html`))) name += `-${two(d.getSeconds())}`;

  const marge = path.join(root, 'node_modules', 'mochawesome-report-generator', 'bin', 'cli.js');
  const result = spawnSync(
    process.execPath,
    [marge, mergedFile, '--reportDir', outDir, '--reportFilename', name, '--reportTitle', 'Cypress test report', '--inline', '--code', 'false'],
    { stdio: 'inherit' },
  );
  if (result.status === 0) console.log(`\nReport: ${path.join('reports', `${name}.html`)}`);
})();
