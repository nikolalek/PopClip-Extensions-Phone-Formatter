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

const actions = (country, text = '84951234567') => ext.actions(
    { text },
    { country, docFormat: 'intl', showContact: true, showDocument: true, showWeb: true }
).reduce((acc, item) => acc.concat(item.submenu || [item]), []);

const ru = actions('RU');
const out = (list, index, text, country) => list[index].code({ text }, { country, docFormat: 'intl' });

ok(out(ru, 0, '84951234567', 'RU') === '+74951234567', 'no-lib RU contact', '');
ok(out(ru, 1, '84951234567', 'RU') === '+7 495 123 45 67', 'no-lib RU document', '');
ok(out(actions('US', '2025550134'), 0, '(202) 555-0134', 'US') === '+12025550134', 'no-lib US contact', '');
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
// Brackets and bare parenthesis extensions behave like the lib path.
for (const [open, close] of [['[', ']'], ['(', ')'], ['{', '}']]) {
    const wrapped = `${open}84951234567 ext. 12${close}`;
    ok(runOn(wrapped, 'RU', 0) === '+74951234567,12',
        `no-lib wrapped ext ${open}`, runOn(wrapped, 'RU', 0));
    ok(runOn(wrapped, 'RU', 1) === '+7 495 123 45 67 доб. 12',
        `no-lib wrapped ext document ${open}`, runOn(wrapped, 'RU', 1));
}
ok(runOn('84951234567 (123)', 'RU', 0) === '+74951234567,123',
    'no-lib bare paren ext', runOn('84951234567 (123)', 'RU', 0));
ok(runOn('84951234567 (123), 84957654321', 'RU', 0) === '+74951234567,123, +74957654321',
    'no-lib bare paren ext keeps separator', runOn('84951234567 (123), 84957654321', 'RU', 0));
ok(runOn('[84951234567 (123)]', 'RU', 0) === '+74951234567,123',
    'no-lib bare paren ext inside brackets', runOn('[84951234567 (123)]', 'RU', 0));
ok(runOn('+7+4951234567', 'RU', 0) === '+74951234567',
    'no-lib stray plus', runOn('+7+4951234567', 'RU', 0));
ok(runOn('Тел: +351969703202', 'PT', 0) === 'Тел: +351969703202',
    'no-lib space before span kept', runOn('Тел: +351969703202', 'PT', 0));
// #isValidOutput: the manual path can produce >15 digits (+998 + 14); the spec
// guard must reject it instead of pasting an invalid E.164 / tel URI.
{
    const overlong = '+99812345678901234';
    const fmt = new ext.PhoneFormatter('RU', 'intl');
    ok(fmt.format(overlong, 'contact') === null, 'no-lib contact rejects >15 digits',
        fmt.format(overlong, 'contact'));
    ok(fmt.format(overlong, 'web') === null, 'no-lib web rejects >15 digits',
        fmt.format(overlong, 'web'));
    // Control: 15 digits is the E.164 maximum and must still pass.
    const max = '+998123456789012';
    ok(fmt.format(max, 'contact') === max, 'no-lib accepts 15 digits', fmt.format(max, 'contact'));
}
ok(runOn('84951234567 extension 12', 'RU', 0) === '+74951234567,12',
    'no-lib extension ext', runOn('84951234567 extension 12', 'RU', 0));
const noMenu = (text, country) => ext.actions(
    { text },
    { country, docFormat: 'intl', showContact: true, showDocument: true, showWeb: true }
) === undefined;

ok(noMenu('+7 999 123 456', 'RU'), 'no-lib rejects invalid RU', '');
ok(noMenu('+1234567890123456', 'RU'), 'no-lib rejects overlong', '');
// fixedLength guards: RU/US strip the trunk prefix only for exact-10-digit nationals
ok(noMenu('84951234', 'RU'), 'no-lib RU rejects short trunk (fixedLength)', '');
// A US NSN cannot start with the trunk digit 1: "1202555013" used to become +11202555013.
ok(noMenu('1202555013', 'US'), 'no-lib US rejects NSN starting with 1', '');
// 5-6 digit extension survives in the manual path too
ok(runOn('84951234567 ext. 12345', 'RU', 0) === '+74951234567,12345',
    'no-lib 5-digit ext', runOn('84951234567 ext. 12345', 'RU', 0));
// Parenthesized extension: PHONE_PATTERN used to miss "(доб. 2)" in the manual path.
ok(runOn('+7(800)500-42-15 (доб. 2)', 'RU', 0) === '+78005004215,2',
    'no-lib parenthesized ext', runOn('+7(800)500-42-15 (доб. 2)', 'RU', 0));
ok(runOn('+7(800)500-42-15 (доб. 2)', 'RU', 3) === 'tel:+78005004215;ext=2',
    'no-lib parenthesized ext web', runOn('+7(800)500-42-15 (доб. 2)', 'RU', 3));
ok(runOn('84951234567 ext. 1', 'RU', 0) === '+74951234567,1',
    'no-lib 1-digit ext', runOn('84951234567 ext. 1', 'RU', 0));
ok(runOn('84951234567;ext=1', 'RU', 0) === '+74951234567,1',
    'no-lib ;ext= 1-digit ext', runOn('84951234567;ext=1', 'RU', 0));
// Dotted numbers are phones, not IPv4: the manual menu must not hide them.
ok(ext.actions({ text: '8495.123.45.67' },
    { country: 'RU', docFormat: 'intl', showContact: true, showDocument: true, showWeb: true }) !== undefined,
    'no-lib dotted number shows actions', '');
ok(ext.actions({ text: '192.168.1.1' },
    { country: 'RU', docFormat: 'intl', showContact: true, showDocument: true, showWeb: true }) === undefined,
    'no-lib IPv4 still hidden', '');
ok(runNatl('+49 30 12345678', 'DE') === '03012345678', 'no-lib DE natl trunk', runNatl('+49 30 12345678', 'DE'));
ok(runNatl('+44 20 7123 4567', 'GB') === '02071234567', 'no-lib GB natl trunk', runNatl('+44 20 7123 4567', 'GB'));
ok(runNatl('+36 1 234 5678', 'HU') === '0612345678', 'no-lib HU natl 06 trunk', runNatl('+36 1 234 5678', 'HU'));

console.log(`\nPASS: ${pass}  FAIL: ${fail}`);
process.exit(fail ? 1 : 0);
