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
// GOST is RU-only in the no-lib path too (regression: lib guard must not diverge)
ok(out(ru, 2, '+1 202 555 0134', 'RU') === undefined, 'no-lib gost rejects US number',
    out(ru, 2, '+1 202 555 0134', 'RU'));
ok(out(ru, 2, '+49 30 12345678', 'RU') === undefined, 'no-lib gost rejects DE number',
    out(ru, 2, '+49 30 12345678', 'RU'));
ok(out(ru, 2, '+7 701 1234567', 'RU') === undefined, 'no-lib gost rejects KZ number',
    out(ru, 2, '+7 701 1234567', 'RU'));

const forText = (text, country) => ext.actions(
    { text },
    { country, docFormat: 'intl', showContact: true, showDocument: true, showWeb: true }
).reduce((acc, item) => acc.concat(item.submenu || [item]), []);
const runOn = (text, country, index) => forText(text, country)[index].code({ text }, { country, docFormat: 'intl' });
const runNatl = (text, country) => forText(text, country)[1].code({ text }, { country, docFormat: 'natl' });

ok(out(ru, 3, '84951234567', 'RU') === 'tel:+74951234567', 'no-lib RU web', '');
ok(runOn('+44 20 7123 4567', 'GB', 0) === '+442071234567', 'no-lib foreign +', runOn('+44 20 7123 4567', 'GB', 0));
ok(runOn('+211 912 1234 56', 'RU', 0) === '+211912123456', 'no-lib South Sudan +211',
    runOn('+211 912 1234 56', 'RU', 0));
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
ok(runOn('84951234567 / 84957654321', 'RU', 0) === '+74951234567 / +74957654321',
    'no-lib multiple slash', runOn('84951234567 / 84957654321', 'RU', 0));
ok(runOn('84951234567, 84957654321', 'RU', 0) === '+74951234567, +74957654321',
    'no-lib comma list', runOn('84951234567, 84957654321', 'RU', 0));
ok(runOn('84951234567;84957654321', 'RU', 0) === '+74951234567;+74957654321',
    'no-lib semicolon list', runOn('84951234567;84957654321', 'RU', 0));
ok(runOn('84951234567 добавочный 12', 'RU', 0) === '+74951234567,12',
    'no-lib добавочный ext', runOn('84951234567 добавочный 12', 'RU', 0));
// #isValidOutput: the manual path can produce >15 digits (+998 + 14); the spec
// guard must reject it instead of pasting an invalid E.164 / tel URI.
{
    const overlong = '+99812345678901234';
    const list = forText(overlong, 'RU');
    const opts = { country: 'RU', docFormat: 'intl' };
    ok(list[0].code({ text: overlong }, opts) === undefined, 'no-lib contact rejects >15 digits',
        list[0].code({ text: overlong }, opts));
    ok(list[2].code({ text: overlong }, opts) === undefined, 'no-lib web rejects >15 digits',
        list[2].code({ text: overlong }, opts));
    // Control: 15 digits is the E.164 maximum and must still pass.
    const max = '+998123456789012';
    ok(forText(max, 'RU')[0].code({ text: max }, opts) === max, 'no-lib accepts 15 digits',
        forText(max, 'RU')[0].code({ text: max }, opts));
}
ok(runOn('84951234567 extension 12', 'RU', 0) === '+74951234567,12',
    'no-lib extension ext', runOn('84951234567 extension 12', 'RU', 0));
ok(runOn('+7 999 123 456', 'RU', 0) === undefined, 'no-lib rejects invalid RU', '');
ok(runOn('+1234567890123456', 'RU', 0) === undefined, 'no-lib rejects overlong', '');
// fixedLength guards: RU/US strip the trunk prefix only for exact-10-digit nationals
ok(runOn('84951234', 'RU', 0) === undefined, 'no-lib RU rejects short trunk (fixedLength)',
    runOn('84951234', 'RU', 0));
ok(runOn('1202555013', 'US', 0) === '+11202555013', 'no-lib US strips 1 only before 10 digits (fixedLength)',
    runOn('1202555013', 'US', 0));
// 5-6 digit extension survives in the manual path too
ok(runOn('84951234567 ext. 12345', 'RU', 0) === '+74951234567,12345',
    'no-lib 5-digit ext', runOn('84951234567 ext. 12345', 'RU', 0));
ok(runNatl('+49 30 12345678', 'DE') === '03012345678', 'no-lib DE natl trunk', runNatl('+49 30 12345678', 'DE'));
ok(runNatl('+44 20 7123 4567', 'GB') === '02071234567', 'no-lib GB natl trunk', runNatl('+44 20 7123 4567', 'GB'));
ok(runNatl('+36 1 234 5678', 'HU') === '0612345678', 'no-lib HU natl 06 trunk', runNatl('+36 1 234 5678', 'HU'));

console.log(`\nPASS: ${pass}  FAIL: ${fail}`);
process.exit(fail ? 1 : 0);
