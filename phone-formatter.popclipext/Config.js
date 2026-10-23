// # popclip
// name:
//   ru: Телефонный Форматер
//   en: Phone Formatter
//   de: Telefon-Formatierer
//   fr: Formateur de Téléphone
//   zh: 电话格式化器
//   ja: 電話フォーマッター
//   it: Formattatore Telefono
//   es: Formateador de Teléfono
//   nl: Telefoon Formatter
//   pl: Formatter Telefonu
//   pt-br: Formatador de Telefone
//   ko: 전화번호 포맷터
//   vi: Định dạng Số điện thoại
//   tr: Telefon Biçimleyici
//   sk: Formátovač Telefónu
//   da: Telefon Formatter
// author: nikolalek
// identifier: ru.nikolalek.extension.phone-formatter
// description:
//   ru: Форматирование телефонных номеров с добавочными в стандарты E.164, E.123, RFC 3966
//   en: Format phone numbers with extensions to E.164, E.123, RFC 3966 standards
//   de: Formatierung von Telefonnummern mit Nebenstellen nach E.164, E.123, RFC 3966
//   fr: Formatage des numéros de téléphone avec extensions selon E.164, E.123, RFC 3966
//   zh: 按照 E.164、E.123、RFC 3966 标准格式化带分机号的电话号码
//   ja: E.164、E.123、RFC 3966 標準に従った内線番号付き電話番号のフォーマット
//   it: Formattazione numeri telefono con interni secondo standard E.164, E.123, RFC 3966
//   es: Formateo de números telefónicos con extensiones según estándares E.164, E.123, RFC 3966
//   nl: Formattering van telefoonnummers met extensies volgens E.164, E.123, RFC 3966
//   pl: Formatowanie numerów telefonów z wewnętrznymi według standardów E.164, E.123, RFC 3966
//   pt-br: Formatação de números telefônicos com ramais conforme padrões E.164, E.123, RFC 3966
//   ko: E.164, E.123, RFC 3966 표준에 따른 내선 번호가 포함된 전화번호 형식 지정
//   vi: Định dạng số điện thoại có số máy lẻ theo tiêu chuẩn E.164, E.123, RFC 3966
//   tr: E.164, E.123, RFC 3966 standartlarına göre dahili numaralı telefon formatı
//   sk: Formátovanie telefónnych čísiel s prídavnými podľa štandardov E.164, E.123, RFC 3966
//   da: Formatering af telefonnumre med lokalnumre iht. E.164, E.123, RFC 3966 standarder
// icon: iconify:tabler:phone-check
// popclip version: 4200
// requirements: [text]
// entitlements: [dynamic]
// after: paste-result
// keywords: phone number format E.164 E.123 RFC 3966 telephone extension contact document
// options:
//   - identifier: country
//     type: multiple
//     label:
//       ru: Страна по умолчанию
//       en: Default Country
//       de: Standard-Land
//       fr: Pays par défaut
//       zh: 默认国家
//       ja: デフォルト国
//       it: Paese predefinito
//       es: País por defecto
//       nl: Standaard land
//       pl: Domyślny kraj
//       pt-br: País padrão
//       ko: 기본 국가
//       vi: Quốc gia mặc định
//       tr: Varsayılan ülke
//       sk: Predvolená krajina
//       da: Standardland
//     values: [RU, US, DE, GB, FR, CN, JP, IT, ES, NL, SE, NO, AU, CA, BR, MX, KR, IN, TH, PL, TR, SK, DK, AT, CH, BE, IE, PT, GR, FI, CZ, HU, RO, BG, HR, SI, LT, LV, EE, CY, MT, LU]
//     value labels: ["🇷🇺 Россия", "🇺🇸 United States", "🇩🇪 Deutschland", "🇬🇧 United Kingdom", "🇫🇷 France", "🇨🇳 中国", "🇯🇵 日本", "🇮🇹 Italia", "🇪🇸 España", "🇳🇱 Nederland", "🇸🇪 Sverige", "🇳🇴 Norge", "🇦🇺 Australia", "🇨🇦 Canada", "🇧🇷 Brasil", "🇲🇽 México", "🇰🇷 대한민국", "🇮🇳 भारत", "🇹🇭 ประเทศไทย", "🇵🇱 Polska", "🇹🇷 Türkiye", "🇸🇰 Slovensko", "🇩🇰 Danmark", "🇦🇹 Österreich", "🇨🇭 Schweiz", "🇧🇪 België", "🇮🇪 Éire", "🇵🇹 Portugal", "🇬🇷 Ελλάδα", "🇫🇮 Suomi", "🇨🇿 Česko", "🇭🇺 Magyarország", "🇷🇴 România", "🇧🇬 България", "🇭🇷 Hrvatska", "🇸🇮 Slovenija", "🇱🇹 Lietuva", "🇱🇻 Latvija", "🇪🇪 Eesti", "🇨🇾 Κύπρος", "🇲🇹 Malta", "🇱🇺 Lëtzebuerg"]
//     default value: RU
//   - identifier: docFormat
//     type: multiple
//     label:
//       ru: Формат документов
//       en: Document Format
//       de: Dokumentformat
//       fr: Format document
//       zh: 文档格式
//       ja: ドキュメント形式
//       it: Formato documento
//       es: Formato documento
//       nl: Documentformaat
//       pl: Format dokumentu
//       pt-br: Formato documento
//       ko: 문서 형식
//       vi: Định dạng
//       tr: Belge biçimi
//       sk: Formát dokumentu
//       da: Dokumentformat
//     values: [intl, natl]
//     value labels: ["🌐 +7 123 456 78 90", "🏠 8 (123) 456-78-90"]
//     default value: intl
//   - identifier: showContact
//     type: boolean
//     label:
//       ru: E.164 (контакт)
//       en: E.164 (contact)
//       de: E.164 (Kontakt)
//       fr: E.164 (contact)
//       zh: E.164（联系人）
//       ja: E.164（連絡先）
//       it: E.164 (contatto)
//       es: E.164 (contacto)
//       nl: E.164 (contact)
//       pl: E.164 (kontakt)
//       pt-br: E.164 (contato)
//       ko: E.164 (연락처)
//       vi: E.164 (liên hệ)
//       tr: E.164 (kişi)
//       sk: E.164 (kontakt)
//       da: E.164 (kontakt)
//     default value: true
//   - identifier: showDocument
//     type: boolean
//     label:
//       ru: E.123 (документ)
//       en: E.123 (document)
//       de: E.123 (Dokument)
//       fr: E.123 (document)
//       zh: E.123（文档）
//       ja: E.123（文書）
//       it: E.123 (documento)
//       es: E.123 (documento)
//       nl: E.123 (document)
//       pl: E.123 (dokument)
//       pt-br: E.123 (documento)
//       ko: E.123 (문서)
//       vi: E.123 (tài liệu)
//       tr: E.123 (belge)
//       sk: E.123 (dokument)
//       da: E.123 (dokument)
//     default value: true
//   - identifier: showWeb
//     type: boolean
//     label:
//       ru: RFC 3966 (веб)
//       en: RFC 3966 (web)
//       de: RFC 3966 (Web)
//       fr: RFC 3966 (web)
//       zh: RFC 3966（网页）
//       ja: RFC 3966（ウェブ）
//       it: RFC 3966 (web)
//       es: RFC 3966 (web)
//       nl: RFC 3966 (web)
//       pl: RFC 3966 (sieć)
//       pt-br: RFC 3966 (web)
//       ko: RFC 3966 (웹)
//       vi: RFC 3966 (web)
//       tr: RFC 3966 (web)
//       sk: RFC 3966 (web)
//       da: RFC 3966 (web)
//     default value: true

"use strict";

// Architecture: libphonenumber-max (bundled IIFE, offline-first) is the
// authority for parse/validate/format. #manualNormalize covers only what
// lib rejects (trunk prefixes, 00 IDD prefix). format() null-states:
// short input → unparseable main → non-E.164 → spec-guard fail.
// Outputs: contact = E.164, document = E.123, gost = +7 (XXX) XXX-XX-XX,
// web = RFC 3966 tel: URI. Tests: node test/phonefmt.test.js [SEED=..].

const libPhone = (() => {
    try {
        // Bundle footer also assigns module.exports, so require returns it directly.
        // @ts-ignore the bundle is a plain IIFE, not a module
        const lib = /** @type {any} */ (require("./libphonenumber-max.js"));
        return lib?.parsePhoneNumber ? lib :
            lib?.libphonenumber?.parsePhoneNumber ? lib.libphonenumber :
                lib?.default?.parsePhoneNumber ? lib.default :
                    lib?.default?.libphonenumber?.parsePhoneNumber ? lib.default.libphonenumber :
                        null;
    } catch { return null; }
})();

const COUNTRY = {
    RU: { nationalLength: 10, code: '+7', nationalPrefix: '8' },
    US: { nationalLength: 10, code: '+1', nationalPrefix: '1' },
    CA: { nationalLength: 10, code: '+1', nationalPrefix: '1' },
    DE: { nationalLength: [8, 9, 10, 11], code: '+49', nationalPrefix: '0' },
    GB: { nationalLength: [9, 10, 11], code: '+44', nationalPrefix: '0' },
    FR: { nationalLength: 9, code: '+33', nationalPrefix: '0' },
    CN: { nationalLength: [8, 10, 11], code: '+86', nationalPrefix: '0' },
    JP: { nationalLength: [9, 10, 11], code: '+81', nationalPrefix: '0' },
    IT: { nationalLength: [9, 10, 11], code: '+39' },
    ES: { nationalLength: 9, code: '+34', nationalPrefix: '0' },
    NL: { nationalLength: [8, 9], code: '+31', nationalPrefix: '0' },
    SE: { nationalLength: [7, 8, 9], code: '+46', nationalPrefix: '0' },
    NO: { nationalLength: 8, code: '+47' },
    DK: { nationalLength: 8, code: '+45' },
    AT: { nationalLength: [8, 9, 10, 11, 12, 13], code: '+43', nationalPrefix: '0' },
    CH: { nationalLength: 9, code: '+41', nationalPrefix: '0' },
    BE: { nationalLength: [8, 9], code: '+32', nationalPrefix: '0' },
    IE: { nationalLength: [8, 9], code: '+353', nationalPrefix: '0' },
    PT: { nationalLength: 9, code: '+351', nationalPrefix: '0' },
    GR: { nationalLength: 10, code: '+30' },
    FI: { nationalLength: [8, 9], code: '+358', nationalPrefix: '0' },
    CZ: { nationalLength: 9, code: '+420' },
    HU: { nationalLength: [8, 9], code: '+36', nationalPrefix: '06' },
    PL: { nationalLength: [8, 9], code: '+48' },
    RO: { nationalLength: 9, code: '+40', nationalPrefix: '0' },
    BG: { nationalLength: [8, 9], code: '+359', nationalPrefix: '0' },
    HR: { nationalLength: [8, 9], code: '+385', nationalPrefix: '0' },
    SI: { nationalLength: 8, code: '+386', nationalPrefix: '0' },
    SK: { nationalLength: 9, code: '+421', nationalPrefix: '0' },
    LT: { nationalLength: 8, code: '+370', nationalPrefix: '8' },
    LV: { nationalLength: 8, code: '+371' },
    EE: { nationalLength: [7, 8], code: '+372' },
    CY: { nationalLength: 8, code: '+357' },
    MT: { nationalLength: 8, code: '+356' },
    LU: { nationalLength: [8, 9], code: '+352' },
    TR: { nationalLength: 10, code: '+90', nationalPrefix: '0' },
    AU: { nationalLength: 9, code: '+61', nationalPrefix: '0' },
    BR: { nationalLength: [8, 10, 11], code: '+55', nationalPrefix: '0' },
    MX: { nationalLength: [10, 11], code: '+52', nationalPrefix: '01' },
    KR: { nationalLength: [8, 9, 10], code: '+82', nationalPrefix: '0' },
    IN: { nationalLength: 10, code: '+91', nationalPrefix: '0' },
    TH: { nationalLength: [8, 9], code: '+66', nationalPrefix: '0' },
};

const VALID_CODES = new Set([
    '+1', '+7', '+20', '+27', '+30', '+31', '+32', '+33', '+34', '+36', '+39', '+40', '+41', '+43',
    '+44', '+45', '+46', '+47', '+48', '+49', '+51', '+52', '+53', '+54', '+55', '+56', '+57', '+58',
    '+60', '+61', '+62', '+63', '+64', '+65', '+66', '+81', '+82', '+84', '+86', '+90', '+91', '+92',
    '+93', '+94', '+95', '+98', '+211', '+212', '+213', '+216', '+218', '+220', '+221', '+222', '+223', '+224',
    '+225', '+226', '+227', '+228', '+229', '+230', '+231', '+232', '+233', '+234', '+235', '+236',
    '+237', '+238', '+239', '+240', '+241', '+242', '+243', '+244', '+245', '+246', '+247', '+248', '+249',
    '+250', '+251', '+252', '+253', '+254', '+255', '+256', '+257', '+258', '+260', '+261', '+262',
    '+263', '+264', '+265', '+266', '+267', '+268', '+269', '+290', '+291', '+297', '+298', '+299',
    '+350', '+351', '+352', '+353', '+354', '+355', '+356', '+357', '+358', '+359', '+370', '+371',
    '+372', '+373', '+374', '+375', '+376', '+377', '+378', '+380', '+381', '+382', '+383',
    '+385', '+386', '+387', '+389', '+420', '+421', '+423', '+500', '+501', '+502', '+503', '+504',
    '+505', '+506', '+507', '+508', '+509', '+590', '+591', '+592', '+593', '+594', '+595', '+596',
    '+597', '+598', '+599', '+670', '+672', '+673', '+674', '+675', '+676', '+677', '+678', '+679',
    '+680', '+681', '+682', '+683', '+685', '+686', '+687', '+688', '+689', '+690', '+691',
    '+692', '+850', '+852', '+853', '+855', '+856', '+880', '+886', '+960', '+961', '+962', '+963',
    '+964', '+965', '+966', '+967', '+968', '+970', '+971', '+972', '+973', '+974', '+975', '+976',
    '+977', '+992', '+993', '+994', '+995', '+996', '+998'
]);

const EXT_LABEL = {
    RU: 'доб.', US: 'ext.', CA: 'ext.', GB: 'ext.',
    DE: 'Durchwahl', FR: 'poste', CN: '分机', JP: '内線',
    IT: 'int.', ES: 'ext.', NL: 'tst.', SE: 'anknr',
    NO: 'lnr', DK: 'lok.', AT: 'DW', CH: 'App.',
    BE: 'ext.', IE: 'ext.', PT: 'ext.', GR: 'εσωτ.',
    FI: 'alanumero', CZ: 'linka', HU: 'mellék', PL: 'wew.',
    RO: 'int.', BG: 'вт.', HR: 'lok.', SI: 'int.',
    SK: 'linka', LT: 'vidinis', LV: 'iekš.', EE: 'lisa',
    CY: 'εσωτ.', MT: 'est.', LU: 'poste', TR: 'dahili',
    AU: 'ext.', BR: 'ramal', MX: 'ext.', KR: '내선',
    IN: 'ext.', TH: 'ต่อ'
};

// Single source of truth for extension keywords (longer words first where one
// is a prefix of another). Used by EXT_PATTERNS, PHONE_PATTERN, and findAll.
const EXT_KEYWORDS = String.raw`extension|extn|durchwahl|добавочный|alanumero|vidinis|interno|anknr|poste|内線|分机|mellék|linka|wew\.?|вт\.?|iekš\.?|lisa|ramal|ext\.?|int\.?|tst\.?|lok\.?|dahili|εσωτ\.?|DW|App\.?|lnr|доб\.?|uitb\.?|est\.?`;

const EXT_PATTERNS = [
    /^tel:([+\d\-\(\)\s]+);ext(?:ension)?=(\d+)$/i,
    /^(.+?)\s*[,;]\s*ext(?:ension)?\s*=\s*(\d+)\)?$/i,
    /(.+?)[,;]\s*(\d+)\)?$/,
    new RegExp(String.raw`(.+?)\s+\(?\s*(?:${EXT_KEYWORDS})\s*[:=]?\s*(\d+)\)?$`, 'i'),
    /(.+?)\s*[x#*]\s*(\d+)\)?$/i
];

// Date-, IP-, decimal-, and thousands-like strings are not phones.
const PHONE_PATTERN = String.raw`(?:tel:)?(?:(?:\+?\d|\(\+?\d)[\d\s\-\(\)\.\/]{5,}\d)(?:\s*(?:;ext(?:ension)?=|(?:\s*[,;]\s*|\s+)(?:${EXT_KEYWORDS}|#|x)\s*[:=]?\s*|\s*[,;]\s*[:=]?\s*|["']?[x#*]\s*)\d{2,6}(?![\d.\/]))?`;
const PHONE_REGEX = new RegExp(PHONE_PATTERN, 'i');
const NON_PHONE_TEXT = /^(?:tel:)?\s*(?:(?:\d{1,4}\.){3}\d{1,4}|(?:\d{1,4}\.){5,}\d{1,4}|\d{1,4}[-.\/]\d{1,2}[-.\/]\d{1,4}|\d{1,3}(?:[.\/]\d{3})+|\+?\d{1,6}[.\/]\d{1,6})$/i;
const isNonPhoneText = (value) => NON_PHONE_TEXT.test(String(value).replace(/\s+/g, ''));
const digitCount = (value) => (String(value).match(/\d/g) || []).length;

function hasPhoneMatch(text) {
    const regex = new RegExp(PHONE_REGEX.source, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
        if (digitCount(match[0]) < MIN_PHONE_DIGITS || isNonPhoneText(match[0])) continue;
        return true;
    }
    return false;
}

const MIN_PHONE_DIGITS = 7;
const MAX_INPUT_LENGTH = 4096;
const DEFAULT_COUNTRY = 'RU';

// Unknown country values must behave the same in the menu and the formatter.
function normalizeCountry(value) {
    const country = String(value || DEFAULT_COUNTRY).toUpperCase();
    return COUNTRY[country] ? country : DEFAULT_COUNTRY;
}

const RUSSIAN_AREA_CODES = new Set([
    '495', '499', '496', '498', '812', '813', '900', '901', '902', '903', '904', '905', '906', '907', '908', '909', '910', '911', '912', '913', '914', '915', '916', '917', '918', '919', '920', '921', '922', '923', '924', '925', '926', '927', '928', '929', '930', '931', '932', '933', '934', '936', '937', '938', '939', '950', '951', '952', '953', '954', '955', '956', '957', '958', '959', '960', '961', '962', '963', '964', '965', '966', '967', '968', '969', '970', '971', '977', '978', '980', '981', '982', '983', '984', '985', '986', '987', '988', '989', '990', '991', '992', '993', '994', '995', '996', '997', '998', '999', '301', '302', '303', '304', '305', '306', '307', '308', '309', '331', '332', '333', '334', '335', '336', '337', '338', '339', '341', '342', '343', '344', '345', '346', '347', '348', '349', '351', '352', '353', '354', '365', '367', '368', '369', '381', '382', '383', '384', '385', '387', '388', '390', '391', '394', '395', '401', '411', '412', '413', '414', '415', '416', '417', '421', '423', '424', '426', '427', '471', '472', '473', '474', '475', '481', '482', '483', '484', '485', '486', '487', '491', '492', '493', '494', '496', '497', '498', '811', '814', '815', '816', '817', '818', '821', '822', '831', '833', '834', '835', '836', '841', '842', '844', '845', '846', '848', '851', '852', '854', '855', '861', '862', '863', '865', '866', '867', '869', '871', '872', '873', '877', '878', '879', '881', '882', '883', '884', '885', '886', '887', '891', '892', '893', '894', '896'
]);

class PhoneFormatter {
    #country;
    #cfg;
    #extLabel;
    #docFormat;

    constructor(country, docFormat) {
        this.#country = normalizeCountry(country);
        this.#cfg = COUNTRY[this.#country];
        this.#extLabel = EXT_LABEL[this.#country] || 'ext.';
        this.#docFormat = docFormat === 'natl' ? 'natl' : 'intl';
    }

    format(input, type) {
        if (!PhoneParser.hasEnoughDigits(input)) return null;
        const { main, ext } = PhoneParser.parse(input);
        if (!main) return null;
        const e164 = this.#toE164(main);
        if (!e164) return null;
        const formatted = this.#formatByType(e164, type);
        if (!formatted) return null;
        const out = formatted + this.#formatExtension(ext, type);
        if (!this.#isValidOutput(out, type)) return null;
        return out;
    }

    // Runtime guard: strict specs get strict validation before paste.
    // contact = E.164 (max 15 digits), web = RFC 3966 tel URI.
    #isValidOutput(out, type) {
        if (type === 'contact') return /^\+[1-9]\d{6,14}(,\d{2,6})?$/.test(out);
        if (type === 'web') return /^tel:\+[1-9]\d{6,14}(;ext=\d{2,6})?$/.test(out);
        return true;
    }

    formatMultiple(input, type) {
        const lines = input.split(/\r?\n/);
        const singleLine = lines.length === 1;
        const results = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) { results.push(''); continue; }
            const numbers = PhoneParser.findAll(trimmed, this.#country);
            const raw = singleLine ? '' : trimmed;
            if (numbers.length === 0) {
                results.push(this.format(trimmed, type) || raw);
            } else if (numbers.length === 1) {
                results.push(this.format(numbers[0].originalText, type) || raw);
            } else {
                const formatted = numbers.map(n => this.format(n.originalText, type)).filter(Boolean);
                results.push(formatted.length > 0 ? formatted.join(', ') : raw);
            }
        }
        return results.join('\n');
    }

    #toE164(num) {
        let clean = num.replace(/[^\d+]/g, '').replace(/^[+]+/, '+');

        if (/^00\d+$/.test(clean)) {
            const plus = '+' + clean.slice(2);
            if (libPhone) {
                try {
                    const p = libPhone.parsePhoneNumber(plus);
                    if (p?.isValid()) return p.format('E.164');
                } catch { }
            }
            clean = plus;
        }

        // National trunk prefix (0, 8, 01, 06) is not part of the number.
        let trunkStripped = false;
        const trunk = this.#cfg.nationalPrefix;
        if (!clean.startsWith('+') && trunk && clean.startsWith(trunk)) {
            const national = clean.slice(trunk.length);
            const fixed = this.#country === 'RU' || this.#country === 'US' || this.#country === 'CA';
            if (fixed ? national.length === 10 : national.length >= 6 && national.length <= 14) {
                clean = national; trunkStripped = true;
            }
        }

        if (this.#country === 'RU') {
            if (clean.length === 12 && clean.startsWith('78')) {
                const area = clean.substring(2, 5);
                if (RUSSIAN_AREA_CODES.has(area)) clean = '+7' + clean.substring(2);
            }
            if (clean.length === 12 && clean.startsWith('77')) {
                const area = clean.substring(2, 5);
                if (RUSSIAN_AREA_CODES.has(area)) clean = '+7' + clean.substring(2);
            }
            if (clean.length === 12 && clean.startsWith('87')) {
                clean = '+7' + clean.substring(2);
            }
        }

        if (libPhone) {
            return this.#tryParseLib(clean);
        }
        return this.#manualNormalize(clean, trunkStripped);
    }

    #tryParseLib(clean) {
        try {
            const parsed = libPhone.parsePhoneNumber(clean, clean.startsWith('+') ? undefined : this.#country);
            if (parsed?.isValid()) return parsed.format('E.164');
        } catch { }
        return null;
    }

    #manualNormalize(clean, trunkStripped = false) {
        if (!clean) return null;
        const { code, nationalPrefix } = this.#cfg;
        const codeDigits = code.replace('+', '');

        if (clean.startsWith(code)) {
            const nationalLength = clean.length - code.length;
            const fixed = this.#country === 'RU' || this.#country === 'US' || this.#country === 'CA';
            return (fixed ? nationalLength === 10 : nationalLength >= 4 && nationalLength <= 14) ? clean : null;
        }

        if (clean.startsWith('+')) {
            const digits = clean.slice(1);
            const extracted = this.#extractCallingCode(digits);
            if (!extracted || !VALID_CODES.has(extracted)) return null;
            const nationalLength = digits.length - (extracted.length - 1);
            // +1 and +7 are fixed-length; other country tables are menu heuristics
            // and would reject valid short numbers (e.g. +81 3 xxxx xxxx).
            if ((extracted === '+1' || extracted === '+7') && nationalLength !== 10) return null;
            return nationalLength >= 4 && nationalLength <= 14 ? clean : null;
        }

        if (trunkStripped) {
            const fixed = this.#country === 'RU' || this.#country === 'US' || this.#country === 'CA';
            if (fixed ? clean.length === 10 : clean.length >= 4 && clean.length <= 14) return code + clean;
        }

        if (this.#country === 'US' || this.#country === 'CA') {
            if (clean.length === 10) return '+1' + clean;
            if (clean.length === 11 && clean.startsWith('1')) return '+' + clean;
        }

        if (!trunkStripped && clean.startsWith(codeDigits)) {
            const national = clean.slice(codeDigits.length);
            if (this.#isValidLength(national.length)) return '+' + clean;
        }

        if (nationalPrefix && clean.startsWith(nationalPrefix)) {
            const national = clean.substring(nationalPrefix.length);
            if (national.startsWith(codeDigits) && this.#isValidLength(national.length - 1)) return '+' + national;
            if (this.#isValidLength(national.length)) return code + national;
        }

        if (this.#isValidLength(clean.length)) return code + clean;
        return null;
    }

    #extractCallingCode(digits) {
        for (let len = 3; len >= 1; len--) {
            const code = '+' + digits.substring(0, len);
            if (VALID_CODES.has(code)) return code;
        }
        return null;
    }

    #isValidLength(len) {
        const cl = this.#cfg.nationalLength;
        return Array.isArray(cl) ? cl.includes(len) : len === cl;
    }

    #formatByType(e164, type) {
        switch (type) {
            case 'contact': return e164;
            case 'document': return this.#formatDocument(e164);
            case 'gost': return this.#formatGost(e164);
            case 'web': return `tel:${e164}`;
            default: return e164;
        }
    }

    #formatDocument(e164) {
        if (libPhone) {
            try {
                const parsed = libPhone.parsePhoneNumber(e164);
                if (parsed) return this.#docFormat === 'natl' ? parsed.formatNational() : parsed.formatInternational();
            } catch { }
        }
        return this.#manualFormatDocument(e164);
    }

    #formatGost(e164) {
        if (libPhone) {
            try {
                const parsed = libPhone.parsePhoneNumber(e164);
                if (parsed) {
                    const national = parsed.formatNational();
                    const country = parsed.country;
                    if (country === 'RU') {
                        const num = national.replace(/[^\d]/g, '');
                        if (num.length === 11 && num.startsWith('8')) {
                            return `+7 (${num.slice(1, 4)}) ${num.slice(4, 7)}-${num.slice(7, 9)}-${num.slice(9)}`;
                        }
                    }
                    return this.#manualFormatGost(e164);
                }
            } catch { }
        }
        return this.#manualFormatGost(e164);
    }

    #manualFormatGost(e164) {
        const code = this.#extractCallingCode(e164.replace('+', ''));
        if (!code) return e164;
        const national = e164.slice(code.length);
        if (code === '+7' && national.length === 10) {
            return `+7 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6, 8)}-${national.slice(8)}`;
        }
        if (code === '+1' && national.length === 10) {
            return `+1 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
        }
        if (code === '+49' && national.length >= 10) {
            return `+${code.replace('+', '')} ${national.slice(0, 2)} ${national.slice(2)}`;
        }
        return this.#manualFormatDocument(e164);
    }

    #manualFormatDocument(e164) {
        const code = this.#extractCallingCode(e164.replace('+', ''));
        if (!code) return e164;
        const national = e164.slice(code.length);
        if (this.#docFormat === 'natl') {
            if (code === '+7' && national.length === 10) return `8 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6, 8)}-${national.slice(8)}`;
            if (code === '+1' && national.length === 10) return `(${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
            const entry = Object.values(COUNTRY).find(c => c.code === code);
            // shortcut: digits are correct but trunk is glued on without area-code
            // grouping (no subnet tables here); upgrade if no-lib users complain
            return (entry?.nationalPrefix || '') + national;
        }
        if (code === '+7' && national.length === 10) return `+7 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6, 8)} ${national.slice(8)}`;
        if (code === '+1' && national.length === 10) return `+1 ${national.slice(0, 3)} ${national.slice(3, 6)}-${national.slice(6)}`;
        return `${code} ${national}`;
    }

    #formatExtension(ext, type) {
        if (!ext) return '';
        const digits = String(ext).replace(/[^\d]/g, '');
        if (digits.length < 2 || digits.length > 6) return '';
        switch (type) {
            case 'contact': return `,${digits}`;
            case 'document': return ` ${this.#extLabel} ${digits}`;
            case 'gost': return `, ${this.#extLabel} ${digits}`;
            case 'web': return `;ext=${digits}`;
            default: return `,${digits}`;
        }
    }
}

class PhoneParser {
    static parse(input) {
        if (!input || typeof input !== 'string') return { main: '', ext: null };
        let text = input.trim();
        if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'")))
            text = text.slice(1, -1);
        // Collapse whitespace before extension matching: the lazy keyword pattern is
        // catastrophic on long runs of spaces otherwise.
        text = text.replace(/\s+/g, ' ');
        const isTel = text.toLowerCase().startsWith('tel:');
        if (!isTel) text = text.replace(/^[^\d+]+/, '');
        let foundExt = null;
        for (const pattern of EXT_PATTERNS) {
            const match = text.match(pattern);
            if (match) { text = match[1].trim(); foundExt = match[2]; break; }
        }
        text = text.replace(/\s*\(\d\)\s*$/, '')
            .replace(/\s*[\(\[\{][^0-9+\)\]\}]*[\)\]\}]\s*/g, ' ')
            .replace(/\s+/g, ' ').trim();
        if (isTel && text.toLowerCase().startsWith('tel:')) text = text.slice(4).trim();
        return { main: text, ext: foundExt };
    }

    static findAll(text, defaultCountry) {
        if (libPhone?.findPhoneNumbersInText) {
            try {
                const found = libPhone.findPhoneNumbersInText(text, defaultCountry);
                // libphonenumber can swallow the next number of a comma/semicolon
                // list as a bogus extension (>6 digits); rescanning manually handles lists.
                const bogusExt = found.some(item =>
                    (String(item.number?.ext || '').match(/\d/g) || []).length > 6);
                if (found.length && !bogusExt) return found.map(item => {
                    let s = item.startsAt, e = item.endsAt;
                    if (s >= 4 && text.substring(s - 4, s).toLowerCase() === 'tel:') s -= 4;
                    const after = text.substring(e, e + 30);
                    const extMatch = after.match(new RegExp(String.raw`^(?:;ext(?:ension)?=\s*|["']?\s*(?:[,;]\s*[:=]?\s*|\s+)\(?\s*(?:${EXT_KEYWORDS}|[x#*])\s*[:=]?\s*|["']?\s*[,;]\s*[:=]?\s*|["']?[x#*]\s*)(\d{2,6})\)?`, 'i'));
                    if (extMatch) e += extMatch[0].length;
                    return { number: item.number?.number || '', startsAt: s, endsAt: e, ext: item.number?.ext || extMatch?.[1] || null, originalText: text.substring(s, e) };
                });
            } catch { }
        }
        const results = [];
        const add = (raw, at) => {
            const { main, ext } = this.parse(raw);
            results.push({ number: main, startsAt: at, endsAt: at + raw.length, ext, originalText: raw });
        };
        const regex = new RegExp(PHONE_REGEX.source, 'gi');
        let match;
        while ((match = regex.exec(text)) !== null) {
            if (digitCount(match[0]) < MIN_PHONE_DIGITS || isNonPhoneText(match[0])) continue;
            // Slash is both a digit separator (+7/495/...) and a list separator.
            // Split only when every slash-separated chunk is a full number.
            const chunks = match[0].split(/\s*\/\s*/).filter(chunk => /\d/.test(chunk));
            if (chunks.length > 1 && chunks.every(chunk => this.hasEnoughDigits(chunk))) {
                for (const chunk of chunks) add(chunk, match.index);
                continue;
            }
            add(match[0], match.index);
        }
        return results;
    }

    static hasEnoughDigits(input) {
        return (input.match(/\d/g) || []).length >= MIN_PHONE_DIGITS;
    }
}

const ACTION_TITLES = {
    contact: { ru: "📱 Контакты", en: "📱 Contacts", de: "📱 Kontakte", fr: "📱 Contacts", zh: "📱 联系人", ja: "📱 連絡先", it: "📱 Contatti", es: "📱 Contactos", nl: "📱 Contacten", pl: "📱 Kontakty", "pt-br": "📱 Contatos", ko: "📱 연락처", vi: "📱 Danh bạ", tr: "📱 Kişiler", sk: "📱 Kontakty", da: "📱 Kontakter" },
    document: { ru: "📄 Документы", en: "📄 Documents", de: "📄 Dokumente", fr: "📄 Documents", zh: "📄 文档", ja: "📄 文書", it: "📄 Documenti", es: "📄 Documentos", nl: "📄 Documenten", pl: "📄 Dokumenty", "pt-br": "📄 Documentos", ko: "📄 문서", vi: "📄 Tài liệu", tr: "📄 Belgeler", sk: "📄 Dokumenty", da: "📄 Dokumenter" },
    gost: { ru: "🇷🇺 ГОСТ", en: "🇷🇺 GOST", de: "🇷🇺 GOST", fr: "🇷🇺 GOST", zh: "🇷🇺 ГОСТ", ja: "🇷🇺 GOST", it: "🇷🇺 GOST", es: "🇷🇺 GOST", nl: "🇷🇺 GOST", pl: "🇷🇺 GOST", "pt-br": "🇷🇺 GOST", ko: "🇷🇺 GOST", vi: "🇷🇺 GOST", tr: "🇷🇺 GOST", sk: "🇷🇺 GOST", da: "🇷🇺 GOST" },
    web: { ru: "🌐 Веб", en: "🌐 Web", de: "🌐 Web", fr: "🌐 Web", zh: "🌐 网页", ja: "🌐 ウェブ", it: "🌐 Web", es: "🌐 Web", nl: "🌐 Web", pl: "🌐 Sieć", "pt-br": "🌐 Web", ko: "🌐 웹", vi: "🌐 Web", tr: "🌐 Web", sk: "🌐 Web", da: "🌐 Web" }
};

const ACTION_ICONS = {
    contact: "iconify:tabler:address-book",
    document: "iconify:tabler:file-text",
    gost: "iconify:tabler:phone-spark",
    web: "iconify:tabler:world"
};

function makeAction(type) {
    return {
        title: ACTION_TITLES[type],
        icon: ACTION_ICONS[type],
        regex: PHONE_REGEX,
        code: function (input, options) {
            if ((input?.text || '').length > MAX_INPUT_LENGTH) return;
            if (type === 'gost' && normalizeCountry(options?.country) !== 'RU') return;
            try {
                const country = options?.country || 'RU';
                let fmt = options?.docFormat || 'intl';
                if (type === 'document' && popclip.modifiers?.option) fmt = fmt === 'intl' ? 'natl' : 'intl';
                const result = new PhoneFormatter(country, fmt).formatMultiple(input.text, type);
                if (result) {
                    if (popclip.showSuccess) popclip.showSuccess();
                    return result;
                }
            } catch { }
            return undefined;
        }
    };
}

// Dynamic actions: only the formats enabled in Settings appear.
// GOST is a RU-only notation: it is shown whenever the country is RU.
const FORMATS = ['contact', 'document', 'gost', 'web'];
const FORMAT_OPTIONS = {
    contact: 'showContact',
    document: 'showDocument',
    web: 'showWeb'
};

function enabledFormats(options) {
    const country = normalizeCountry(options?.country);
    return FORMATS.filter(type =>
        type === 'gost' ? country === 'RU' : options?.[FORMAT_OPTIONS[type]] !== false
    );
}

function populateActions(input, options) {
    const text = input?.text || '';
    if (text.length > MAX_INPUT_LENGTH || isNonPhoneText(text) || !hasPhoneMatch(text)) return;
    const enabled = enabledFormats(options);
    if (!enabled.length) return;
    if (enabled.length === 1) return makeAction(enabled[0]);
    return [{
        title: {
            ru: "📞 Телефон", en: "📞 Phone", de: "📞 Telefon", fr: "📞 Téléphone",
            zh: "📞 电话", ja: "📞 電話", it: "📞 Telefono", es: "📞 Teléfono",
            nl: "📞 Telefoon", pl: "📞 Telefon", "pt-br": "📞 Telefone", ko: "📞 전화",
            vi: "📞 Điện thoại", tr: "📞 Telefon", sk: "📞 Telefón", da: "📞 Telefon"
        },
        icon: "iconify:tabler:phone-check",
        submenu: enabled.map(makeAction)
    }];
}

module.exports = {
    actions: populateActions,
    // exported for tests only; PopClip only consumes `actions`
    VALID_CODES
};
