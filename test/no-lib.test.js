"use strict";
// Manual fallback: when the bundled library cannot be loaded, formatting still works.
const path = require('path');
const Module = require('module');
const DIR = path.join(__dirname, '..', 'phone-formatter.popclipext');

const origLoad = Module._load;
Module._load = function (request) {
    if (String(request).endsWith('libphonenumber-max.js')) throw new Error('simulated bundle failure');
    return origLoad.apply(this, arguments);
};
global.popclip = { modifiers: {}, showSuccess: () => {} };
const ext = require(path.join(DIR, 'Config.js'));
Module._load = origLoad;

let pass = 0, fail = 0;
const ok = (cond, label, detail) => {
    if (cond) pass++;
    else { fail++; console.log(`FAIL ${label} :: ${detail}`); }
};

const actions = (country) => ext.actions(
    { text: '84951234567' },
    { country, docFormat: 'intl', showContact: true, showDocument: true, showWeb: true }
).reduce((acc, item) => acc.concat(item.submenu || [item]), []);

const ru = actions('RU');
const out = (list, index, text, country) => list[index].code({ text }, { country, docFormat: 'intl' });

ok(out(ru, 0, '84951234567', 'RU') === '+74951234567', 'no-lib RU contact', '');
ok(out(ru, 1, '84951234567', 'RU') === '+7 495 123 45 67', 'no-lib RU document', '');
ok(out(actions('US'), 0, '(202) 555-0134', 'US') === '+12025550134', 'no-lib US contact', '');
ok(out(ru, 2, '84951234567', 'RU').startsWith('+7 ('), 'no-lib RU gost', '');

console.log(`\nPASS: ${pass}  FAIL: ${fail}`);
process.exit(fail ? 1 : 0);
