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
// icon: iconify:tabler:phone
// popclip version: 4200
// requirements: [text]
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

"use strict";

// Architecture: libphonenumber-max (bundled UMD, offline-first) is the
// authority for parse/validate/format. #manualNormalize covers only what
// lib rejects (trunk prefixes, 00 IDD prefix). format() null-states:
// short input → unparseable main → non-E.164 → spec-guard fail.
// Outputs: contact = E.164, document = E.123, gost = +7 (XXX) XXX-XX-XX,
// web = RFC 3966 tel: URI. Tests: node test/phonefmt.test.js [SEED=..].

const libPhone = (() => {
    try {
        const lib = require("./libphonenumber-max.js");
        return lib?.parsePhoneNumber ? lib :
               lib?.libphonenumber?.parsePhoneNumber ? lib.libphonenumber :
               lib?.default?.parsePhoneNumber ? lib.default :
               lib?.default?.libphonenumber?.parsePhoneNumber ? lib.default.libphonenumber :
               null;
    } catch { return null; }
})();

const COUNTRY = {
    RU: { nationalLength: 10, extLength: [2, 6], code: '+7', nationalPrefix: '8' },
    US: { nationalLength: 10, extLength: [2, 6], code: '+1', nationalPrefix: '1' },
    CA: { nationalLength: 10, extLength: [2, 6], code: '+1', nationalPrefix: '1' },
    DE: { nationalLength: [10, 11], extLength: [2, 5], code: '+49', nationalPrefix: '0' },
    GB: { nationalLength: [10, 11], extLength: [2, 5], code: '+44', nationalPrefix: '0' },
    FR: { nationalLength: 9, extLength: [2, 4], code: '+33', nationalPrefix: '0' },
    CN: { nationalLength: 11, extLength: [2, 5], code: '+86', nationalPrefix: '0' },
    JP: { nationalLength: [10, 11], extLength: [2, 4], code: '+81', nationalPrefix: '0' },
    IT: { nationalLength: [9, 10, 11], extLength: [2, 4], code: '+39', nationalPrefix: '0' },
    ES: { nationalLength: 9, extLength: [2, 4], code: '+34', nationalPrefix: '0' },
    NL: { nationalLength: 9, extLength: [2, 4], code: '+31', nationalPrefix: '0' },
    SE: { nationalLength: [7, 8, 9], extLength: [2, 4], code: '+46', nationalPrefix: '0' },
    NO: { nationalLength: 8, extLength: [2, 4], code: '+47' },
    DK: { nationalLength: 8, extLength: [2, 4], code: '+45' },
    AT: { nationalLength: [9, 10, 11, 12, 13], extLength: [2, 4], code: '+43', nationalPrefix: '0' },
    CH: { nationalLength: 9, extLength: [2, 4], code: '+41', nationalPrefix: '0' },
    BE: { nationalLength: 9, extLength: [2, 4], code: '+32', nationalPrefix: '0' },
    IE: { nationalLength: 9, extLength: [2, 4], code: '+353', nationalPrefix: '0' },
    PT: { nationalLength: 9, extLength: [2, 4], code: '+351', nationalPrefix: '0' },
    GR: { nationalLength: 10, extLength: [2, 4], code: '+30' },
    FI: { nationalLength: 9, extLength: [2, 4], code: '+358', nationalPrefix: '0' },
    CZ: { nationalLength: 9, extLength: [2, 4], code: '+420' },
    HU: { nationalLength: 9, extLength: [2, 4], code: '+36', nationalPrefix: '06' },
    PL: { nationalLength: 9, extLength: [2, 4], code: '+48' },
    RO: { nationalLength: 9, extLength: [2, 4], code: '+40', nationalPrefix: '0' },
    BG: { nationalLength: [8, 9], extLength: [2, 4], code: '+359', nationalPrefix: '0' },
    HR: { nationalLength: [8, 9], extLength: [2, 4], code: '+385', nationalPrefix: '0' },
    SI: { nationalLength: 8, extLength: [2, 4], code: '+386', nationalPrefix: '0' },
    SK: { nationalLength: 9, extLength: [2, 4], code: '+421', nationalPrefix: '0' },
    LT: { nationalLength: 8, extLength: [2, 4], code: '+370', nationalPrefix: '8' },
    LV: { nationalLength: 8, extLength: [2, 4], code: '+371' },
    EE: { nationalLength: [7, 8], extLength: [2, 4], code: '+372' },
    CY: { nationalLength: 8, extLength: [2, 4], code: '+357' },
    MT: { nationalLength: 8, extLength: [2, 4], code: '+356' },
    LU: { nationalLength: 9, extLength: [2, 4], code: '+352' },
    TR: { nationalLength: 10, extLength: [2, 4], code: '+90', nationalPrefix: '0' },
    AU: { nationalLength: 9, extLength: [2, 5], code: '+61', nationalPrefix: '0' },
    BR: { nationalLength: [10, 11], extLength: [2, 5], code: '+55', nationalPrefix: '0' },
    MX: { nationalLength: [10, 11], extLength: [2, 4], code: '+52', nationalPrefix: '01' },
    KR: { nationalLength: [9, 10], extLength: [2, 5], code: '+82', nationalPrefix: '0' },
    IN: { nationalLength: 10, extLength: [2, 5], code: '+91', nationalPrefix: '0' },
    TH: { nationalLength: 9, extLength: [2, 4], code: '+66', nationalPrefix: '0' },
    VN: { nationalLength: [9, 10], extLength: [2, 4], code: '+84', nationalPrefix: '0' }
};

const VALID_CODES = new Set([
    '+1', '+7', '+20', '+27', '+30', '+31', '+32', '+33', '+34', '+36', '+39', '+40', '+41', '+43',
    '+44', '+45', '+46', '+47', '+48', '+49', '+51', '+52', '+53', '+54', '+55', '+56', '+57', '+58',
    '+60', '+61', '+62', '+63', '+64', '+65', '+66', '+81', '+82', '+84', '+86', '+90', '+91', '+92',
    '+93', '+94', '+95', '+98', '+212', '+213', '+216', '+218', '+220', '+221', '+222', '+223', '+224',
    '+225', '+226', '+227', '+228', '+229', '+230', '+231', '+232', '+233', '+234', '+235', '+236',
    '+237', '+238', '+239', '+240', '+241', '+242', '+243', '+244', '+245', '+246', '+248', '+249',
    '+250', '+251', '+252', '+253', '+254', '+255', '+256', '+257', '+258', '+260', '+261', '+262',
    '+263', '+264', '+265', '+266', '+267', '+268', '+269', '+290', '+291', '+297', '+298', '+299',
    '+350', '+351', '+352', '+353', '+354', '+355', '+356', '+357', '+358', '+359', '+370', '+371',
    '+372', '+373', '+374', '+375', '+376', '+377', '+378', '+379', '+380', '+381', '+382', '+383',
    '+385', '+386', '+387', '+389', '+420', '+421', '+423', '+500', '+501', '+502', '+503', '+504',
    '+505', '+506', '+507', '+508', '+509', '+590', '+591', '+592', '+593', '+594', '+595', '+596',
    '+597', '+598', '+599', '+670', '+672', '+673', '+674', '+675', '+676', '+677', '+678', '+679',
    '+680', '+681', '+682', '+683', '+684', '+685', '+686', '+687', '+688', '+689', '+690', '+691',
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
    IN: 'ext.', TH: 'ต่อ', VN: 'ext.'
};

const EXT_PATTERNS = [
    /^tel:([+\d\-\(\)\s]+);ext(?:ension)?=(\d+)$/i,
    /(.+)[,;]\s*(\d+)$/,
    /(.+)\s+(?:доб\.?|ext\.?|extension|добавочный|durchwahl|poste|分机|内線|int\.?|tst\.?|anknr|lnr|lok\.?|DW|App\.?|εσωτ\.?|alanumero|linka|mellék|wew\.?|вт\.?|vidinis|iekš\.?|lisa|est\.?|dahili|ramal|내선|ต่อ|uitb\.?|interno|extn)\s*(\d+)$/i,
    /(.+)\s*[x#*]\s*(\d+)$/i
];

const PHONE_REGEX = /(?:tel:)?(?:\+?[\d\s\-\(\)]{7,}\d)(?:\s*(?:;ext(?:ension)?=|(?:\s*[,;]\s*|\s+)(?:доб\.?|ext\.?|durchwahl|poste|分机|内線|int\.?|tst\.?|anknr|lnr|lok\.?|DW|App\.?|εσωτ\.?|alanumero|linka|mellék|wew\.?|вт\.?|vidinis|iekš\.?|lisa|est\.?|dahili|ramal|내선|ต่อ|uitb\.?|interno|extn|#|x)\s*[:=]?\s*|\s*[,;]\s*[:=]?\s*)\d{2,6})?/i;

const MIN_PHONE_DIGITS = 7;
const DEFAULT_COUNTRY = 'RU';

const RUSSIAN_AREA_CODES = new Set([
    '495', '499', '496', '498', '812', '813', '900', '901', '902', '903', '904', '905', '906', '907', '908', '909', '910', '911', '912', '913', '914', '915', '916', '917', '918', '919', '920', '921', '922', '923', '924', '925', '926', '927', '928', '929', '930', '931', '932', '933', '934', '936', '937', '938', '939', '950', '951', '952', '953', '954', '955', '956', '957', '958', '959', '960', '961', '962', '963', '964', '965', '966', '967', '968', '969', '970', '971', '977', '978', '980', '981', '982', '983', '984', '985', '986', '987', '988', '989', '990', '991', '992', '993', '994', '995', '996', '997', '998', '999', '301', '302', '303', '304', '305', '306', '307', '308', '309', '331', '332', '333', '334', '335', '336', '337', '338', '339', '341', '342', '343', '344', '345', '346', '347', '348', '349', '351', '352', '353', '354', '365', '367', '368', '369', '381', '382', '383', '384', '385', '387', '388', '390', '391', '394', '395', '401', '411', '412', '413', '414', '415', '416', '417', '421', '423', '424', '426', '427', '471', '472', '473', '474', '475', '481', '482', '483', '484', '485', '486', '487', '491', '492', '493', '494', '496', '497', '498', '811', '814', '815', '816', '817', '818', '821', '822', '831', '833', '834', '835', '836', '841', '842', '844', '845', '846', '848', '851', '852', '854', '855', '861', '862', '863', '865', '866', '867', '869', '871', '872', '873', '877', '878', '879', '881', '882', '883', '884', '885', '886', '887', '891', '892', '893', '894', '896'
]);

class PhoneFormatter {
    #country;
    #cfg;
    #extLabel;
    #docFormat;

    constructor(country, docFormat) {
        this.#country = String(country || DEFAULT_COUNTRY).toUpperCase();
        this.#cfg = COUNTRY[this.#country] || COUNTRY[DEFAULT_COUNTRY];
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
        const results = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) { results.push(''); continue; }
            const numbers = PhoneParser.findAll(trimmed, this.#country);
            if (numbers.length === 0) {
                results.push(this.format(trimmed, type) || trimmed);
            } else if (numbers.length === 1) {
                results.push(this.format(numbers[0].originalText, type) || trimmed);
            } else {
                const formatted = numbers.map(n => this.format(n.originalText, type)).filter(Boolean);
                results.push(formatted.length > 0 ? formatted.join(', ') : trimmed);
            }
        }
        return results.join('\n');
    }

    #toE164(num) {
        let clean = num.replace(/[^\d+]/g, '').replace(/^[+]+/, '+');

        if (/^00\d+$/.test(clean) && libPhone) {
            try {
                const plus = '+' + clean.slice(2);
                const p = libPhone.parsePhoneNumber(plus, this.#resolveCountry(plus));
                if (p?.isValid()) return p.format('E.164');
            } catch {}
        }

        if (this.#country === 'RU' || this.#country === 'KZ') {
            if (clean.length === 12 && (clean.startsWith('78') || clean.startsWith('77'))) {
                const area = clean.substring(2, 5);
                if (this.#country === 'RU' && RUSSIAN_AREA_CODES.has(area)) {
                    clean = '+' + clean.substring(1);
                }
            }
            if (clean.length === 12 && clean.startsWith('87')) {
                clean = '+7' + clean.substring(2);
            }
        }

        if (libPhone) {
            const result = this.#tryParseLib(clean);
            if (result) return result;
        }
        return this.#manualNormalize(clean);
    }

    #tryParseLib(clean) {
        try {
            const country = clean.startsWith('+') ? this.#resolveCountry(clean) : this.#country;
            const parsed = libPhone.parsePhoneNumber(clean, country);
            if (parsed?.isValid()) return parsed.format('E.164');
            if (clean.startsWith('+') && country !== this.#country) {
                const fallback = libPhone.parsePhoneNumber(clean, this.#country);
                if (fallback?.isValid()) return fallback.format('E.164');
            }
        } catch {}
        return null;
    }

    #resolveCountry(digits) {
        const clean = digits.replace(/^\+/, '');
        const raw = this.#extractCallingCode(clean);
        const code = raw ? raw.slice(1) : null;
        if (!code) return this.#country;
        if (code === '7') {
            const area = clean.substring(1, 4);
            return RUSSIAN_AREA_CODES.has(area) ? 'RU' : this.#country;
        }
        const codeToCountry = {
            '1': 'US', '7': 'RU', '20': 'EG', '27': 'ZA', '30': 'GR', '31': 'NL',
            '32': 'BE', '33': 'FR', '34': 'ES', '36': 'HU', '39': 'IT', '40': 'RO',
            '41': 'CH', '43': 'AT', '44': 'GB', '45': 'DK', '46': 'SE', '47': 'NO',
            '48': 'PL', '49': 'DE', '51': 'PE', '52': 'MX', '53': 'CU', '54': 'AR',
            '55': 'BR', '56': 'CL', '57': 'CO', '58': 'VE', '60': 'MY', '61': 'AU',
            '62': 'ID', '63': 'PH', '64': 'NZ', '65': 'SG', '66': 'TH', '81': 'JP',
            '82': 'KR', '84': 'VN', '86': 'CN', '90': 'TR', '91': 'IN', '92': 'PK',
            '93': 'AF', '94': 'LK', '95': 'MM', '98': 'IR', '212': 'MA', '213': 'DZ',
            '216': 'TN', '218': 'LY', '220': 'GM', '221': 'SN', '222': 'MR', '223': 'ML',
            '224': 'GN', '225': 'CI', '226': 'BF', '227': 'NE', '228': 'TG', '229': 'BJ',
            '230': 'MU', '231': 'SL', '232': 'SL', '233': 'GH', '234': 'NG', '235': 'TD',
            '236': 'CF', '237': 'CM', '238': 'CV', '239': 'ST', '240': 'GQ', '241': 'GA',
            '242': 'CG', '243': 'CD', '244': 'AO', '245': 'GW', '246': 'IO', '248': 'SC',
            '249': 'SD', '250': 'RW', '251': 'ET', '252': 'SO', '253': 'DJ', '254': 'KE',
            '255': 'TZ', '256': 'UG', '257': 'BI', '258': 'MZ', '260': 'ZM', '261': 'MG',
            '262': 'RE', '263': 'ZW', '264': 'NA', '265': 'MW', '266': 'LS', '267': 'BW',
            '268': 'SZ', '269': 'KM', '290': 'SH', '291': 'ER', '297': 'AW', '298': 'FO',
            '299': 'GL', '350': 'GI', '351': 'PT', '352': 'LU', '353': 'IE', '354': 'IS',
            '355': 'AL', '356': 'MT', '357': 'CY', '358': 'FI', '359': 'BG', '370': 'LT',
            '371': 'LV', '372': 'EE', '373': 'MD', '374': 'AM', '375': 'BY', '376': 'AD',
            '377': 'MC', '378': 'SM', '379': 'VA', '380': 'UA', '381': 'RS', '382': 'ME',
            '383': 'XK', '385': 'HR', '386': 'SI', '387': 'BA', '389': 'MK', '420': 'CZ',
            '421': 'SK', '423': 'LI', '500': 'FK', '501': 'BZ', '502': 'GT', '503': 'HN',
            '504': 'NI', '505': 'CR', '506': 'PA', '507': 'PA', '508': 'PM', '509': 'HT',
            '590': 'GP', '591': 'BO', '592': 'GY', '593': 'EC', '594': 'GF', '595': 'PY',
            '596': 'MQ', '597': 'SR', '598': 'UY', '599': 'CW', '670': 'TL', '672': 'AQ',
            '673': 'BN', '674': 'NR', '675': 'PG', '676': 'TO', '677': 'SB', '678': 'VU',
            '679': 'FJ', '680': 'PW', '681': 'WF', '682': 'CK', '683': 'NU', '684': 'AS',
            '685': 'WS', '686': 'KI', '687': 'NC', '688': 'TV', '689': 'PF', '690': 'TK',
            '691': 'FM', '692': 'MH', '850': 'KP', '852': 'HK', '853': 'MO', '855': 'KH',
            '856': 'LA', '880': 'BD', '886': 'TW', '960': 'MV', '961': 'LB', '962': 'JO',
            '963': 'SY', '964': 'IQ', '965': 'KW', '966': 'SA', '967': 'YE', '968': 'OM',
            '970': 'PS', '971': 'AE', '972': 'IL', '973': 'BH', '974': 'QA', '975': 'BT',
            '976': 'MN', '977': 'NP', '992': 'TJ', '993': 'TM', '994': 'AZ', '995': 'GE',
            '996': 'KG', '998': 'UZ'
        };
        if (codeToCountry[code]) return codeToCountry[code];
        return this.#country;
    }

    #manualNormalize(clean) {
        if (!clean) return null;
        const { code, nationalPrefix } = this.#cfg;
        const codeDigits = code.replace('+', '');

        if (clean.startsWith(code)) return clean;

        if (clean.startsWith('+')) {
            const extracted = this.#extractCallingCode(clean);
            return extracted && VALID_CODES.has(extracted) ? clean : null;
        }

        if (this.#country === 'US' || this.#country === 'CA') {
            if (clean.length === 10) return '+1' + clean;
            if (clean.length === 11 && clean.startsWith('1')) return '+' + clean;
        }

        if (clean.startsWith(codeDigits)) return '+' + clean;

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
            } catch {}
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
                    if (country === 'RU' || country === 'KZ') {
                        const num = national.replace(/[^\d]/g, '');
                        if (num.length === 11 && num.startsWith('8')) {
                            return `+7 (${num.slice(1,4)}) ${num.slice(4,7)}-${num.slice(7,9)}-${num.slice(9)}`;
                        }
                    }
                    return this.#manualFormatGost(e164);
                }
            } catch {}
        }
        return this.#manualFormatGost(e164);
    }

    #manualFormatGost(e164) {
        const code = this.#extractCallingCode(e164.replace('+', ''));
        if (!code) return e164;
        const national = e164.slice(code.length);
        if (code === '+7' && national.length === 10) {
            return `+7 (${national.slice(0,3)}) ${national.slice(3,6)}-${national.slice(6,8)}-${national.slice(8)}`;
        }
        if (code === '+1' && national.length === 10) {
            return `+1 (${national.slice(0,3)}) ${national.slice(3,6)}-${national.slice(6)}`;
        }
        if (code === '+49' && national.length >= 10) {
            return `+${code.replace('+','')} ${national.slice(0,2)} ${national.slice(2)}`;
        }
        return this.#manualFormatDocument(e164);
    }

    #manualFormatDocument(e164) {
        const code = this.#extractCallingCode(e164.replace('+', ''));
        if (!code) return e164;
        const national = e164.slice(code.length);
        if (this.#docFormat === 'natl') {
            if (code === '+7' && national.length === 10) return `8 (${national.slice(0,3)}) ${national.slice(3,6)}-${national.slice(6,8)}-${national.slice(8)}`;
            if (code === '+1' && national.length === 10) return `(${national.slice(0,3)}) ${national.slice(3,6)}-${national.slice(6)}`;
            return national;
        }
        if (code === '+7' && national.length === 10) return `+7 ${national.slice(0,3)} ${national.slice(3,6)} ${national.slice(6,8)} ${national.slice(8)}`;
        if (code === '+1' && national.length === 10) return `+1 ${national.slice(0,3)} ${national.slice(3,6)}-${national.slice(6)}`;
        return `${code} ${national}`;
    }

    #formatExtension(ext, type) {
        if (!ext) return '';
        const digits = String(ext).replace(/[^\d]/g, '');
        const [min, max] = this.#cfg.extLength;
        if (digits.length < min || digits.length > max) return '';
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
                return found.map(item => {
                    let s = item.startsAt, e = item.endsAt;
                    if (s >= 4 && text.substring(s - 4, s).toLowerCase() === 'tel:') s -= 4;
                    const after = text.substring(e, e + 30);
                    const extMatch = after.match(/^(?:;ext(?:ension)?=\s*|["']?\s*(?:[,;]\s*[:=]?\s*|\s+)(?:доб\.?|ext\.?|extension|durchwahl|poste|分机|内線|int\.?|tst\.?|anknr|lnr|lok\.?|DW|App\.?|εσωτ\.?|alanumero|linka|mellék|wew\.?|вт\.?|vidinis|iekš\.?|lisa|est\.?|dahili|ramal|내선|ต่อ|uitb\.?|interno|extn|[x#*])\s*[:=]?\s*|["']?\s*[,;]\s*[:=]?\s*|["']?[x#*]\s*)(\d{2,6})/i);
                    if (extMatch) e += extMatch[0].length;
                    return { number: item.number?.number || '', startsAt: s, endsAt: e, ext: item.number?.ext || extMatch?.[1] || null, originalText: text.substring(s, e) };
                });
            } catch {}
        }
        const results = [];
        const regex = new RegExp(PHONE_REGEX.source, 'gi');
        let match;
        while ((match = regex.exec(text)) !== null) {
            const { main, ext } = this.parse(match[0]);
            results.push({ number: main, startsAt: match.index, endsAt: match.index + match[0].length, ext, originalText: match[0] });
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
    gost: { ru: "📋 ГОСТ", en: "📋 GOST", de: "📋 GOST", fr: "📋 GOST", zh: "📋 国标", ja: "📋 GOST", it: "📋 GOST", es: "📋 GOST", nl: "📋 GOST", pl: "📋 GOST", "pt-br": "📋 GOST", ko: "📋 GOST", vi: "📋 GOST", tr: "📋 GOST", sk: "📋 GOST", da: "📋 GOST" },
    web: { ru: "🌐 Веб", en: "🌐 Web", de: "🌐 Web", fr: "🌐 Web", zh: "🌐 网页", ja: "🌐 ウェブ", it: "🌐 Web", es: "🌐 Web", nl: "🌐 Web", pl: "🌐 Sieć", "pt-br": "🌐 Web", ko: "🌐 웹", vi: "🌐 Web", tr: "🌐 Web", sk: "🌐 Web", da: "🌐 Web" }
};

const ACTION_ICONS = {
    contact: "iconify:tabler:address-book",
    document: "iconify:tabler:file-text",
    gost: "iconify:tabler:clipboard-check",
    web: "iconify:tabler:world"
};

function makeAction(type) {
    return {
        title: ACTION_TITLES[type],
        icon: ACTION_ICONS[type],
        regex: PHONE_REGEX,
        // GOST is a RU-only notation: hide the item unless country option is RU.
        // (requirements option-country=X needs no entitlements, unlike submenu functions)
        ...(type === 'gost' ? { requirements: ['text', 'option-country=RU'] } : {}),
        code: function(input, options) {
            try {
                const country = options?.country || 'RU';
                let fmt = options?.docFormat || 'intl';
                if (type === 'document' && popclip.modifiers?.option) fmt = fmt === 'intl' ? 'natl' : 'intl';
                const result = new PhoneFormatter(country, fmt).formatMultiple(input.text, type);
                if (result) {
                    if (popclip.showSuccess) popclip.showSuccess();
                    return result;
                }
            } catch {}
            return undefined;
        }
    };
}

module.exports = {
    actions: [{
        title: ACTION_TITLES.contact,
        icon: ACTION_ICONS.contact,
        regex: PHONE_REGEX,
        submenu: [
            makeAction('contact'),
            makeAction('document'),
            makeAction('gost'),
            makeAction('web')
        ]
    }]
};
