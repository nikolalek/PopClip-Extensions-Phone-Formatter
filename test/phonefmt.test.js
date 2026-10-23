"use strict";
// Randomized conformance test for phone-formatter.popclipext/Config.js
// Usage: node test/phonefmt.test.js [SEED=0x...]
// Asserts E.164 (contact), E.123 (document), GOST, RFC 3966 (web)
// against libphonenumber-max across the 42 offered countries and dirty formats.
const path = require('path');
const DIR = path.join(__dirname, '..', 'phone-formatter.popclipext');
global.popclip = { modifiers: {}, showSuccess: () => {} };
const ext = require(path.join(DIR, 'Config.js'));
const lib = require(path.join(DIR, 'libphonenumber-max.js'));

const ALL_FORMATS = { country: 'RU', docFormat: 'intl', showContact: true, showDocument: true, showWeb: true };
const submenuOf = (options, text = '74951234567') => {
    const result = ext.actions({ text }, options);
    if (!result) return [];
    return Array.isArray(result) ? result[0].submenu : [result];
};
const [contactA, documentA, gostA, webA] = submenuOf(ALL_FORMATS);
const run = (action, text, country, docFormat = 'intl') =>
    action.code({ text }, { country, docFormat });

// Seeded PRNG (mulberry32) for reproducibility
let seed = parseInt(process.env.SEED || '0xC0FFEE', 16);
const rnd = () => (seed |= 0, seed = seed + 0x6D2B79F5 | 0, (Math.imul(seed ^ seed >>> 15, 1 | seed) ^ (Math.imul(seed ^ seed >>> 7, 61 | seed) >>> 0)) >>> 0) / 4294967296;
const rint = (n) => Math.floor(rnd() * n);

const rdigits = (len, firstNZ = true) => Array.from({ length: len }, (_, i) => i === 0 && firstNZ ? 1 + rint(9) : rint(10)).join('');

// Country table mirrored from the country option values in Config.js
const COUNTRIES = {
    RU: { lens: [10], code: '7', trunk: '8' }, US: { lens: [10], code: '1' },
    CA: { lens: [10], code: '1' }, DE: { lens: [8, 9, 10, 11], code: '49', trunk: '0' },
    GB: { lens: [9, 10, 11], code: '44', trunk: '0' }, FR: { lens: [9], code: '33', trunk: '0' },
    CN: { lens: [8, 10, 11], code: '86', trunk: '0' }, JP: { lens: [9, 10, 11], code: '81', trunk: '0' },
    IT: { lens: [9, 10, 11], code: '39' }, ES: { lens: [9], code: '34' },
    NL: { lens: [8, 9], code: '31', trunk: '0' }, SE: { lens: [7, 8, 9], code: '46', trunk: '0' },
    NO: { lens: [8], code: '47' }, DK: { lens: [8], code: '45' },
    AT: { lens: [8, 9, 10, 11, 12, 13], code: '43', trunk: '0' }, CH: { lens: [9], code: '41', trunk: '0' },
    BE: { lens: [8, 9], code: '32', trunk: '0' }, IE: { lens: [8, 9], code: '353', trunk: '0' },
    PT: { lens: [9], code: '351' }, GR: { lens: [10], code: '30' },
    FI: { lens: [8, 9], code: '358', trunk: '0' }, CZ: { lens: [9], code: '420' },
    HU: { lens: [8, 9], code: '36', trunk: '06' }, PL: { lens: [8, 9], code: '48' },
    RO: { lens: [9], code: '40', trunk: '0' }, BG: { lens: [8, 9], code: '359', trunk: '0' },
    HR: { lens: [8, 9], code: '385', trunk: '0' }, SI: { lens: [8], code: '386', trunk: '0' },
    SK: { lens: [9], code: '421', trunk: '0' }, LT: { lens: [8], code: '370', trunk: '8' },
    LV: { lens: [8], code: '371' }, EE: { lens: [7, 8], code: '372' },
    CY: { lens: [8], code: '357' }, MT: { lens: [8], code: '356' },
    LU: { lens: [8, 9], code: '352' }, TR: { lens: [10], code: '90', trunk: '0' },
    AU: { lens: [9], code: '61', trunk: '0' }, BR: { lens: [8, 10, 11], code: '55', trunk: '0' },
    MX: { lens: [10, 11], code: '52', trunk: '01' }, KR: { lens: [8, 9, 10], code: '82', trunk: '0' },
    IN: { lens: [10], code: '91', trunk: '0' }, TH: { lens: [8, 9], code: '66', trunk: '0' },
};

const libE164 = (e164orLocal, country) => {
    try {
        const p = lib.parsePhoneNumber(e164orLocal, country);
        return p && p.isValid() ? p.format('E.164') : null;
    } catch { return null; }
};

// Find a lib-valid random number per country (cap attempts)
function pickValid(country, cfg) {
    for (let i = 0; i < 400; i++) {
        const len = cfg.lens[rint(cfg.lens.length)];
        const nat = rdigits(len);
        const e = libE164('+' + cfg.code + nat, country);
        if (e) return { nat, e164: e };
    }
    return null;
}

const EXT_LABELS = ['доб.', 'ext.', 'ext', 'x', '#', ',', ';', 'Durchwahl', 'poste', 'int.'];
function mangle(e164, country, cfg, withExt) {
    const nat = e164.slice(('+' + cfg.code).length);
    const ext = withExt ? String(100 + rint(9000)) : null;
    // [text, usedTrunkForm] — Italy keeps trunk 0 inside E.164 (+390...)
    const variants = [
        [e164, false],
        ['+' + cfg.code + ' ' + nat, false],
        ['00' + cfg.code + nat, false],
        ['00' + cfg.code + ' ' + nat.replace(/(\d{3})(?=\d)/g, '$1 '), false],
        [nat, false],                                            // bare national
        ...(cfg.trunk && (country !== 'IT' || libE164(cfg.code + cfg.trunk + nat, country))
            ? [[cfg.trunk + nat, true]] : []),                   // trunk prefix (IT: only if valid with 0)
        ['(' + '+' + cfg.code + ') ' + nat, false],
        [e164.replace(/(\d{2})(?=\d)/g, '$1-'), false],
        [e164.replace(/(\d{3})(?=\d)/g, '$1.'), false],
        [`"${e164}"`, false],
        [`Тел: ${e164}`, false],
        [`tel:${e164}`, false],
        [`  ${e164}  `, false],
        ['+' + cfg.code + '(' + nat.slice(0, 3) + ')' + nat.slice(3), false],
    ];
    const [v0, usedTrunk] = variants[rint(variants.length)];
    let v = v0;
    // Italy: trunk 0 is part of the NSN and stays in E.164
    const base = (country === 'IT' && usedTrunk) ? '+39' + '0' + nat : e164;
    if (ext) {
        const style = EXT_LABELS[rint(EXT_LABELS.length)];
        if (style === ',') v = `${v},${ext}`;
        else if (style === ';') v = `${v};${ext}`;
        else if (style === '#') v = `${v}#${ext}`;
        else if (style === 'x') v = `${v} x${ext}`;
        else v = `${v} ${style} ${ext}`;
    }
    return { text: v, ext, base };
}

let pass = 0, fail = 0;
const failures = [];
const ok = (cond, label, detail) => {
    if (cond) pass++;
    else { fail++; failures.push(`${label} :: ${detail}`); }
};

// VALID_CODES must stay in sync with the bundled libphonenumber
{
    const real = new Set(lib.getCountries().map(c => '+' + lib.getCountryCallingCode(c)));
    const missing = [...real].filter(c => !ext.VALID_CODES.has(c));
    const extra = [...ext.VALID_CODES].filter(c => !real.has(c));
    ok(missing.length === 0 && extra.length === 0, 'VALID_CODES sync',
        `missing=${missing} extra=${extra}`);
}

const E164RE = /^\+[1-9]\d{6,14}$/;
for (const [country, cfg] of Object.entries(COUNTRIES)) {
    const picked = pickValid(country, cfg);
    if (!picked) { ok(false, country, 'no lib-valid random number found'); continue; }
    for (const withExt of [false, true]) {
        const { text, ext, base } = mangle(picked.e164, country, cfg, withExt);
        const c = run(contactA, text, country);
        const w = run(webA, text, country);
        const d = run(documentA, text, country);
        const g = run(gostA, text, country);
        const wantC = base + (ext ? `,${ext}` : '');
        const wantW = `tel:${base}` + (ext ? `;ext=${ext}` : '');
        ok(c === wantC, `${country}${ext ? '+ext' : ''} contact`, `in=${JSON.stringify(text)} got=${c} want=${wantC}`);
        ok(w === wantW, `${country}${ext ? '+ext' : ''} web`, `in=${JSON.stringify(text)} got=${w} want=${wantW}`);
        ok(typeof d === 'string' && d.length > 0 && !/\s{2}/.test(d), `${country} document`, `in=${JSON.stringify(text)} got=${d}`);
        if (country === 'RU') ok(typeof g === 'string' && g.length > 0, `${country} gost`, `in=${JSON.stringify(text)} got=${g}`);
        else ok(g === undefined, `${country} gost hidden`, `in=${JSON.stringify(text)} got=${g}`);
        ok(E164RE.test(picked.e164), `${country} e164-shape`, picked.e164);
    }
}

// Fixed edge cases (known tricky inputs)
const edge = [
    ['RU', '84951234567', '+74951234567'],
    ['RU', '8 (495) 123-45-67', '+74951234567'],
    ['RU', '++74951234567', '+74951234567'],
    ['RU', '+7.495.123.45.67', '+74951234567'],
    ['RU', 'tel:+74951234567;ext=123', '+74951234567,123'],
    ['US', '(202) 555-0134', '+12025550134'],
    ['US', '2025550134', '+12025550134'],
    ['DE', '030 12345678', null], // assert well-formed only (random-ish area)
    ['GB', '+442071234567', '+442071234567'],
    ['IT', '0039061234567', null],
    ['JP', '+81312345678', '+81312345678'],
    ['FR', '+33 1 23 45 67 89 poste 12345', '+33123456789,12345'],
    ['DE', '+49 30 12345678 ext. 123456', '+493012345678,123456'],
];
for (const [country, input, want] of edge) {
    const c = run(contactA, input, country);
    if (want) ok(c === want, `edge ${country}`, `in=${input} got=${c} want=${want}`);
    else ok(typeof c === 'string' && (E164RE.test(c.replace(/,\d+$/, '')) || c === input.trim()), `edge ${country}`, `in=${input} got=${c}`);
}

ok(run(gostA, '84951234567', 'RU') === '+7 (495) 123-45-67', 'gost RU exact', run(gostA, '84951234567', 'RU'));
ok(run(gostA, '84951234567 ext. 12', 'RU') === '+7 (495) 123-45-67, доб. 12',
    'gost RU exact with ext', run(gostA, '84951234567 ext. 12', 'RU'));

// Exact E.123 output and extension labels (the random matrix only checks shape).
const docCases = [
    ['US', '(202) 555-0134', '+1 202 555 0134'],
    ['DE', '030 12345678', '+49 30 12345678'],
    ['FR', '+33 1 23 45 67 89', '+33 1 23 45 67 89'],
    ['JP', '+81312345678', '+81 3 1234 5678'],
    ['RU', '84951234567', '+7 495 123 45 67'],
    ['US', '(202) 555-0134 ext. 12', '+1 202 555 0134 ext. 12'],
    ['DE', '030 12345678 Durchwahl 12', '+49 30 12345678 Durchwahl 12'],
    ['FR', '+33 1 23 45 67 89 poste 12', '+33 1 23 45 67 89 poste 12'],
    ['RU', '84951234567 ext. 12', '+7 495 123 45 67 доб. 12'],
];
for (const [country, input, want] of docCases) {
    const got = run(documentA, input, country);
    ok(got === want, `document ${country}`, `in=${input} got=${got} want=${want}`);
}
ok(run(documentA, '84951234567', 'RU', 'natl') === '8 (495) 123-45-67', 'document natl RU',
    run(documentA, '84951234567', 'RU', 'natl'));

// Separators, extensions, rejection, and long-input guard.
ok(ext.actions({ text: '917.555.1234' }, { ...ALL_FORMATS, country: 'US' }) !== undefined,
    'dot-separated number shows actions', '');
ok(ext.actions({ text: '2000000' }, { ...ALL_FORMATS, country: 'SE' }) !== undefined,
    '7-digit number shows actions', '');
ok(ext.actions({ text: '12.12.2026' }, ALL_FORMATS) === undefined, 'date -> no actions', '');
ok(ext.actions({ text: '10/20/2026' }, ALL_FORMATS) === undefined, 'slash date -> no actions', '');
ok(ext.actions({ text: '192.168.1.1' }, ALL_FORMATS) === undefined, 'IPv4 -> no actions', '');
for (const text of ['Meeting 21.01.2026', '21.01.2026, 22.01.2026', 'Server 192.168.1.1 down',
    '192.168.1.1:8080', '12. 12. 2026', '1.2.3.4.5.6.7.8', 'Meeting 12-12-2026',
    '12.12.2026, 22.01.2026']) {
    ok(ext.actions({ text }, { ...ALL_FORMATS, country: 'NO' }) === undefined,
        'date/IP in text -> no actions', JSON.stringify(text));
}
for (const text of ['1234.5678', '1234/5678', '1.234.567', '12.345.678']) {
    ok(ext.actions({ text }, { ...ALL_FORMATS, country: 'SE' }) === undefined,
        'decimal/fraction -> no actions', JSON.stringify(text));
}
ok(run(contactA, 'orders/84951234567', 'RU') === '+74951234567', 'phone after slash',
    run(contactA, 'orders/84951234567', 'RU'));
ok(run(contactA, 'Meeting 12.12.2026 84951234567', 'RU') === '+74951234567', 'phone after date',
    run(contactA, 'Meeting 12.12.2026 84951234567', 'RU'));
ok(run(contactA, '10.0.0.1, 84951234567', 'RU') === '+74951234567', 'phone after IPv4',
    run(contactA, '10.0.0.1, 84951234567', 'RU'));
ok(ext.actions({ text: '1 2 3 4 5 6' }, ALL_FORMATS) === undefined, '6 digits -> no actions', '');
ok(ext.actions({ text: '123-456' }, ALL_FORMATS) === undefined, '6 digits dashed -> no actions', '');
ok(run(contactA, '78 495 123 45 67', 'RU') === '+74951234567', 'RU 78 trunk', run(contactA, '78 495 123 45 67', 'RU'));
ok(run(contactA, '01 55 1234 5678', 'MX') === '+525512345678', 'MX 01 trunk',
    run(contactA, '01 55 1234 5678', 'MX'));
ok(run(contactA, '774951234567', 'RU') === '+74951234567', 'RU 77 legacy trunk',
    run(contactA, '774951234567', 'RU'));
ok(run(contactA, '+7 495 123 45 67;ext=123', 'RU') === '+74951234567,123',
    'bare ;ext', run(contactA, '+7 495 123 45 67;ext=123', 'RU'));
ok(run(contactA, '8 (495) 123-45-67 (доб. 123)', 'RU') === '+74951234567,123',
    'parenthesized ext', run(contactA, '8 (495) 123-45-67 (доб. 123)', 'RU'));
ok(run(contactA, '+7 999 123 456', 'RU') === undefined, 'reject invalid RU', run(contactA, '+7 999 123 456', 'RU'));
ok(run(contactA, '+999123456789', 'RU') === undefined, 'reject invalid code', run(contactA, '+999123456789', 'RU'));
ok(run(contactA, '+12345678', 'RU') === undefined, 'reject short foreign', run(contactA, '+12345678', 'RU'));
ok(run(contactA, '84951234567 ext. 12', 'RU') === '+74951234567,12', '2-digit ext',
    run(contactA, '84951234567 ext. 12', 'RU'));
ok(run(contactA, '84951234567 ext. 1234567', 'RU') === '+74951234567', '7-digit ext dropped',
    run(contactA, '84951234567 ext. 1234567', 'RU'));
ok(run(contactA, '84951234567#12', 'RU') === '+74951234567,12', '# ext', '');
ok(run(contactA, '84951234567 int. 12', 'RU') === '+74951234567,12', 'int. ext', '');
ok(run(contactA, '84951234567 добавочный 12', 'RU') === '+74951234567,12', 'добавочный ext',
    run(contactA, '84951234567 добавочный 12', 'RU'));
ok(run(contactA, '84951234567 extension 12', 'RU') === '+74951234567,12', 'extension ext',
    run(contactA, '84951234567 extension 12', 'RU'));
ok(run(webA, '84951234567 x12', 'RU') === 'tel:+74951234567;ext=12', 'x ext web', '');
ok(run(contactA, 'Тел: +7 495 123 45 67', 'RU') === '+74951234567', 'Тел: prefix', '');
ok(run(contactA, '"84951234567 ext. 12"', 'RU') === '+74951234567,12', 'quoted ext', '');
ok(run(contactA, '84951234567 / 84957654321', 'RU') === '+74951234567, +74957654321',
    'multiple numbers', run(contactA, '84951234567 / 84957654321', 'RU'));
ok(run(contactA, '84951234567, 84957654321', 'RU') === '+74951234567, +74957654321',
    'comma list', run(contactA, '84951234567, 84957654321', 'RU'));
ok(run(contactA, '84951234567;84957654321', 'RU') === '+74951234567, +74957654321',
    'semicolon list', run(contactA, '84951234567;84957654321', 'RU'));
ok(run(contactA, '84951234567, 84957654321, 84950000000', 'RU') === '+74951234567, +74957654321, +74950000000',
    'three-number comma list', run(contactA, '84951234567, 84957654321, 84950000000', 'RU'));
ok(run(contactA, '84951234567, 12', 'RU') === '+74951234567,12',
    'short comma ext kept', run(contactA, '84951234567, 12', 'RU'));
{
    const long = ' '.repeat(200000);
    const started = Date.now();
    ok(ext.actions({ text: long }, ALL_FORMATS) === undefined, 'long input rejected', '');
    ok(Date.now() - started < 500, 'long input fast', `${Date.now() - started}ms`);
    const digits = '1'.repeat(100000);
    const act = ext.actions({ text: digits }, ALL_FORMATS);
    ok(act === undefined || act.code({ text: digits }, ALL_FORMATS) === undefined,
        'long digits rejected', '');
    const slow = '+7 999 123-45-67\n1a1a1a1a1a1a1a1a1a1a' + ' '.repeat(500) + 'x1';
    const menu = ext.actions({ text: slow }, ALL_FORMATS);
    const startedSlow = Date.now();
    const slowAction = Array.isArray(menu) ? menu[0].submenu[0] : menu;
    if (slowAction) slowAction.code({ text: slow }, ALL_FORMATS);
    ok(Date.now() - startedSlow < 500, 'extension keyword regex fast', `${Date.now() - startedSlow}ms`);
}

// Dynamic actions: format checkboxes filter the menu; a single format flattens to a top-level action
{
    const count = (options) => submenuOf({ ...ALL_FORMATS, ...options }).length;
    ok(count({}) === 4, 'all formats shown', `count=${count({})}`);
    ok(count({ showWeb: false }) === 3, 'web hidden', `count=${count({ showWeb: false })}`);
    ok(count({ country: 'US' }) === 3, 'gost hidden outside RU', `count=${count({ country: 'US' })}`);
    ok(count({ country: 'ru' }) === 4, 'gost shown for lowercase ru', `count=${count({ country: 'ru' })}`);
    ok(count({ country: 'us' }) === 3, 'gost hidden for lowercase us', `count=${count({ country: 'us' })}`);
    ok(count({ country: 'ZZ' }) === 4, 'unknown country falls back to RU incl. GOST', `count=${count({ country: 'ZZ' })}`);
    ok(run(contactA, '84951234567', 'ZZ') === '+74951234567', 'unknown country formats as RU',
        run(contactA, '84951234567', 'ZZ'));
    ok(count({ country: 'US', showWeb: false, showDocument: false, showContact: false }) === 0,
        'all disabled outside RU -> no actions', '');
    ok(count({ showWeb: false, showDocument: false, showContact: false }) === 1,
        'all disabled in RU -> gost stays', '');
    const single = ext.actions({ text: '74951234567' },
        { ...ALL_FORMATS, country: 'US', showContact: false, showDocument: false });
    ok(!Array.isArray(single) && !!single.title && !single.submenu && typeof single.code === 'function',
        'single format flattens', JSON.stringify(Object.keys(single || {})));
    ok(!ext.actions({ text: 'hello world' }, ALL_FORMATS), 'non-phone text -> no actions', '');
}

// Guarded paths that mutation testing showed untested
{
    // Option key inverts the document format at click time
    global.popclip.modifiers = { option: true };
    const natlViaOption = documentA.code({ text: '84951234567' }, { country: 'RU', docFormat: 'intl' });
    ok(natlViaOption === '8 (495) 123-45-67', 'option key flips intl to natl', natlViaOption);
    const intlViaOption = documentA.code({ text: '84951234567' }, { country: 'RU', docFormat: 'natl' });
    ok(intlViaOption === '+7 495 123 45 67', 'option key flips natl to intl', intlViaOption);
    global.popclip.modifiers = {};

    // Per-action MAX_INPUT_LENGTH guard (menu gate alone is not enough)
    ok(contactA.code({ text: '9'.repeat(5000) }, ALL_FORMATS) === undefined, 'action-level length guard', '');

    // Multi-line: one number per line; non-phone lines pass through; empty lines kept
    ok(run(contactA, '84951234567\n84957654321', 'RU') === '+74951234567\n+74957654321',
        'multi-line phones', run(contactA, '84951234567\n84957654321', 'RU'));
    ok(run(contactA, '84951234567\nnote to self', 'RU') === '+74951234567\nnote to self',
        'multi-line passthrough', run(contactA, '84951234567\nnote to self', 'RU'));
    ok(run(contactA, '84951234567\n\n84957654321', 'RU') === '+74951234567\n\n+74957654321',
        'multi-line empty line kept', JSON.stringify(run(contactA, '84951234567\n\n84957654321', 'RU')));
}

console.log(`\nPASS: ${pass}  FAIL: ${fail}`);
if (failures.length) console.log('FAILURES:\n' + failures.slice(0, 40).join('\n'));
process.exit(fail ? 1 : 0);
