// #popclip
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

/**
 * PopClip Phone Formatter v2.6.0
 * 
 * Formats phone numbers to international standards:
 * - E.164: +79123456789 (machine-readable format)
 * - E.123: +7 912 345 67 89 (human-readable international)
 * - RFC 3966: tel:+79123456789;ext=123 (URI format)
 * 
 * Modifier keys:
 * - Option (⌥): Inverts document format (intl ↔ natl)
 * 
 * Architecture:
 * - libphonenumber-js is the PRIMARY authority
 * - We only clean/preprocess input for libphonenumber
 * - If libphonenumber parses but isValid=false → REJECT (not fallback)
 * - If libphonenumber throws exception → manual fallback for local formats
 * - All formatting follows libphonenumber rules
 * 
 * @author nikolalek
 * @license MIT
 * @see https://github.com/nikolalek/PopClip-Extensions-Phone-Formatter
 */

// =============================================================================
// DEPENDENCIES
// =============================================================================

let libPhone = null;
try {
    libPhone = require("libphonenumber-js.min.js");
    if (!libPhone?.parsePhoneNumber) libPhone = null;
} catch {}

// =============================================================================
// CONSTANTS
// =============================================================================

const VALID_CODES = new Set([
    '+1', '+7', '+20', '+27', '+30', '+31', '+32', '+33', '+34', '+36',
    '+39', '+40', '+41', '+43', '+44', '+45', '+46', '+47', '+48', '+49',
    '+51', '+52', '+53', '+54', '+55', '+56', '+57', '+58', '+60', '+61',
    '+62', '+63', '+64', '+65', '+66', '+81', '+82', '+84', '+86', '+90',
    '+91', '+92', '+93', '+94', '+95', '+98', '+212', '+213', '+216', '+218',
    '+220', '+221', '+222', '+223', '+224', '+225', '+226', '+227', '+228', '+229',
    '+230', '+231', '+232', '+233', '+234', '+235', '+236', '+237', '+238', '+239',
    '+240', '+241', '+242', '+243', '+244', '+245', '+246', '+248', '+249', '+250',
    '+251', '+252', '+253', '+254', '+255', '+256', '+257', '+258', '+260', '+261',
    '+262', '+263', '+264', '+265', '+266', '+267', '+268', '+269', '+290', '+291',
    '+297', '+298', '+299', '+350', '+351', '+352', '+353', '+354', '+355', '+356',
    '+357', '+358', '+359', '+370', '+371', '+372', '+373', '+374', '+375', '+376',
    '+377', '+378', '+380', '+381', '+382', '+383', '+385', '+386', '+387', '+389',
    '+420', '+421', '+423', '+500', '+501', '+502', '+503', '+504', '+505', '+506',
    '+507', '+508', '+509', '+590', '+591', '+592', '+593', '+594', '+595', '+596',
    '+597', '+598', '+599', '+670', '+672', '+673', '+674', '+675', '+676', '+677',
    '+678', '+679', '+680', '+681', '+682', '+683', '+684', '+685', '+686', '+687',
    '+688', '+689', '+690', '+691', '+692', '+850', '+852', '+853', '+855', '+856',
    '+880', '+886', '+960', '+961', '+962', '+963', '+964', '+965', '+966', '+967',
    '+968', '+970', '+971', '+972', '+973', '+974', '+975', '+976', '+977', '+992',
    '+993', '+994', '+995', '+996', '+998'
]);

const COUNTRY = {
    RU: { lens: [10], extLen: [2, 6], code: '+7', maxNational: 10 },
    US: { lens: [10], extLen: [2, 6], code: '+1', maxNational: 10 },
    CA: { lens: [10], extLen: [2, 6], code: '+1', maxNational: 10 },
    DE: { lens: [10, 11], extLen: [2, 5], code: '+49', maxNational: 11 },
    GB: { lens: [10, 11], extLen: [2, 5], code: '+44', maxNational: 10 },
    FR: { lens: [9], extLen: [2, 4], code: '+33', maxNational: 9 },
    CN: { lens: [11], extLen: [2, 5], code: '+86', maxNational: 11 },
    JP: { lens: [10, 11], extLen: [2, 4], code: '+81', maxNational: 10 },
    IT: { lens: [9, 10, 11], extLen: [2, 4], code: '+39', maxNational: 10 },
    ES: { lens: [9], extLen: [2, 4], code: '+34', maxNational: 9 },
    NL: { lens: [9], extLen: [2, 4], code: '+31', maxNational: 9 },
    SE: { lens: [7, 8, 9], extLen: [2, 4], code: '+46', maxNational: 9 },
    NO: { lens: [8], extLen: [2, 4], code: '+47', maxNational: 8 },
    DK: { lens: [8], extLen: [2, 4], code: '+45', maxNational: 8 },
    AT: { lens: [10, 11], extLen: [2, 4], code: '+43', maxNational: 11 },
    CH: { lens: [9], extLen: [2, 4], code: '+41', maxNational: 9 },
    BE: { lens: [9], extLen: [2, 4], code: '+32', maxNational: 9 },
    IE: { lens: [9], extLen: [2, 4], code: '+353', maxNational: 9 },
    PT: { lens: [9], extLen: [2, 4], code: '+351', maxNational: 9 },
    GR: { lens: [10], extLen: [2, 4], code: '+30', maxNational: 10 },
    FI: { lens: [9], extLen: [2, 4], code: '+358', maxNational: 9 },
    CZ: { lens: [9], extLen: [2, 4], code: '+420', maxNational: 9 },
    HU: { lens: [9], extLen: [2, 4], code: '+36', maxNational: 9 },
    PL: { lens: [9], extLen: [2, 4], code: '+48', maxNational: 9 },
    RO: { lens: [9], extLen: [2, 4], code: '+40', maxNational: 9 },
    BG: { lens: [8, 9], extLen: [2, 4], code: '+359', maxNational: 9 },
    HR: { lens: [8, 9], extLen: [2, 4], code: '+385', maxNational: 9 },
    SI: { lens: [8], extLen: [2, 4], code: '+386', maxNational: 8 },
    SK: { lens: [9], extLen: [2, 4], code: '+421', maxNational: 9 },
    LT: { lens: [8], extLen: [2, 4], code: '+370', maxNational: 8 },
    LV: { lens: [8], extLen: [2, 4], code: '+371', maxNational: 8 },
    EE: { lens: [7, 8], extLen: [2, 4], code: '+372', maxNational: 8 },
    CY: { lens: [8], extLen: [2, 4], code: '+357', maxNational: 8 },
    MT: { lens: [8], extLen: [2, 4], code: '+356', maxNational: 8 },
    LU: { lens: [9], extLen: [2, 4], code: '+352', maxNational: 9 },
    TR: { lens: [10], extLen: [2, 4], code: '+90', maxNational: 10 },
    AU: { lens: [9], extLen: [2, 5], code: '+61', maxNational: 9 },
    BR: { lens: [10, 11], extLen: [2, 5], code: '+55', maxNational: 11 },
    MX: { lens: [10, 11], extLen: [2, 4], code: '+52', maxNational: 11 },
    KR: { lens: [9, 10], extLen: [2, 5], code: '+82', maxNational: 10 },
    IN: { lens: [10], extLen: [2, 5], code: '+91', maxNational: 10 },
    TH: { lens: [9], extLen: [2, 4], code: '+66', maxNational: 9 },
    AD: { lens: [6, 8], extLen: [2, 4], code: '+376', maxNational: 8 },
    VN: { lens: [9, 10], extLen: [2, 4], code: '+84', maxNational: 10 }
};

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
    IN: 'ext.', TH: 'ต่อ', AD: 'ext.', VN: 'ext.'
};

const EXT_PATTERNS = [
    /^tel:([+\d\-\(\)\s]+);ext(?:ension)?=(\d+)$/i,
    /(.+)[,;]\s*(\d+)$/,
    /(.+)\s+(?:доб\.?|ext\.?|extension|добавочный|durchwahl|poste|分机|内線|int\.?|tst\.?|anknr|lnr|lok\.?|DW|App\.?|εσωτ\.?|alanumero|linka|mellék|wew\.?|вт\.?|vidinis|iekš\.?|lisa|est\.?|dahili|ramal|내선|ต่อ)\s*(\d+)$/i,
    /(.+)\s*[x#*]\s*(\d+)$/i
];

const VANITY_MAP = {
    A: '2', B: '2', C: '2',
    D: '3', E: '3', F: '3',
    G: '4', H: '4', I: '4',
    J: '5', K: '5', L: '5',
    M: '6', N: '6', O: '6',
    P: '7', Q: '7', R: '7', S: '7',
    T: '8', U: '8', V: '8',
    W: '9', X: '9', Y: '9', Z: '9'
};

const PHONE_REGEX = /(?:\+?\d[\d\s\-\(\)]{6,}\d)|\d{7,}/;
const MIN_PHONE_DIGITS = 7;
const MAX_E164_LENGTH = 15;
const DEFAULT_COUNTRY = 'RU';

// =============================================================================
// PHONE FORMATTER CLASS
// =============================================================================

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

    /**
     * Main entry point - format phone number
     * @param {string} input - Raw phone number input
     * @param {string} type - Output format: 'contact', 'document', 'web'
     * @returns {string|null} Formatted number or null if invalid
     */
    format(input, type) {
        // Step 1: Pre-validate (basic string check)
        if (!input || typeof input !== 'string') return null;
        const raw = input.trim();
        if (!raw) return null;

        // Step 2: Expand vanity letters to digits (e.g. 1-800-FLOWERS)
        const expanded = this.#expandVanity(raw);

        // Step 3: Validate digit count after vanity expansion
        const trimmed = this.#validateInput(expanded);
        if (!trimmed) return null;

        // Step 4: Parse extension from input
        const { main, ext, extExplicit } = this.#parse(trimmed);
        if (!main) return null;

        // Step 5: Normalize to E.164 (libphonenumber priority!)
        const e164 = this.#toE164(main);
        if (!e164) return null;

        // Step 6: Format by type
        const formatted = this.#formatByType(e164, type);
        if (!formatted) return null;

        // Step 7: Add extension if present
        return formatted + this.#formatExtension(ext, type, extExplicit);
    }

    #validateInput(input) {
        if (!input || typeof input !== 'string') return null;
        const trimmed = input.trim();
        if (!trimmed) return null;
        const digitCount = (trimmed.match(/\d/g) || []).length;
        if (digitCount < MIN_PHONE_DIGITS) return null;
        return trimmed;
    }

    #expandVanity(input) {
        if (!/[A-Z]{3,}/.test(input)) return input;
        return input.replace(/[A-Z]{3,}/g, word => word.split('').map(ch => VANITY_MAP[ch] || ch).join(''));
    }

    /**
     * Parse extension from phone number
     * Supports: comma, semicolon, ext., x, #, *, textual labels
     * Returns extExplicit=true for unambiguous tel: URI form (ext=N)
     */
    #parse(input) {
        // Remove empty brackets and normalize whitespace
        const txt = input
            .replace(/\s*[\(\[\{][^0-9+\)\]\}]*[\)\]\}]\s*/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Try each extension pattern
        for (let i = 0; i < EXT_PATTERNS.length; i++) {
            const match = txt.match(EXT_PATTERNS[i]);
            if (match) {
                let main = match[1].trim();
                if (main.toLowerCase().startsWith('tel:')) {
                    main = main.slice(4);
                }
                return { main, ext: match[2], extExplicit: i === 0 };
            }
        }

        return { main: txt, ext: null, extExplicit: false };
    }

    /**
     * Convert to E.164 format - libphonenumber is PRIORITY!
     * 
     * Logic:
     * 1. Clean input (remove garbage, fix multiple plus signs)
     * 2. Try libphonenumber parsing with isValid() check
     * 3. If libphonenumber parsed but isValid=false → REJECT (don't use manual)
     * 4. If libphonenumber threw exception → manual fallback
     */
    #toE164(num) {
        // Step 1: Clean input
        let clean = num.replace(/[^\d+]/g, '');
        
        // Step 2: Fix multiple plus signs (++, +++, etc.)
        clean = clean.replace(/^[+]+/, '+');
        
        // Step 3: libphonenumber is the authority - try it FIRST
        if (libPhone) {
            try {
                // For numbers with +, don't pass country (let lib figure it out)
                // For numbers without +, use configured country
                const parseCountry = clean.startsWith('+') ? undefined : this.#country;
                const parsed = libPhone.parsePhoneNumber(clean, parseCountry);
                
                // CRITICAL: If parsed exists, libphonenumber recognized the format
                // - isValid() = true → accept and return
                // - isValid() = false → REJECT (don't fall through to manual)
                if (parsed) {
                    if (parsed.isValid()) {
                        return parsed.format('E.164');
                    }
                    // parsed but invalid → reject entirely
                    // Don't fall through to manual - libphonenumber said it's invalid
                    return null;
                }
            } catch {
                // Exception means libphonenumber couldn't parse at all
                // Fall through to manual normalization for local formats
            }
        }
        
        // Step 4: Manual fallback (only if libphonenumber unavailable or threw exception)
        return this.#manualNormalize(clean);
    }

    /**
     * Manual normalization fallback
     * Only used when libphonenumber is unavailable or couldn't parse
     */
    #manualNormalize(clean) {
        if (!clean) return null;
        const { code } = this.#cfg;
        
        // Already starts with correct country code
        if (clean.startsWith(code)) return clean;
        
        // Has some + prefix - validate the country code
        if (clean.startsWith('+')) {
            const extractedCode = this.#extractCountryCode(clean);
            return extractedCode ? clean : null;
        }
        
        // Country-specific normalization
        if (this.#country === 'RU') return this.#normalizeRU(clean);
        if (['US', 'CA'].includes(this.#country)) return this.#normalizeNANP(clean);
        return this.#normalizeDefault(clean, code);
    }

    #extractCountryCode(e164) {
        for (let len = 3; len >= 1; len--) {
            const code = '+' + e164.slice(1, len + 1);
            if (VALID_CODES.has(code)) return code;
        }
        return null;
    }

    #normalizeRU(n) {
        n = n.replace(/^0+/, '');
        if (n.length === 10) return '+7' + n;
        if (n.length === 11 && n.startsWith('8')) return '+7' + n.slice(1);
        if (n.length === 11 && n.startsWith('7')) return '+' + n;
        return null;
    }

    #normalizeNANP(n) {
        n = n.replace(/^0+/, '');
        if (n.length === 10) return '+1' + n;
        if (n.length === 11 && n.startsWith('1')) return '+' + n;
        return null;
    }

    #normalizeDefault(n, code) {
        n = n.replace(/^0+/, '');
        if (n.startsWith(code.slice(1))) return '+' + n;
        return code + n;
    }

    #formatByType(e164, type) {
        switch (type) {
            case 'contact': return e164;
            case 'document': return this.#formatDocument(e164);
            case 'web': return `tel:${e164}`;
            default: return e164;
        }
    }

    /**
     * Format for documents - uses libphonenumber for proper formatting
     */
    #formatDocument(e164) {
        // Try libphonenumber formatting first
        if (libPhone) {
            try {
                const parsed = libPhone.parsePhoneNumber(e164);
                if (parsed) {
                    if (this.#docFormat === 'natl') {
                        return parsed.formatNational();
                    }
                    return parsed.formatInternational();
                }
            } catch {
                // Fall through to manual formatting
            }
        }

        // Manual formatting fallback
        const code = this.#extractCountryCode(e164);
        if (!code) return e164;
        const national = e164.slice(code.length);

        if (this.#docFormat === 'natl') {
            return this.#manualFormatNational(code, national);
        }
        return this.#manualFormatInternational(code, national);
    }

    #manualFormatNational(code, n) {
        // RU: 8 (XXX) XXX-XX-XX
        if (code === '+7' && n.length === 10) {
            return `8 (${n.slice(0,3)}) ${n.slice(3,6)}-${n.slice(6,8)}-${n.slice(8)}`;
        }
        // US/CA: (XXX) XXX-XXXX
        if (code === '+1' && n.length === 10) {
            return `(${n.slice(0,3)}) ${n.slice(3,6)}-${n.slice(6)}`;
        }
        // DE: 0XXX XXXXXXX (area code 3-5 digits, subscriber 3-7 digits)
        if (code === '+49') {
            if (n.length === 10) return `0${n.slice(0,3)} ${n.slice(3)}`;
            if (n.length === 11) return `0${n.slice(0,4)} ${n.slice(4)}`;
        }
        // FR: 0X XX XX XX XX (always 9 national digits, first digit is area/mobile prefix)
        if (code === '+33' && n.length === 9) {
            return `0${n[0]} ${n.slice(1,3)} ${n.slice(3,5)} ${n.slice(5,7)} ${n.slice(7)}`;
        }
        // GB: 0XXXX XXXXXX or 0XXX XXX XXXX
        if (code === '+44') {
            if (n.length === 10) return `0${n.slice(0,4)} ${n.slice(4)}`;
            if (n.length === 9)  return `0${n.slice(0,3)} ${n.slice(3,6)} ${n.slice(6)}`;
        }
        // AU: 0X XXXX XXXX (geographic) or 04XX XXX XXX (mobile)
        if (code === '+61' && n.length === 9) {
            if (n[0] === '4') return `0${n.slice(0,3)} ${n.slice(3,6)} ${n.slice(6)}`;
            return `0${n[0]} ${n.slice(1,5)} ${n.slice(5)}`;
        }
        // BR: (XX) XXXX-XXXX or (XX) XXXXX-XXXX (mobile)
        if (code === '+55') {
            if (n.length === 10) return `(${n.slice(0,2)}) ${n.slice(2,6)}-${n.slice(6)}`;
            if (n.length === 11) return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`;
        }
        return `0${n}`;
    }

    #manualFormatInternational(code, n) {
        // RU: +7 XXX XXX XX XX
        if (code === '+7' && n.length === 10) {
            return `+7 ${n.slice(0,3)} ${n.slice(3,6)} ${n.slice(6,8)} ${n.slice(8)}`;
        }
        // US/CA: +1 XXX XXX XXXX
        if (code === '+1' && n.length === 10) {
            return `+1 ${n.slice(0,3)} ${n.slice(3,6)} ${n.slice(6)}`;
        }
        // DE: +49 XXX XXXXXXX
        if (code === '+49') {
            if (n.length === 10) return `+49 ${n.slice(0,3)} ${n.slice(3)}`;
            if (n.length === 11) return `+49 ${n.slice(0,4)} ${n.slice(4)}`;
        }
        // FR: +33 X XX XX XX XX
        if (code === '+33' && n.length === 9) {
            return `+33 ${n[0]} ${n.slice(1,3)} ${n.slice(3,5)} ${n.slice(5,7)} ${n.slice(7)}`;
        }
        // GB: +44 XXXX XXXXXX or +44 XXX XXX XXXX
        if (code === '+44') {
            if (n.length === 10) return `+44 ${n.slice(0,4)} ${n.slice(4)}`;
            if (n.length === 9)  return `+44 ${n.slice(0,3)} ${n.slice(3,6)} ${n.slice(6)}`;
        }
        // AU: +61 X XXXX XXXX or +61 4XX XXX XXX
        if (code === '+61' && n.length === 9) {
            if (n[0] === '4') return `+61 ${n.slice(0,3)} ${n.slice(3,6)} ${n.slice(6)}`;
            return `+61 ${n[0]} ${n.slice(1,5)} ${n.slice(5)}`;
        }
        // BR: +55 XX XXXX-XXXX or +55 XX XXXXX-XXXX
        if (code === '+55') {
            if (n.length === 10) return `+55 ${n.slice(0,2)} ${n.slice(2,6)}-${n.slice(6)}`;
            if (n.length === 11) return `+55 ${n.slice(0,2)} ${n.slice(2,7)}-${n.slice(7)}`;
        }
        return `${code} ${n}`;
    }

    #formatExtension(ext, type, extExplicit = false) {
        if (!ext) return '';
        const digits = String(ext).replace(/[^\d]/g, '');
        const minLen = extExplicit ? 1 : this.#cfg.extLen[0];
        if (digits.length < minLen || digits.length > this.#cfg.extLen[1]) return '';
        switch (type) {
            case 'contact': return `,${digits}`;
            case 'document': return ` ${this.#extLabel} ${digits}`;
            case 'web': return `;ext=${digits}`;
            default: return `,${digits}`;
        }
    }
}

// =============================================================================
// ACTION FACTORY
// =============================================================================

const ACTION_TITLES = {
    contact: {
        ru: "📱 Контакты", en: "📱 Contacts", de: "📱 Kontakte",
        fr: "📱 Contacts", zh: "📱 联系人", ja: "📱 連絡先",
        it: "📱 Contatti", es: "📱 Contactos", nl: "📱 Contacten",
        pl: "📱 Kontakty", "pt-br": "📱 Contatos", ko: "📱 연락처",
        vi: "📱 Danh bạ", tr: "📱 Kişiler", sk: "📱 Kontakty", da: "📱 Kontakter"
    },
    document: {
        ru: "📄 Документы", en: "📄 Documents", de: "📄 Dokumente",
        fr: "📄 Documents", zh: "📄 文档", ja: "📄 文書",
        it: "📄 Documenti", es: "📄 Documentos", nl: "📄 Documenten",
        pl: "📄 Dokumenty", "pt-br": "📄 Documentos", ko: "📄 문서",
        vi: "📄 Tài liệu", tr: "📄 Belgeler", sk: "📄 Dokumenty", da: "📄 Dokumenter"
    },
    web: {
        ru: "🌐 Веб", en: "🌐 Web", de: "🌐 Web",
        fr: "🌐 Web", zh: "🌐 网页", ja: "🌐 ウェブ",
        it: "🌐 Web", es: "🌐 Web", nl: "🌐 Web",
        pl: "🌐 Sieć", "pt-br": "🌐 Web", ko: "🌐 웹",
        vi: "🌐 Web", tr: "🌐 Web", sk: "🌐 Web", da: "🌐 Web"
    }
};

const ACTION_ICONS = {
    contact: "iconify:tabler:address-book",
    document: "iconify:tabler:file-text",
    web: "iconify:tabler:world"
};

/**
 * Create action for Contacts format (E.164)
 * after: paste-result — replaces selected text with the normalized E.164 number
 */
function createContactAction() {
    return {
        title: ACTION_TITLES.contact,
        icon: ACTION_ICONS.contact,
        after: 'paste-result',
        regex: PHONE_REGEX,
        code: (input, options) => {
            const formatter = new PhoneFormatter(options.country, options.docFormat);
            return formatter.format(input.text, 'contact');
        }
    };
}

/**
 * Create action for Documents format (E.123)
 * after: paste-result — replaces selected text with the human-readable number
 * Supports Option (⌥) modifier to invert format (intl ↔ natl)
 */
function createDocumentAction() {
    return {
        title: ACTION_TITLES.document,
        icon: ACTION_ICONS.document,
        after: 'paste-result',
        regex: PHONE_REGEX,
        code: (input, options) => {
            const optionHeld = popclip.modifiers.option;

            let docFormat = options.docFormat || 'intl';
            if (optionHeld) {
                docFormat = docFormat === 'intl' ? 'natl' : 'intl';
            }

            const formatter = new PhoneFormatter(options.country, docFormat);
            return formatter.format(input.text, 'document');
        }
    };
}

/**
 * Create action for Web format (RFC 3966)
 * after: copy-result — copies tel: URI to clipboard for insertion into HTML/code
 */
function createWebAction() {
    return {
        title: ACTION_TITLES.web,
        icon: ACTION_ICONS.web,
        after: 'copy-result',
        regex: PHONE_REGEX,
        code: (input, options) => {
            const formatter = new PhoneFormatter(options.country, options.docFormat);
            return formatter.format(input.text, 'web');
        }
    };
}

// =============================================================================
// MODULE EXPORTS
// =============================================================================

module.exports = {
    actions: [
        createContactAction(),
        createDocumentAction(),
        createWebAction()
    ]
};