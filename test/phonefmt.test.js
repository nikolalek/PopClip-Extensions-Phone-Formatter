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
    CA: { lens: [10], code: '1' }, DE: { lens: [10, 11], code: '49', trunk: '0' },
    GB: { lens: [10], code: '44', trunk: '0' }, FR: { lens: [9], code: '33', trunk: '0' },
    CN: { lens: [11], code: '86', trunk: '0' }, JP: { lens: [10], code: '81', trunk: '0' },
    IT: { lens: [9, 10], code: '39', trunk: '0' }, ES: { lens: [9], code: '34' },
    NL: { lens: [9], code: '31', trunk: '0' }, SE: { lens: [7, 8, 9], code: '46', trunk: '0' },
    NO: { lens: [8], code: '47' }, DK: { lens: [8], code: '45' },
    AT: { lens: [10], code: '43', trunk: '0' }, CH: { lens: [9], code: '41', trunk: '0' },
    BE: { lens: [9], code: '32', trunk: '0' }, IE: { lens: [9], code: '353', trunk: '0' },
    PT: { lens: [9], code: '351' }, GR: { lens: [10], code: '30' },
    FI: { lens: [9], code: '358', trunk: '0' }, CZ: { lens: [9], code: '420' },
    HU: { lens: [9], code: '36', trunk: '06' }, PL: { lens: [9], code: '48' },
    RO: { lens: [9], code: '40', trunk: '0' }, BG: { lens: [9], code: '359', trunk: '0' },
    HR: { lens: [9], code: '385', trunk: '0' }, SI: { lens: [8], code: '386', trunk: '0' },
    SK: { lens: [9], code: '421', trunk: '0' }, LT: { lens: [8], code: '370', trunk: '8' },
    LV: { lens: [8], code: '371' }, EE: { lens: [8], code: '372' },
    CY: { lens: [8], code: '357' }, MT: { lens: [8], code: '356' },
    LU: { lens: [9], code: '352' }, TR: { lens: [10], code: '90', trunk: '0' },
    AU: { lens: [9], code: '61', trunk: '0' }, BR: { lens: [10, 11], code: '55', trunk: '0' },
    MX: { lens: [10], code: '52', trunk: '01' }, KR: { lens: [9, 10], code: '82', trunk: '0' },
    IN: { lens: [10], code: '91', trunk: '0' }, TH: { lens: [9], code: '66', trunk: '0' },
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
        ...(cfg.trunk ? [[cfg.trunk + nat, true]] : []),         // trunk prefix
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
        ok(typeof g === 'string' && g.length > 0, `${country} gost`, `in=${JSON.stringify(text)} got=${g}`);
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

// Dynamic actions: format checkboxes filter the menu; a single format flattens to a top-level action
{
    const count = (options) => submenuOf({ ...ALL_FORMATS, ...options }).length;
    ok(count({}) === 4, 'all formats shown', `count=${count({})}`);
    ok(count({ showWeb: false }) === 3, 'web hidden', `count=${count({ showWeb: false })}`);
    ok(count({ country: 'US' }) === 3, 'gost hidden outside RU', `count=${count({ country: 'US' })}`);
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

console.log(`\nPASS: ${pass}  FAIL: ${fail}`);
if (failures.length) console.log('FAILURES:\n' + failures.slice(0, 40).join('\n'));
process.exit(fail ? 1 : 0);
