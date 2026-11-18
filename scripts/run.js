// Runs Cypress and then builds the HTML report, whether the tests passed or failed.
//   npm test                                   all specs
//   npm test -- --spec "cypress/e2e/auth/**"   one folder
//   npm run test:smoke                         only the @smoke (High priority) tests
// Every other argument is passed straight to `cypress run`.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

fs.rmSync(path.resolve(__dirname, '..', 'mochawesome-report'), { recursive: true, force: true });

// The path is built by hand because the cypress package restricts what `require.resolve` may return.
const cypressBin = path.resolve(__dirname, '..', 'node_modules', 'cypress', 'bin', 'cypress');
const args = process.argv.slice(2);
const run = spawnSync(process.execPath, [cypressBin, 'run', ...args], { stdio: 'inherit' });

// the browser name goes into the report (Electron is the Cypress default)
const browserArg = args.indexOf('--browser');
const browser = browserArg >= 0 ? args[browserArg + 1] : 'electron';
spawnSync(process.execPath, [path.join(__dirname, 'report.js')], {
  stdio: 'inherit',
  env: { ...process.env, CY_BROWSER: browser.charAt(0).toUpperCase() + browser.slice(1) },
});
process.exit(run.status ?? 1);
