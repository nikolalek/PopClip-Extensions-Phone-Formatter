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

const forText = (text, country) => ext.actions(
    { text },
    { country, docFormat: 'intl', showContact: true, showDocument: true, showWeb: true }
).reduce((acc, item) => acc.concat(item.submenu || [item]), []);
const runOn = (text, country, index) => forText(text, country)[index].code({ text }, { country, docFormat: 'intl' });

ok(out(ru, 3, '84951234567', 'RU') === 'tel:+74951234567', 'no-lib RU web', '');
ok(runOn('+44 20 7123 4567', 'GB', 0) === '+442071234567', 'no-lib foreign +', runOn('+44 20 7123 4567', 'GB', 0));
ok(runOn('+44 20 7123 4567', 'GB', 2) === 'tel:+442071234567', 'no-lib foreign web', '');
ok(runOn('0049 30 12345678', 'DE', 0) === '+493012345678', 'no-lib 00 prefix', runOn('0049 30 12345678', 'DE', 0));
ok(runOn('0612345678', 'IT', 0) === '+390612345678', 'no-lib keeps IT zero', runOn('0612345678', 'IT', 0));
ok(runOn('01012345678', 'CN', 0) === '+861012345678', 'no-lib CN landline', runOn('01012345678', 'CN', 0));
ok(runOn('01 55 1234 5678', 'MX', 0) === '+525512345678', 'no-lib MX 01 trunk', runOn('01 55 1234 5678', 'MX', 0));
ok(runOn('+81 3 1234 5678', 'JP', 0) === '+81312345678', 'no-lib JP short valid', runOn('+81 3 1234 5678', 'JP', 0));
ok(runOn('+49 6724 7411', 'DE', 0) === '+4967247411', 'no-lib DE short valid', runOn('+49 6724 7411', 'DE', 0));
ok(runOn('05194609', 'DE', 0) === '+495194609', 'no-lib DE 7-digit trunk', runOn('05194609', 'DE', 0));
ok(runOn('04221686', 'AT', 0) === '+434221686', 'no-lib AT 7-digit trunk', runOn('04221686', 'AT', 0));
ok(runOn('02793513', 'IE', 0) === '+3532793513', 'no-lib IE 7-digit trunk', runOn('02793513', 'IE', 0));
ok(runOn('09808996', 'FI', 0) === '+3589808996', 'no-lib FI 7-digit trunk', runOn('09808996', 'FI', 0));
ok(runOn('+49531166', 'DE', 0) === '+49531166', 'no-lib DE 6-digit +', runOn('+49531166', 'DE', 0));
ok(runOn('05532211234', 'BR', 0) === '+555532211234', 'no-lib BR national starting with 55',
    runOn('05532211234', 'BR', 0));
ok(runOn('09123456789', 'IN', 0) === '+919123456789', 'no-lib IN national starting with 91',
    runOn('09123456789', 'IN', 0));
ok(runOn('87011234567', 'RU', 0) === '+77011234567', 'no-lib KZ 7 trunk', runOn('87011234567', 'RU', 0));
ok(runOn('774951234567', 'RU', 0) === '+74951234567', 'no-lib RU 77', runOn('774951234567', 'RU', 0));
ok(runOn('84951234567 / 84957654321', 'RU', 0) === '+74951234567, +74957654321',
    'no-lib multiple slash', runOn('84951234567 / 84957654321', 'RU', 0));
ok(runOn('+7 999 123 456', 'RU', 0) === undefined, 'no-lib rejects invalid RU', '');
ok(runOn('+1234567890123456', 'RU', 0) === undefined, 'no-lib rejects overlong', '');

console.log(`\nPASS: ${pass}  FAIL: ${fail}`);
process.exit(fail ? 1 : 0);
