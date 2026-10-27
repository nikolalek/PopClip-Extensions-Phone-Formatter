// Runs Config.js in the real JavaScriptCore (PopClip's engine), without PopClip.
// Usage: cd phone-formatter.popclipext && jsc ../test/jsc-harness.js
"use strict";

// jsc has load() but no CommonJS: a minimal require() keeps Config.js unchanged.
function require(path) {
    var mod = { exports: {} };
    var prevModule = globalThis.module, prevExports = globalThis.exports;
    globalThis.module = mod;
    globalThis.exports = mod.exports;
    try { load(path.replace(/^\.\//, '')); } finally {
        globalThis.module = prevModule;
        globalThis.exports = prevExports;
    }
    return mod.exports;
}

globalThis.popclip = { modifiers: {}, showSuccess: function () {} };
var mod = { exports: {} };
globalThis.module = mod;
load('Config.js');
var ext = mod.exports;

var options = { country: 'RU', docFormat: 'intl', showContact: true, showDocument: true, showWeb: true };
var failures = 0;
function check(got, want, label) {
    if (got !== want) {
        failures++;
        print('FAIL ' + label + ': ' + JSON.stringify(got) + ' != ' + JSON.stringify(want));
    }
}

var text = '8 (495) 123-45-67 ext. 12';
var actions = ext.actions({ text: text }, options);
var list = Array.isArray(actions) ? actions[0].submenu : [actions];
check(list.length, 4, 'menu size');
check(JSON.stringify(list.map(function (a) { return a.code({ text: text }, options); })),
    JSON.stringify(['+74951234567,12', '+7 495 123 45 67 доб. 12', '+7 (495) 123-45-67, доб. 12', 'tel:+74951234567;ext=12']),
    'four formats');
check(list[0].code({ text: 'Звонить 84951234567 сегодня' }, options), 'Звонить +74951234567 сегодня', 'text preserved');
check(list[0].code({ text: '８４９５１２３４５６７' }, options), '+74951234567', 'full-width digits');
check(list[0].code({ text: '84951234567\nnote' }, options), '+74951234567\nnote', 'multi-line');
var single = { ...options, country: 'US', showDocument: false, showWeb: false };
check(ext.actions({ text: '2025550134' }, single).code({ text: '2025550134' }, single), '+12025550134', 'single format flattens');

print(failures ? 'FAIL: ' + failures : 'PASS: jsc harness');
if (failures) throw new Error('jsc harness failed');
