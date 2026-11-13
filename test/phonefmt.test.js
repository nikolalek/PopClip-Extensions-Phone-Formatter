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
const EXT_LABEL = ext.EXT_LABEL;

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

// Find a lib-valid random number assigned to this exact country (cap attempts).
// +7 and +1 are shared (RU/KZ, US/CA): a sibling's number is not a valid sample
// for this one, otherwise the GOST expectation below flakes.
function pickValid(country, cfg) {
    for (let i = 0; i < 400; i++) {
        const len = cfg.lens[rint(cfg.lens.length)];
        const nat = rdigits(len);
        const e164 = libE164('+' + cfg.code + nat, country);
        if (!e164) continue;
        let parsed = null;
        try { parsed = lib.parsePhoneNumber(e164); } catch { continue; }
        if (parsed?.country === country) return { nat, e164 };
    }
    return null;
}

const EXT_LABELS = ['доб.', 'ext.', 'ext', 'x', '#', ',', ';', 'Durchwahl', 'poste', 'int.'];
// [prefix, core, suffix] — text around the number must survive formatting as is.
function mangle(e164, country, cfg, withExt) {
    const nat = e164.slice(('+' + cfg.code).length);
    const ext = withExt ? String(1 + rint(999999)) : null;
    const variants = [
        ['', e164, ''],
        ['', '+' + cfg.code + ' ' + nat, ''],
        ['', '00' + cfg.code + nat, ''],
        ['', '00' + cfg.code + ' ' + nat.replace(/(\d{3})(?=\d)/g, '$1 '), ''],
        ['', nat, ''],                                            // bare national
        ...(cfg.trunk ? [['', cfg.trunk + nat, '']] : []),         // trunk prefix
        ['', '(' + '+' + cfg.code + ') ' + nat, ''],
        ['', e164.replace(/(\d{2})(?=\d)/g, '$1-'), ''],
        ['', e164.replace(/(\d{3})(?=\d)/g, '$1.'), ''],
        ['"', e164, '"'],
        ['Тел: ', e164, ''],
        ['', 'tel:' + e164, ''],
        ['', '+' + cfg.code + '(' + nat.slice(0, 3) + ')' + nat.slice(3), ''],
    ];
    const [prefix, core, suffix] = variants[rint(variants.length)];
    const base = e164;
    let number = core;
    if (ext) {
        const style = EXT_LABELS[rint(EXT_LABELS.length)];
        if (style === ',') number = `${core},${ext}`;
        else if (style === ';') number = `${core};${ext}`;
        else if (style === '#') number = `${core}#${ext}`;
        else if (style === 'x') number = `${core} x${ext}`;
        else number = `${core} ${style} ${ext}`;
    }
    // Leading/trailing whitespace is preserved, like all text around the number.
    const pad = rint(5) === 0 ? '  ' : '';
    return { text: pad + prefix + number + suffix + pad, ext, base, prefix, suffix, pad };
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

// COUNTRY must stay in sync between Config.js and this test mirror
{
    const inExt = Object.keys(ext.COUNTRY).sort().join(',');
    const inTest = Object.keys(COUNTRIES).sort().join(',');
    ok(inExt === inTest, 'COUNTRY sync', `ext=[${inExt}] test=[${inTest}]`);
}

const E164RE = /^\+[1-9]\d{6,14}$/;
for (const [country, cfg] of Object.entries(COUNTRIES)) {
    const picked = pickValid(country, cfg);
    if (!picked) { ok(false, country, 'no lib-valid random number found'); continue; }
    for (const withExt of [false, true]) {
        const { text, ext, base, prefix, suffix, pad } = mangle(picked.e164, country, cfg, withExt);
        const c = run(contactA, text, country);
        const w = run(webA, text, country);
        const d = run(documentA, text, country);
        const g = run(gostA, text, country);
        const wantC = pad + prefix + base + (ext ? `,${ext}` : '') + suffix + pad;
        const wantW = pad + prefix + `tel:${base}` + (ext ? `;ext=${ext}` : '') + suffix + pad;
        ok(c === wantC, `${country}${ext ? '+ext' : ''} contact`, `in=${JSON.stringify(text)} got=${c} want=${wantC}`);
        ok(w === wantW, `${country}${ext ? '+ext' : ''} web`, `in=${JSON.stringify(text)} got=${w} want=${wantW}`);
        const parsed = lib.parsePhoneNumber(picked.e164);
        const docExt = ext ? ` ${EXT_LABEL[country]} ${ext}` : '';
        const wantD = pad + prefix + parsed.formatInternational() + docExt + suffix + pad;
        const wantN = pad + prefix + parsed.formatNational() + docExt + suffix + pad;
        ok(d === wantD, `${country}${ext ? '+ext' : ''} document intl`,
            `in=${JSON.stringify(text)} got=${d} want=${wantD}`);
        ok(run(documentA, text, country, 'natl') === wantN, `${country}${ext ? '+ext' : ''} document natl`,
            `in=${JSON.stringify(text)} got=${run(documentA, text, country, 'natl')} want=${wantN}`);
        if (country === 'RU') {
            const nat = picked.e164.slice(2);
            const gost = `+7 (${nat.slice(0, 3)}) ${nat.slice(3, 6)}-${nat.slice(6, 8)}-${nat.slice(8)}`
                + (ext ? `, доб. ${ext}` : '');
            ok(g === pad + prefix + gost + suffix + pad, `${country}${ext ? '+ext' : ''} gost`,
                `in=${JSON.stringify(text)} got=${g} want=${gost}`);
        } else {
            ok(g === undefined, `${country} gost hidden`, `in=${JSON.stringify(text)} got=${g}`);
        }
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
// GOST is RU-only: a foreign number must not be relabeled as GOST (regression)
ok(run(gostA, '+1 202 555 0134', 'RU') === undefined, 'gost rejects US number with RU country',
    run(gostA, '+1 202 555 0134', 'RU'));
ok(run(gostA, '+49 30 12345678', 'RU') === undefined, 'gost rejects DE number with RU country',
    run(gostA, '+49 30 12345678', 'RU'));
// +7 is shared with KZ — GOST must reject Kazakh NSNs (start with 7) in both modes
ok(run(gostA, '+7 701 1234567', 'RU') === undefined, 'gost rejects KZ number',
    run(gostA, '+7 701 1234567', 'RU'));
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

// Single-digit extensions must survive (drop path used to reject <2 digits).
ok(run(contactA, '+7(800)500-42-15 (доб. 2)', 'RU') === '+78005004215,2',
    'single-digit ext contact', run(contactA, '+7(800)500-42-15 (доб. 2)', 'RU'));
ok(run(documentA, '+7(800)500-42-15 (доб. 2)', 'RU') === '+7 800 500 42 15 доб. 2',
    'single-digit ext document', run(documentA, '+7(800)500-42-15 (доб. 2)', 'RU'));
ok(run(webA, '+7(800)500-42-15 (доб. 2)', 'RU') === 'tel:+78005004215;ext=2',
    'single-digit ext web', run(webA, '+7(800)500-42-15 (доб. 2)', 'RU'));
ok(run(gostA, '+7(800)500-42-15 (доб. 2)', 'RU') === '+7 (800) 500-42-15, доб. 2',
    'single-digit ext gost', run(gostA, '+7(800)500-42-15 (доб. 2)', 'RU'));

// Regression: a list must keep the first number when it carries an extension.
// The scan after a lib match used to swallow ", 8" / ", 849576" as the ext.
{
    const withExt = '84951234567 ext. 12, 84957654321';
    ok(run(contactA, withExt, 'RU') === '+74951234567,12, +74957654321',
        'list + ext keeps first number', run(contactA, withExt, 'RU'));
    ok(run(documentA, withExt, 'RU') === '+7 495 123 45 67 доб. 12, +7 495 765 43 21',
        'list + ext keeps first number (document)', run(documentA, withExt, 'RU'));
    ok(run(gostA, withExt, 'RU') === '+7 (495) 123-45-67, доб. 12, +7 (495) 765-43-21',
        'list + ext keeps first number (gost)', run(gostA, withExt, 'RU'));
    ok(run(webA, withExt, 'RU') === 'tel:+74951234567;ext=12, tel:+74957654321',
        'list + ext keeps first number (web)', run(webA, withExt, 'RU'));
    const oneDigit = '84951234567 ext. 2, 8 495 765-43-21';
    ok(run(contactA, oneDigit, 'RU') === '+74951234567,2, +74957654321',
        'list + 1-digit ext keeps first number', run(contactA, oneDigit, 'RU'));
}

// Regression: brackets around a number are part of its span, never half-eaten.
ok(run(contactA, '[84951234567]', 'RU') === '+74951234567',
    'bracketed number', run(contactA, '[84951234567]', 'RU'));
ok(run(contactA, '(+7 495 123 45 67) доб. 12', 'RU') === '+74951234567,12',
    'parenthesized number + ext', run(contactA, '(+7 495 123 45 67) доб. 12', 'RU'));

// Every bracket type must close an extension the same way in the span and in
// the parser: "[]" used to hide the menu, "{}" leaked into the output.
for (const [open, close] of [['[', ']'], ['(', ')'], ['{', '}']]) {
    const wrapped = `${open}84951234567 ext. 12${close}`;
    ok(run(contactA, wrapped, 'RU') === '+74951234567,12',
        `wrapped ext contact ${open}`, run(contactA, wrapped, 'RU'));
    ok(run(documentA, wrapped, 'RU') === '+7 495 123 45 67 доб. 12',
        `wrapped ext document ${open}`, run(documentA, wrapped, 'RU'));
    ok(run(gostA, wrapped, 'RU') === '+7 (495) 123-45-67, доб. 12',
        `wrapped ext gost ${open}`, run(gostA, wrapped, 'RU'));
    ok(run(webA, wrapped, 'RU') === 'tel:+74951234567;ext=12',
        `wrapped ext web ${open}`, run(webA, wrapped, 'RU'));
}
ok(run(contactA, '[84951234567 ext. 1]', 'RU') === '+74951234567,1',
    'wrapped 1-digit ext contact', run(contactA, '[84951234567 ext. 1]', 'RU'));

// Bare parenthesized extension: "8 495 ... (123)".
ok(run(contactA, '84951234567 (123)', 'RU') === '+74951234567,123',
    'bare paren ext contact', run(contactA, '84951234567 (123)', 'RU'));
ok(run(documentA, '84951234567 (123)', 'RU') === '+7 495 123 45 67 доб. 123',
    'bare paren ext document', run(documentA, '84951234567 (123)', 'RU'));
ok(run(webA, '84951234567 (123)', 'RU') === 'tel:+74951234567;ext=123',
    'bare paren ext web', run(webA, '84951234567 (123)', 'RU'));
ok(run(contactA, '84951234567 (123), 84957654321', 'RU') === '+74951234567,123, +74957654321',
    'bare paren ext keeps list separator', run(contactA, '84951234567 (123), 84957654321', 'RU'));
ok(run(contactA, '[84951234567 (123)]', 'RU') === '+74951234567,123',
    'bare paren ext inside brackets', run(contactA, '[84951234567 (123)]', 'RU'));

// A stray '+' inside the number is a double paste, not part of the number.
ok(run(contactA, '+7+4951234567', 'RU') === '+74951234567',
    'stray plus', run(contactA, '+7+4951234567', 'RU'));
ok(run(contactA, 'Call +7+4951234567 now', 'RU') === 'Call +74951234567 now',
    'stray plus in text', run(contactA, 'Call +7+4951234567 now', 'RU'));

// Whitespace before a span is text, not part of the number.
ok(run(contactA, 'Тел: +351969703202', 'PT') === 'Тел: +351969703202',
    'space before span kept', run(contactA, 'Тел: +351969703202', 'PT'));
ok(run(documentA, 'Тел: +351969703202', 'PT') === 'Тел: +351 969 703 202',
    'space before span kept (document)', run(documentA, 'Тел: +351969703202', 'PT'));

// Regression: the menu must answer "can this be formatted?", not "are there digits?".
ok(ext.actions({ text: '8495.123.45.67' }, ALL_FORMATS) !== undefined,
    'dotted number shows actions', '');
ok(ext.actions({ text: '+7 495 123-45-67 14:30' }, ALL_FORMATS) === undefined,
    'time after a number -> no actions', '');
ok(ext.actions({ text: '12.12.2026 14:30' }, ALL_FORMATS) === undefined,
    'date and time -> no actions', '');

// Whitespace around the text is preserved exactly, including indent and CRLF.
ok(run(contactA, '  84951234567  ', 'RU') === '  +74951234567  ',
    'outer whitespace preserved', JSON.stringify(run(contactA, '  84951234567  ', 'RU')));
ok(run(contactA, 'a\r\n84951234567\r\nb', 'RU') === 'a\r\n+74951234567\r\nb',
    'CRLF and line text preserved', JSON.stringify(run(contactA, 'a\r\n84951234567\r\nb', 'RU')));

// EXT_LABEL must be parseable back: document output with 내선 / ต่อ keeps its ext.
{
    const kr = '+82 10-1234-5678 내선 12';
    ok(run(documentA, kr, 'KR') === '+82 10 1234 5678 내선 12', 'KR ext label', run(documentA, kr, 'KR'));
    ok(run(contactA, run(documentA, kr, 'KR'), 'KR') === '+821012345678,12',
        'KR document re-parses', run(contactA, run(documentA, kr, 'KR'), 'KR'));
    const th = '+66 44 145 279 ต่อ 12';
    ok(run(documentA, th, 'TH') === '+66 44 145 279 ต่อ 12', 'TH ext label', run(documentA, th, 'TH'));
    ok(run(contactA, run(documentA, th, 'TH'), 'TH') === '+6644145279,12',
        'TH document re-parses', run(contactA, run(documentA, th, 'TH'), 'TH'));
    const unparseable = Object.entries(EXT_LABEL)
        .filter(([, label]) => !ext.EXT_KEYWORDS.toLowerCase().includes(label.toLowerCase().replace(/\.$/, '')))
        .map(([country]) => country);
    ok(unparseable.length === 0, 'every EXT_LABEL is in EXT_KEYWORDS', unparseable.join(','));
}

// Locale keys must be PopClip's identifiers, not ad-hoc shorthand.
{
    const fs = require('fs');
    const src = fs.readFileSync(path.join(DIR, 'Config.js'), 'utf8');
    ok(!/"pt-br"|\bzh:/.test(src) && src.includes('"pt-BR":') && src.includes('"zh-Hans":'),
        'PopClip locale keys', 'pt-BR / zh-Hans');
}

// Options default when PopClip passes nothing; country is trimmed.
ok(ext.actions({ text: '84951234567' }) !== undefined, 'defaults when options missing', '');
ok(run(contactA, '84951234567', ' ru ') === '+74951234567', 'country trimmed',
    run(contactA, '84951234567', ' ru '));
for (const input of [{ text: '' }, { text: '   ' }, { text: 12345 }, {}, null]) {
    ok(ext.actions(input) === undefined, 'empty/non-string input -> no actions', JSON.stringify(input));
}

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
ok(run(contactA, 'orders/84951234567', 'RU') === 'orders/+74951234567', 'phone after slash',
    run(contactA, 'orders/84951234567', 'RU'));
ok(run(contactA, 'Meeting 12.12.2026 84951234567', 'RU') === 'Meeting 12.12.2026 +74951234567', 'phone after date',
    run(contactA, 'Meeting 12.12.2026 84951234567', 'RU'));
ok(run(contactA, '10.0.0.1, 84951234567', 'RU') === '10.0.0.1, +74951234567', 'phone after IPv4',
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
ok(run(contactA, '84951234567 ext. 1234567', 'RU') === '+74951234567 ext. 1234567', '7-digit ext left as is',
    run(contactA, '84951234567 ext. 1234567', 'RU'));
ok(run(contactA, '84951234567#12', 'RU') === '+74951234567,12', '# ext', '');
ok(run(contactA, '84951234567 int. 12', 'RU') === '+74951234567,12', 'int. ext', '');
ok(run(contactA, '84951234567 добавочный 12', 'RU') === '+74951234567,12', 'добавочный ext',
    run(contactA, '84951234567 добавочный 12', 'RU'));
ok(run(contactA, '84951234567 extension 12', 'RU') === '+74951234567,12', 'extension ext',
    run(contactA, '84951234567 extension 12', 'RU'));
ok(run(webA, '84951234567 x12', 'RU') === 'tel:+74951234567;ext=12', 'x ext web', '');
ok(run(contactA, 'Тел: +7 495 123 45 67', 'RU') === 'Тел: +74951234567', 'Тел: prefix', '');
ok(run(contactA, '"84951234567 ext. 12"', 'RU') === '"+74951234567,12"', 'quoted ext', '');
ok(run(contactA, '84951234567 / 84957654321', 'RU') === '+74951234567 / +74957654321',
    'multiple numbers', run(contactA, '84951234567 / 84957654321', 'RU'));
ok(run(contactA, '84951234567, 84957654321', 'RU') === '+74951234567, +74957654321',
    'comma list', run(contactA, '84951234567, 84957654321', 'RU'));
ok(run(contactA, '84951234567;84957654321', 'RU') === '+74951234567;+74957654321',
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
    const count = (options, text) => submenuOf({ ...ALL_FORMATS, ...options }, text).length;
    ok(count({}) === 4, 'all formats shown', `count=${count({})}`);
    ok(count({ showWeb: false }) === 3, 'web hidden', `count=${count({ showWeb: false })}`);
    ok(count({ country: 'US' }, '2025550134') === 3, 'gost hidden outside RU', `count=${count({ country: 'US' }, '2025550134')}`);
    ok(count({ country: 'ru' }) === 4, 'gost shown for lowercase ru', `count=${count({ country: 'ru' })}`);
    ok(count({ country: 'us' }, '2025550134') === 3, 'gost hidden for lowercase us', `count=${count({ country: 'us' }, '2025550134')}`);
    ok(count({ country: 'ZZ' }) === 4, 'unknown country falls back to RU incl. GOST', `count=${count({ country: 'ZZ' })}`);
    ok(count({}, '+1 202 555 0134') === 3, 'gost hidden when the selection holds no RU number',
        `count=${count({}, '+1 202 555 0134')}`);
    ok(count({}, '84951234567, +1 202 555 0134') === 4, 'gost shown for a mixed list',
        `count=${count({}, '84951234567, +1 202 555 0134')}`);
    ok(run(contactA, '84951234567', 'ZZ') === '+74951234567', 'unknown country formats as RU',
        run(contactA, '84951234567', 'ZZ'));
    ok(count({ country: 'US', showWeb: false, showDocument: false, showContact: false }) === 0,
        'all disabled outside RU -> no actions', '');
    ok(count({ showWeb: false, showDocument: false, showContact: false }) === 1,
        'all disabled in RU -> gost stays', '');
    const single = ext.actions({ text: '2025550134' },
        { ...ALL_FORMATS, country: 'US', showContact: false, showDocument: false });
    ok(!Array.isArray(single) && !!single.title && !single.submenu && typeof single.code === 'function',
        'single format flattens', JSON.stringify(Object.keys(single || {})));
    ok(!ext.actions({ text: 'hello world' }, ALL_FORMATS), 'non-phone text -> no actions', '');
}

// Guarded paths that mutation testing showed untested
{
    // Option key inverts the document format at click time
    try {
        global.popclip.modifiers = { option: true };
        const natlViaOption = documentA.code({ text: '84951234567' }, { country: 'RU', docFormat: 'intl' });
        ok(natlViaOption === '8 (495) 123-45-67', 'option key flips intl to natl', natlViaOption);
        const intlViaOption = documentA.code({ text: '84951234567' }, { country: 'RU', docFormat: 'natl' });
        ok(intlViaOption === '+7 495 123 45 67', 'option key flips natl to intl', intlViaOption);
    } finally { global.popclip.modifiers = {}; }

    // Per-action MAX_INPUT_LENGTH guard (menu gate alone is not enough)
    ok(contactA.code({ text: '84951234567 ' + 'x'.repeat(5000) }, ALL_FORMATS) === undefined,
        'action-level length guard', '');

    // Numbers are replaced where they stand: surrounding text and separators survive.
    ok(run(contactA, 'Звонить 84951234567 сегодня', 'RU') === 'Звонить +74951234567 сегодня',
        'text around number preserved', run(contactA, 'Звонить 84951234567 сегодня', 'RU'));
    ok(run(webA, 'Звонить 84951234567 сегодня', 'RU') === 'Звонить tel:+74951234567 сегодня',
        'web text around number preserved', run(webA, 'Звонить 84951234567 сегодня', 'RU'));
    ok(run(contactA, 'Звонить 84951234567 или 84957654321 сегодня', 'RU')
        === 'Звонить +74951234567 или +74957654321 сегодня', 'text around two numbers preserved',
        run(contactA, 'Звонить 84951234567 или 84957654321 сегодня', 'RU'));

    // Extension bounds: 1..6 digits kept, 7 dropped (format() sees the ext directly)
    const fmtRU = new ext.PhoneFormatter('RU');
    ok(fmtRU.format('84951234567 ext. 1', 'contact') === '+74951234567,1', '1-digit ext kept',
        fmtRU.format('84951234567 ext. 1', 'contact'));
    ok(fmtRU.format('84951234567 ext. 12', 'contact') === '+74951234567,12', '2-digit ext kept',
        fmtRU.format('84951234567 ext. 12', 'contact'));
    ok(fmtRU.format('84951234567 ext. 123456', 'contact') === '+74951234567,123456', '6-digit ext kept',
        fmtRU.format('84951234567 ext. 123456', 'contact'));
    ok(fmtRU.format('84951234567 ext. 1234567', 'contact') === '+74951234567', '7-digit ext dropped',
        fmtRU.format('84951234567 ext. 1234567', 'contact'));

    // NFKC: full-width digits reach the menu and format like ASCII ones.
    ok(ext.actions({ text: '８４９５１２３４５６７' }, ALL_FORMATS) !== undefined,
        'full-width digits show actions', '');
    ok(run(contactA, '８４９５１２３４５６７', 'RU') === '+74951234567', 'full-width digits',
        run(contactA, '８４９５１２３４５６７', 'RU'));

    // Multi-line: one number per line; non-phone lines pass through; empty lines kept
    ok(run(contactA, '84951234567\n84957654321', 'RU') === '+74951234567\n+74957654321',
        'multi-line phones', run(contactA, '84951234567\n84957654321', 'RU'));
    ok(run(contactA, '84951234567\nnote to self', 'RU') === '+74951234567\nnote to self',
        'multi-line passthrough', run(contactA, '84951234567\nnote to self', 'RU'));
    ok(run(contactA, '84951234567\n\n84957654321', 'RU') === '+74951234567\n\n+74957654321',
        'multi-line empty line kept', JSON.stringify(run(contactA, '84951234567\n\n84957654321', 'RU')));

    // Bundle present but throwing: degrade to manual formatting, not to total rejection.
    // Config.js and the test share one require-cache instance of the bundle.
    // Self-proving pair: healthy lib rejects +7000…, crashed lib hands it to manual.
    ok(run(contactA, '+70001234567', 'RU') === undefined, 'healthy lib rejects non-number',
        run(contactA, '+70001234567', 'RU'));
    const origParse = lib.parsePhoneNumber;
    lib.parsePhoneNumber = () => { throw new Error('simulated bundle crash'); };
    try {
        ok(run(contactA, '84951234567', 'RU') === '+74951234567', 'lib-throws -> manual contact',
            run(contactA, '84951234567', 'RU'));
        ok(run(contactA, '+70001234567', 'RU') === '+70001234567', 'lib-throws -> manual takes over (proves fallback ran)',
            run(contactA, '+70001234567', 'RU'));
        ok(run(documentA, '84951234567', 'RU') === '+7 495 123 45 67', 'lib-throws -> manual document',
            run(documentA, '84951234567', 'RU'));
        ok(run(gostA, '+1 202 555 0134', 'RU') === undefined, 'lib-throws -> gost still rejects foreign',
            run(gostA, '+1 202 555 0134', 'RU'));
    } finally { lib.parsePhoneNumber = origParse; }

    // findAll throws: the whole-number fallback path (comma list without lib scan)
    const origFind = lib.findPhoneNumbersInText;
    lib.findPhoneNumbersInText = () => { throw new Error('simulated finder crash'); };
    try {
        ok(run(contactA, '84951234567, 84957654321', 'RU') === '+74951234567, +74957654321',
            'findAll-throws -> comma list via fallback', run(contactA, '84951234567, 84957654321', 'RU'));
    } finally { lib.findPhoneNumbersInText = origFind; }

    // Partial failure in a comma list: invalid entry dropped, valid one kept
    ok(run(contactA, '84951234567, +7 999 123 456', 'RU') === '+74951234567, +7 999 123 456',
        'partial-fail list keeps invalid entry untouched', run(contactA, '84951234567, +7 999 123 456', 'RU'));

    // RU historic '87' trunk form: 12 digits, no area-code guard (unlike 77/78)
    ok(run(contactA, '874951234567', 'RU') === '+74951234567',
        'RU 87 legacy trunk (lib path)', run(contactA, '874951234567', 'RU'));

    // GOST gate normalizes the country before comparing with 'RU'
    ok(run(gostA, '+79001234567', 'ru') === '+7 (900) 123-45-67',
        'gost gate accepts lowercase country', run(gostA, '+79001234567', 'ru'));

    // CRLF line endings (Windows clipboard)
    ok(run(contactA, '84951234567\r\n84957654321', 'RU') === '+74951234567\r\n+74957654321',
        'CRLF multi-line', JSON.stringify(run(contactA, '84951234567\r\n84957654321', 'RU')));

    // Web format joins multiple numbers (contact lists are covered, web was single-only).
    // Note: comma-joined 'tel:' strings are documented behavior, not RFC 3966.
    ok(run(webA, '84951234567, 84957654321', 'RU') === 'tel:+74951234567, tel:+74957654321',
        'web format joins multiple numbers', run(webA, '84951234567, 84957654321', 'RU'));

    // 5-digit extension survives in all modes (PBX ranges are real)
    ok(run(contactA, '84951234567 ext. 12345', 'RU') === '+74951234567,12345',
        'contact 5-digit ext', run(contactA, '84951234567 ext. 12345', 'RU'));

    // Regex gate agrees with code(): every edge input that formats must also match
    // PHONE_REGEX (otherwise PopClip hides a working action).
    const extMod = require('../phone-formatter.popclipext/Config.js');
    for (const edge of ['84951234567', '+7 900 123 45 67', '8 (495) 123-45-67', '(202) 555-0134',
        '+44 20 7123 4567 ext. 12', '84951234567, 84957654321', '+49 30 12345678 доб. 12']) {
        ok(extMod.PHONE_REGEX.test(edge), 'regex gate matches formatted input', edge);
    }
    // ...and the non-phone gate has two layers: the bare regex rejects only
    // decimal-like strings; dates/IPs are rejected by isNonPhoneText at menu level.
    ok(!extMod.PHONE_REGEX.test('3,14159'), 'regex rejects decimal', '3,14159');
    for (const nonPhone of ['2024-01-15', '192.168.1.1', '3,14159']) {
        ok(extMod.actions({ text: nonPhone }, ALL_FORMATS) === undefined,
            'menu gate rejects non-phone', nonPhone);
    }
    ok(run(contactA, '1 234 567', 'RU') === undefined,
        'ambiguous 7-digit string formats to nothing', run(contactA, '1 234 567', 'RU'));

    // EXT_LABEL: bijection with the 42-country table, no missing/orphan labels
    const countries = Object.keys(extMod.COUNTRY);
    ok(countries.length === 42, '42 countries in table', countries.length);
    ok(countries.every(c => typeof extMod.EXT_LABEL[c] === 'string' && extMod.EXT_LABEL[c]),
        'every country has an ext label', countries.filter(c => !extMod.EXT_LABEL[c]).join(','));
    ok(Object.keys(extMod.EXT_LABEL).every(c => extMod.COUNTRY[c]),
        'no orphan ext labels', Object.keys(extMod.EXT_LABEL).filter(c => !extMod.COUNTRY[c]).join(','));

    // Every EXT_KEYWORDS token parses the extension in document format
    const kwBad = [];
    for (const kw of ['extension', 'extn', 'durchwahl', 'добавочный', 'alanumero', 'vidinis',
        'interno', 'anknr', 'poste', '内線', '分机', 'mellék', 'linka', 'wew', 'вт',
        'iekš', 'lisa', 'ramal', 'ext', 'int', 'tst', 'lok', 'dahili', 'εσωτ', 'DW',
        'App', 'lnr', 'доб', 'uitb', 'est']) {
        const out = run(documentA, `+79001234567 ${kw} 12`, 'RU');
        if (out !== '+7 900 123 45 67 доб. 12') kwBad.push(`${kw}:${out}`);
    }
    ok(kwBad.length === 0, 'all 30 EXT_KEYWORDS tokens parse', kwBad.slice(0, 3).join(' | '));
}

console.log(`\nPASS: ${pass}  FAIL: ${fail}`);
if (failures.length) console.log('FAILURES:\n' + failures.slice(0, 40).join('\n'));
process.exit(fail ? 1 : 0);
