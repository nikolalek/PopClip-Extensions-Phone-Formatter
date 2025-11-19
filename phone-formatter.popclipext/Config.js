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
// after: paste-result
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
 * PopClip Phone Formatter
 * 
 * Formats phone numbers to international standards:
 * - E.164: +79123456789 (machine-readable format)
 * - E.123: +7 912 345 67 89 (human-readable international)
 * - RFC 3966: tel:+79123456789;ext=123 (URI format)
 * 
 * Primary parser: libphonenumber-js (Google's metadata)
 * Fallback: Manual parsing for 45+ countries
 * 
 * @version 2.0.0
 * @author nikolalek
 * @license MIT
 * @see Inspiration: https://forum.popclip.app/t/format-phone-numbers/1536
 */

// Load libphonenumber-js (primary parser)
let libPhone = null;
try {
    libPhone = require("libphonenumber-js.min.js");
    if (!libPhone?.parsePhoneNumber) libPhone = null;
} catch (e) {
    console.error("libphonenumber-js unavailable, using fallback parser");
}

// Country metadata: [national lengths, extension lengths, intl code]
const COUNTRY = Object.freeze({
    RU: {
        lens: [10, 11],
        extLens: [2, 6],
        code: '+7'
    },
    US: {
        lens: [10, 11],
        extLens: [2, 6],
        code: '+1'
    },
    CA: {
        lens: [10, 11],
        extLens: [2, 6],
        code: '+1'
    },
    DE: {
        lens: [10, 11, 12],
        extLens: [2, 5],
        code: '+49'
    },
    GB: {
        lens: [10, 11],
        extLens: [2, 5],
        code: '+44'
    },
    FR: {
        lens: [10],
        extLens: [2, 4],
        code: '+33'
    },
    CN: {
        lens: [11],
        extLens: [2, 5],
        code: '+86'
    },
    JP: {
        lens: [10, 11],
        extLens: [2, 4],
        code: '+81'
    },
    IT: {
        lens: [9, 10, 11],
        extLens: [2, 4],
        code: '+39'
    },
    ES: {
        lens: [9],
        extLens: [2, 4],
        code: '+34'
    },
    NL: {
        lens: [9],
        extLens: [2, 4],
        code: '+31'
    },
    SE: {
        lens: [7, 8, 9],
        extLens: [2, 4],
        code: '+46'
    },
    NO: {
        lens: [8],
        extLens: [2, 4],
        code: '+47'
    },
    DK: {
        lens: [8],
        extLens: [2, 4],
        code: '+45'
    },
    AT: {
        lens: [10, 11],
        extLens: [2, 4],
        code: '+43'
    },
    CH: {
        lens: [9],
        extLens: [2, 4],
        code: '+41'
    },
    BE: {
        lens: [9],
        extLens: [2, 4],
        code: '+32'
    },
    IE: {
        lens: [9],
        extLens: [2, 4],
        code: '+353'
    },
    PT: {
        lens: [9],
        extLens: [2, 4],
        code: '+351'
    },
    GR: {
        lens: [10],
        extLens: [2, 4],
        code: '+30'
    },
    FI: {
        lens: [9],
        extLens: [2, 4],
        code: '+358'
    },
    CZ: {
        lens: [9],
        extLens: [2, 4],
        code: '+420'
    },
    HU: {
        lens: [9],
        extLens: [2, 4],
        code: '+36'
    },
    PL: {
        lens: [9],
        extLens: [2, 4],
        code: '+48'
    },
    RO: {
        lens: [9],
        extLens: [2, 4],
        code: '+40'
    },
    BG: {
        lens: [8, 9],
        extLens: [2, 4],
        code: '+359'
    },
    HR: {
        lens: [8, 9],
        extLens: [2, 4],
        code: '+385'
    },
    SI: {
        lens: [8],
        extLens: [2, 4],
        code: '+386'
    },
    SK: {
        lens: [9],
        extLens: [2, 4],
        code: '+421'
    },
    LT: {
        lens: [8],
        extLens: [2, 4],
        code: '+370'
    },
    LV: {
        lens: [8],
        extLens: [2, 4],
        code: '+371'
    },
    EE: {
        lens: [7, 8],
        extLens: [2, 4],
        code: '+372'
    },
    CY: {
        lens: [8],
        extLens: [2, 4],
        code: '+357'
    },
    MT: {
        lens: [8],
        extLens: [2, 4],
        code: '+356'
    },
    LU: {
        lens: [9],
        extLens: [2, 4],
        code: '+352'
    },
    TR: {
        lens: [10],
        extLens: [2, 4],
        code: '+90'
    },
    AU: {
        lens: [9, 10],
        extLens: [2, 5],
        code: '+61'
    },
    BR: {
        lens: [10, 11],
        extLens: [2, 5],
        code: '+55'
    },
    MX: {
        lens: [10, 11],
        extLens: [2, 4],
        code: '+52'
    },
    KR: {
        lens: [9, 10, 11],
        extLens: [2, 5],
        code: '+82'
    },
    IN: {
        lens: [10],
        extLens: [2, 5],
        code: '+91'
    },
    TH: {
        lens: [9, 10],
        extLens: [2, 4],
        code: '+66'
    }
});

// Localized extension labels (E.123 standard)
const EXT_LABEL = Object.freeze({
    RU: 'доб.',
    US: 'ext.',
    CA: 'ext.',
    GB: 'ext.',
    DE: 'Durchwahl',
    FR: 'poste',
    CN: '分机',
    JP: '内線',
    IT: 'int.',
    ES: 'ext.',
    NL: 'tst.',
    SE: 'anknr',
    NO: 'lnr',
    DK: 'lok.',
    AT: 'DW',
    CH: 'App.',
    BE: 'ext.',
    IE: 'ext.',
    PT: 'ext.',
    GR: 'εσωτ.',
    FI: 'alanumero',
    CZ: 'linka',
    HU: 'mellék',
    PL: 'wew.',
    RO: 'int.',
    BG: 'вт.',
    HR: 'lok.',
    SI: 'int.',
    SK: 'linka',
    LT: 'vidinis',
    LV: 'iekš.',
    EE: 'lisa',
    CY: 'εσωτ.',
    MT: 'est.',
    LU: 'poste',
    TR: 'dahili',
    AU: 'ext.',
    BR: 'ramal',
    MX: 'ext.',
    KR: '내선',
    IN: 'ext.',
    TH: 'ต่อ'
});

// Extension detection patterns (RFC 3966, E.123, common formats)
const EXT_PATTERNS = Object.freeze([
    /^tel:([+\d\-\(\)\s]+);ext(?:ension)?=(\d+)$/i,
    /(.+)[,;]\s*(\d+)$/,
    /(.+)\s+(?:доб\.?|ext\.?|extension|добавочный|durchwahl|poste|分机|内線|int\.?|tst\.?|anknr|lnr|lok\.?|DW|App\.?|εσωτ\.?|alanumero|linka|mellék|wew\.?|вт\.?|vidinis|iekš\.?|lisa|est\.?|dahili|ramal|내선|ต่อ)\s*(\d+)$/i,
    /(.+)\s*[x#*]\s*(\d+)$/i
]);

class PhoneFormatter {
    constructor(country = 'RU', docFormat = 'intl') {
        this.country = country;
        this.cfg = COUNTRY[country] || COUNTRY.RU;
        this.extLabel = EXT_LABEL[country] || EXT_LABEL.US;
        this.lib = libPhone;
        this.docFormat = docFormat; // 'intl' or 'natl'
    }

    /**
     * Clean input: remove note blocks, normalize whitespace
     */
    clean(input) {
        return input
            .replace(/\s*[\(\[\{][^0-9+\)\]\}]*[\)\]\}]\s*/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * Parse number into main and extension parts
     * @returns {{main: string, ext: string|null}}
     */
    parse(input) {
        const txt = this.clean(input);

        // Try pattern matching first
        for (const pattern of EXT_PATTERNS) {
            const match = txt.match(pattern);
            if (match) {
                let main = match[1].trim();
                if (main.startsWith('tel:')) main = main.slice(4);
                return {
                    main,
                    ext: match[2]
                };
            }
        }

        // Try digit-based splitting
        return this.splitByDigits(txt) || {
            main: txt,
            ext: null
        };
    }

    /**
     * Split by digit count (heuristic for numbers without separators)
     */
    splitByDigits(txt) {
        const digits = txt.replace(/[^\d]/g, '');
        if (digits.length < 7) return null;

        for (const mainLen of this.cfg.lens) {
            if (digits.length <= mainLen) continue;

            const minTotal = mainLen + this.cfg.extLens[0];
            const maxTotal = mainLen + this.cfg.extLens[1];

            if (digits.length >= minTotal && digits.length <= maxTotal) {
                const mainDigits = digits.slice(0, mainLen);
                const extDigits = digits.slice(mainLen);

                if (this.isValidMain(mainDigits) && this.isValidExt(extDigits)) {
                    return {
                        main: this.preserveFormat(txt, mainLen),
                        ext: extDigits
                    };
                }
            }
        }
        return null;
    }

    /**
     * Extract first N digits while preserving original formatting
     */
    preserveFormat(txt, targetDigitCount) {
        let digitCount = 0;
        let result = '';

        for (const ch of txt) {
            if (/\d/.test(ch)) {
                result += ch;
                if (++digitCount >= targetDigitCount) break;
            } else if (/[+\-\s\(\)]/.test(ch)) {
                if (ch === '+' && result.length === 0) result += ch;
                else if (ch !== '+' && result.length > 0) result += ch;
            }
        }
        return result.trim();
    }

    isValidMain(digits) {
        return this.cfg.lens.includes(digits.length);
    }

    isValidExt(ext) {
        const digits = ext.replace(/[^\d]/g, '');
        return digits.length >= this.cfg.extLens[0] &&
            digits.length <= this.cfg.extLens[1] &&
            /^\d+$/.test(digits);
    }

    /**
     * Normalize to E.164 format
     * Priority: libphonenumber-js → fallback
     */
    toE164(num) {
        const clean = num.replace(/[^\d+]/g, '');

        // Primary: libphonenumber-js
        if (this.lib) {
            try {
                const parsed = this.lib.parsePhoneNumber(clean, this.country);
                if (parsed?.isValid()) return parsed.format('E.164');
            } catch {}
        }

        // Fallback: manual normalization
        return this.manualNormalize(clean);
    }

    /**
     * Manual E.164 normalization (fallback)
     */
    manualNormalize(clean) {
        const {
            code
        } = this.cfg;

        if (clean.startsWith(code)) return clean;
        if (clean.startsWith('+')) return clean;

        // Country-specific rules
        const rules = {
            RU: n => {
                if (n.startsWith('8') && n.length === 11) return '+7' + n.slice(1);
                if (n.startsWith('7') && n.length === 11) return '+' + n;
                if (n.length === 10) return '+7' + n; // Правильно для 10 цифр
                return code + n.replace(/^0+/, ''); // Фолбэк для остальных случаев
            },

            US: n => {
                if (n.length === 10) return '+1' + n;
                if (n.startsWith('1') && n.length === 11) return '+' + n;
                return '+1' + n;
            },
            CA: n => {
                if (n.length === 10) return '+1' + n;
                if (n.startsWith('1') && n.length === 11) return '+' + n;
                return '+1' + n;
            }
        };

        return (rules[this.country] || (n => code + n.replace(/^0+/, '')))(clean);
    }

    /**
     * Format for documents (E.123 international or national)
     * Priority: libphonenumber-js → fallback
     */
    formatDocument(e164) {
        // Primary: libphonenumber-js
        if (this.lib) {
            try {
                const parsed = this.lib.parsePhoneNumber(e164);
                if (parsed?.isValid()) {
                    return this.docFormat === 'natl' ?
                        parsed.formatNational() :
                        parsed.formatInternational();
                }
            } catch {}
        }

        // Fallback: manual formatting
        return this.manualFormat(e164);
    }

    /**
     * Manual formatting (fallback)
     */
    manualFormat(e164) {
        const {
            code
        } = this.cfg;
        if (!e164.startsWith(code)) return e164;

        const national = e164.slice(code.length);

        // International format patterns
        const intlFormats = {
            RU: n => `+7 ${n.slice(0,3)} ${n.slice(3,6)} ${n.slice(6,8)} ${n.slice(8)}`,
            US: n => `+1 ${n.slice(0,3)} ${n.slice(3,6)} ${n.slice(6)}`,
            CA: n => `+1 ${n.slice(0,3)} ${n.slice(3,6)} ${n.slice(6)}`,
            DE: n => `+49 ${n.slice(0,2)} ${n.slice(2)}`,
            GB: n => `+44 ${n.slice(0,2)} ${n.slice(2)}`,
            FR: n => `+33 ${n.slice(0,1)} ${n.slice(1,3)} ${n.slice(3,5)} ${n.slice(5,7)} ${n.slice(7)}`
        };

        // National format patterns (with parentheses and hyphens)
        const natlFormats = {
            RU: n => `+7 (${n.slice(0,3)}) ${n.slice(3,6)}-${n.slice(6,8)}-${n.slice(8)}`,
            US: n => `+1 (${n.slice(0,3)}) ${n.slice(3,6)}-${n.slice(6)}`,
            CA: n => `+1 (${n.slice(0,3)}) ${n.slice(3,6)}-${n.slice(6)}`,
            DE: n => `+49 (${n.slice(0,2)}) ${n.slice(2)}`,
            GB: n => `+44 (${n.slice(0,2)}) ${n.slice(2)}`,
            FR: n => `+33 (${n.slice(0,1)}) ${n.slice(1,3)} ${n.slice(3,5)} ${n.slice(5,7)} ${n.slice(7)}`
        };

        const formats = this.docFormat === 'natl' ? natlFormats : intlFormats;
        return formats[this.country] ? formats[this.country](national) : e164;
    }

    /**
     * Format for contacts (E.164)
     * Priority: libphonenumber-js → fallback
     */
    formatContact(e164) {
        if (this.lib) {
            try {
                const parsed = this.lib.parsePhoneNumber(e164);
                if (parsed?.isValid()) return parsed.format('E.164');
            } catch {}
        }
        return e164;
    }

    /**
     * Format for web (RFC 3966 tel: URI)
     * Priority: libphonenumber-js → fallback
     */
    formatWeb(e164) {
        if (this.lib) {
            try {
                const parsed = this.lib.parsePhoneNumber(e164);
                if (parsed?.isValid()) return `tel:${parsed.format('E.164')}`;
            } catch {}
        }
        return `tel:${e164}`;
    }

    /**
     * Format extension for output type
     */
    formatExtension(ext, type) {
        if (!ext) return '';
        switch (type) {
            case 'contact':
                return `,${ext}`;
            case 'document':
                return ` ${this.extLabel} ${ext}`;
            case 'web':
                return `;ext=${ext}`;
            default:
                return `,${ext}`;
        }
    }

    /**
     * Main entry point: format phone number
     * @param {string} input - Raw phone number
     * @param {'contact'|'document'|'web'} type - Output format type
     * @returns {string|null} Formatted number or null if invalid
     */
    format(input, type) {
        if (!input?.trim()) return null;

        // Step 1: Parse main number and extension
        const {
            main,
            ext
        } = this.parse(input);
        if (!main) return null;

        // Step 2: Normalize to E.164 (libphonenumber-js priority)
        const e164 = this.toE164(main);
        if (!e164 || e164.length < 8) return null;

        // Step 3: Format based on output type (libphonenumber-js priority)
        let formatted;
        switch (type) {
            case 'contact':
                formatted = this.formatContact(e164);
                break;
            case 'document':
                formatted = this.formatDocument(e164);
                break;
            case 'web':
                formatted = this.formatWeb(e164);
                break;
            default:
                formatted = e164;
        }

        // Step 4: Append extension in appropriate format
        return formatted + this.formatExtension(ext, type);
    }
}

// PopClip module exports
module.exports = {
    actions: [{
            title: {
                ru: "📱 Контакты",
                en: "📱 Contacts",
                de: "📱 Kontakte",
                fr: "📱 Contacts",
                zh: "📱 联系人",
                ja: "📱 連絡先",
                it: "📱 Contatti",
                es: "📱 Contactos",
                nl: "📱 Contacten",
                pl: "📱 Kontakty",
                "pt-br": "📱 Contatos",
                ko: "📱 연락처",
                vi: "📱 Danh bạ",
                tr: "📱 Kişiler",
                sk: "📱 Kontakty",
                da: "📱 Kontakter"
            },
            icon: "iconify:tabler:address-book",
            code: (input, options) => {
                if (!input.text?.trim()) return null;
                const formatter = new PhoneFormatter(
                    options.country || 'RU',
                    options.docFormat
                );
                return formatter.format(input.text, 'contact');
            }
        },
        {
            title: {
                ru: "📄 Документы",
                en: "📄 Documents",
                de: "📄 Dokumente",
                fr: "📄 Documents",
                zh: "📄 文档",
                ja: "📄 文書",
                it: "📄 Documenti",
                es: "📄 Documentos",
                nl: "📄 Documenten",
                pl: "📄 Dokumenty",
                "pt-br": "📄 Documentos",
                ko: "📄 문서",
                vi: "📄 Tài liệu",
                tr: "📄 Belgeler",
                sk: "📄 Dokumenty",
                da: "📄 Dokumenter"
            },
            icon: "iconify:tabler:file-text",
            code: (input, options) => {
                if (!input.text?.trim()) return null;
                const formatter = new PhoneFormatter(
                    options.country || 'RU',
                    options.docFormat || 'intl'
                );
                return formatter.format(input.text, 'document');
            }
        },
        {
            title: {
                ru: "🌐 Веб",
                en: "🌐 Web",
                de: "🌐 Web",
                fr: "🌐 Web",
                zh: "🌐 网页",
                ja: "🌐 ウェブ",
                it: "🌐 Web",
                es: "🌐 Web",
                nl: "🌐 Web",
                pl: "🌐 Sieć",
                "pt-br": "🌐 Web",
                ko: "🌐 웹",
                vi: "🌐 Web",
                tr: "🌐 Web",
                sk: "🌐 Web",
                da: "🌐 Web"
            },
            icon: "iconify:tabler:world",
            code: (input, options) => {
                if (!input.text?.trim()) return null;
                const formatter = new PhoneFormatter(
                    options.country || 'RU',
                    options.docFormat
                );
                return formatter.format(input.text, 'web');
            }
        }
    ]
};
