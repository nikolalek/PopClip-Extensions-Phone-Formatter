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
// identifier: com.nikolalek.phone-formatter
// description:
//   ru: Форматирование номеров телефонов с добавочными для контактов, документов и веб
//   en: Format phone numbers with extensions for contacts, documents and web
//   de: Telefonnummer-Formatierung mit Durchwahl für Kontakte, Dokumente und Web
//   fr: Formatage des numéros de téléphone avec extensions pour contacts, documents et web
//   zh: 格式化电话号码，支持联系人、文档和网页的分机号
//   ja: 連絡先、文書、ウェブ用の内線番号付き電話番号フォーマット
//   it: Formattazione numeri telefono con estensioni per contatti, documenti e web
//   es: Formateo de números telefónicos con extensiones para contactos, documentos y web
//   nl: Telefoon nummer formattering met extensies voor contacten, documenten en web
//   pl: Formatowanie numerów telefonów z rozszerzeniami dla kontaktów, dokumentów i internetu
//   pt-br: Formatação de números telefônicos com extensões para contatos, documentos e web
//   ko: 연락처, 문서 및 웹용 확장 기능이 포함된 전화번호 형식
//   vi: Định dạng số điện thoại với phần mở rộng cho liên hệ, tài liệu và web
//   tr: Kişiler, belgeler ve web için uzantılı telefon numarası biçimlendirme
//   sk: Formátovanie telefónnych čisiel s rozšíreniami pre kontakty, dokumenty a web
//   da: Telefon nummer formatering med udvidelser til kontakter, dokumenter og web
// icon: iconify:tabler:phone
// popclip version: 4200
// after: paste-result
// options:
//   - identifier: defaultCountry
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
//     value labels: ["🇷🇺 Russia", "🇺🇸 USA", "🇩🇪 Germany", "🇬🇧 United Kingdom", "🇫🇷 France", "🇨🇳 China", "🇯🇵 Japan", "🇮🇹 Italy", "🇪🇸 Spain", "🇳🇱 Netherlands", "🇸🇪 Sweden", "🇳🇴 Norway", "🇦🇺 Australia", "🇨🇦 Canada", "🇧🇷 Brazil", "🇲🇽 Mexico", "🇰🇷 South Korea", "🇮🇳 India", "🇹🇭 Thailand", "🇵🇱 Poland", "🇹🇷 Turkey", "🇸🇰 Slovakia", "🇩🇰 Denmark", "🇦🇹 Austria", "🇨🇭 Switzerland", "🇧🇪 Belgium", "🇮🇪 Ireland", "🇵🇹 Portugal", "🇬🇷 Greece", "🇫🇮 Finland", "🇨🇿 Czech Republic", "🇭🇺 Hungary", "🇷🇴 Romania", "🇧🇬 Bulgaria", "🇭🇷 Croatia", "🇸🇮 Slovenia", "🇱🇹 Lithuania", "🇱🇻 Latvia", "🇪🇪 Estonia", "🇨🇾 Cyprus", "🇲🇹 Malta", "🇱🇺 Luxembourg"]
//     default value: RU

"use strict";

/**
 * PopClip Phone Formatter
 * Formats phone numbers to E.164, International, and tel: URI standards
 * @version 1.0.0
 * @author nikolalek
 * @license MIT
 * @see Inspiration: https://forum.popclip.app/t/format-phone-numbers/1536
 */

// Load libphonenumber-js from extension directory
let phoneLib = null;
try {
    phoneLib = require("libphonenumber-js.min.js");
    if (!phoneLib?.parsePhoneNumber) phoneLib = null;

} catch (error) {
    console.error("Failed to load libphonenumber-js.min.js; using manual mode.", error);
}

// Country configs: lengths, ext ranges, code
const CNTRY_CFG = Object.freeze({
    RU: { lens: [10, 11], extLens: [2, 6], code: '+7' },
    US: { lens: [10, 11], extLens: [2, 6], code: '+1' },
    CA: { lens: [10, 11], extLens: [2, 6], code: '+1' },
    DE: { lens: [10, 11, 12], extLens: [2, 5], code: '+49' },
    GB: { lens: [10, 11], extLens: [2, 5], code: '+44' },
    FR: { lens: [10], extLens: [2, 4], code: '+33' },
    CN: { lens: [11], extLens: [2, 5], code: '+86' },
    JP: { lens: [10, 11], extLens: [2, 4], code: '+81' },
    IT: { lens: [9, 10, 11], extLens: [2, 4], code: '+39' },
    ES: { lens: [9], extLens: [2, 4], code: '+34' },
    NL: { lens: [9], extLens: [2, 4], code: '+31' },
    SE: { lens: [7, 8, 9], extLens: [2, 4], code: '+46' },
    NO: { lens: [8], extLens: [2, 4], code: '+47' },
    DK: { lens: [8], extLens: [2, 4], code: '+45' },
    AT: { lens: [10, 11], extLens: [2, 4], code: '+43' },
    CH: { lens: [9], extLens: [2, 4], code: '+41' },
    BE: { lens: [9], extLens: [2, 4], code: '+32' },
    IE: { lens: [9], extLens: [2, 4], code: '+353' },
    PT: { lens: [9], extLens: [2, 4], code: '+351' },
    GR: { lens: [10], extLens: [2, 4], code: '+30' },
    FI: { lens: [9], extLens: [2, 4], code: '+358' },
    CZ: { lens: [9], extLens: [2, 4], code: '+420' },
    HU: { lens: [9], extLens: [2, 4], code: '+36' },
    PL: { lens: [9], extLens: [2, 4], code: '+48' },
    RO: { lens: [9], extLens: [2, 4], code: '+40' },
    BG: { lens: [8, 9], extLens: [2, 4], code: '+359' },
    HR: { lens: [8, 9], extLens: [2, 4], code: '+385' },
    SI: { lens: [8], extLens: [2, 4], code: '+386' },
    SK: { lens: [9], extLens: [2, 4], code: '+421' },
    LT: { lens: [8], extLens: [2, 4], code: '+370' },
    LV: { lens: [8], extLens: [2, 4], code: '+371' },
    EE: { lens: [7, 8], extLens: [2, 4], code: '+372' },
    CY: { lens: [8], extLens: [2, 4], code: '+357' },
    MT: { lens: [8], extLens: [2, 4], code: '+356' },
    LU: { lens: [9], extLens: [2, 4], code: '+352' },
    TR: { lens: [10], extLens: [2, 4], code: '+90' },
    AU: { lens: [9, 10], extLens: [2, 5], code: '+61' },
    BR: { lens: [10, 11], extLens: [2, 5], code: '+55' },
    MX: { lens: [10, 11], extLens: [2, 4], code: '+52' },
    KR: { lens: [9, 10, 11], extLens: [2, 5], code: '+82' },
    IN: { lens: [10], extLens: [2, 5], code: '+91' },
    TH: { lens: [9, 10], extLens: [2, 4], code: '+66' }
});

// Localized ext labels
const EXT_LBLS = Object.freeze({
    RU: 'доб.', US: 'ext.', CA: 'ext.', GB: 'ext.', DE: 'Durchwahl', FR: 'poste',
    CN: '分机', JP: '内線', IT: 'int.', ES: 'ext.', NL: 'tst.',
    SE: 'anknr', NO: 'lnr', DK: 'lok.', AT: 'DW', CH: 'App.',
    BE: 'ext.', IE: 'ext.', PT: 'ext.', GR: 'εσωτ.', FI: 'alanumero',
    CZ: 'linka', HU: 'mellék', PL: 'wew.', RO: 'int.', BG: 'вт.',
    HR: 'lok.', SI: 'int.', SK: 'linka', LT: 'vidinis', LV: 'iekš.',
    EE: 'lisa', CY: 'εσωτ.', MT: 'est.', LU: 'poste', TR: 'dahili',
    AU: 'ext.', BR: 'ramal', MX: 'ext.', KR: '내선',
    IN: 'ext.', TH: 'ต่อ'
});

// Ext patterns (regex for detection)
const EXT_PTNS = Object.freeze([
    /^tel:([+\d\-\(\)\s]+);ext=(\d+)$/i,
    /^tel:([+\d\-\(\)\s]+);extension=(\d+)$/i,
    /(.+)[,;]\s*(\d+)$/,
    /(.+)\s+(?:доб\.?|ext\.?|extension|добавочный|durchwahl|poste|分机|内線|int\.?|tst\.?|anknr|lnr|lok\.?|DW|App\.?|εσωτ\.?|alanumero|linka|mellék|wew\.?|вт\.?|vidinis|iekš\.?|lisa|est\.?|dahili|ramal|내선|ต่อ)\s*(\d+)$/i,
    /(.+)\s*[x#*]\s*(\d+)$/i
]);

class PhoneFmt {
    constructor(cntry = 'RU') {
        this.cntry = cntry;
        this.cfg = CNTRY_CFG[cntry] || CNTRY_CFG.RU;
        this.extLbl = EXT_LBLS[cntry] || EXT_LBLS.US;
        this.lib = phoneLib;
    }

    cleanInp(inp) {
        return inp.replace(/\s*[\(\[\{][^0-9+\)\]\}]*[\)\]\}]\s*/g, ' ')
            .replace(/\s+/g, ' ').trim();
    }

    parseNum(inp) {
        const txt = this.cleanInp(inp);
        for (const ptn of EXT_PTNS) {
            const m = txt.match(ptn);
            if (m) {
                let main = m[1].trim();
                if (main.startsWith('tel:')) main = main.slice(4);
                return { main, ext: m[2] };
            }
        }
        return this.splitDigs(txt) || { main: txt, ext: null };
    }

    splitDigs(txt) {
        const digs = txt.replace(/[^\d]/g, '');
        if (digs.length < 7) return null;
        for (const mainLen of this.cfg.lens) {
            if (digs.length <= mainLen) continue;
            const minTot = mainLen + this.cfg.extLens[0];
            const maxTot = mainLen + this.cfg.extLens[1];
            if (digs.length >= minTot && digs.length <= maxTot) {
                const mainDigs = digs.slice(0, mainLen);
                const extDigs = digs.slice(mainLen);
                if (this.validMain(mainDigs) && this.validExt(extDigs)) {
                    return { main: this.presMainFmt(txt, mainLen), ext: extDigs };
                }
            }
        }
        return null;
    }

    presMainFmt(txt, tgtDigCnt) {
        const chars = txt.split('');
        let digCnt = 0;
        let res = '';
        for (const ch of chars) {
            if (/\d/.test(ch)) {
                digCnt++;
                res += ch;
                if (digCnt >= tgtDigCnt) break;
            } else if (/[+\-\s\(\)]/.test(ch) && res.length > 0) {
                res += ch;
            } else if (ch === '+' && res.length === 0) {
                res += ch;
            }
        }
        return res.trim();
    }

    validMain(digs) {
        return this.cfg.lens.includes(digs.length);
    }

    validExt(ext) {
        const digs = ext.replace(/[^\d]/g, '');
        return digs.length >= this.cfg.extLens[0] &&
               digs.length <= this.cfg.extLens[1] &&
               /^\d+$/.test(digs);
    }

    normE164(num) {
        const cln = num.replace(/[^\d+]/g, '');
        if (this.lib) {
            try {
                const prsd = this.lib.parsePhoneNumber(cln, this.cntry);
                if (prsd?.isValid()) return prsd.format('E.164');
            } catch {}
        }
        return this.manNorm(cln);
    }

    manNorm(cln) {
        const { code } = this.cfg;
        if (cln.startsWith(code)) return cln;
        if (cln.startsWith('+')) return cln;
        const rules = {
            RU: n => n.startsWith('8') && n.length === 11 ? '+7' + n.slice(1) : (n.startsWith('7') && n.length === 11 ? '+' + n : (n.length === 10 ? '+7' + n : '+7' + n)),
            US: n => n.length === 10 ? '+1' + n : (n.startsWith('1') && n.length === 11 ? '+' + n : '+1' + n),
            CA: n => n.length === 10 ? '+1' + n : (n.startsWith('1') && n.length === 11 ? '+' + n : '+1' + n)
        };
        return (rules[this.cntry] || (n => code + n.replace(/^0+/, '')))(cln);
    }

    fmtDocs(e164) {
        if (this.lib) {
            try {
                const prsd = this.lib.parsePhoneNumber(e164);
                if (prsd?.isValid()) return prsd.formatInternational();
            } catch {}
        }
        return this.manIntlFmt(e164);
    }

    manIntlFmt(e164) {
        const { code } = this.cfg;
        if (!e164.startsWith(code)) return e164;
        const nat = e164.slice(code.length);
        const fmts = {
            RU: n => `+7 ${n.slice(0,3)} ${n.slice(3,6)} ${n.slice(6,8)} ${n.slice(8)}`,
            US: n => `+1 ${n.slice(0,3)} ${n.slice(3,6)} ${n.slice(6)}`,
            CA: n => `+1 ${n.slice(0,3)} ${n.slice(3,6)} ${n.slice(6)}`,
            DE: n => `+49 ${n.slice(0,2)} ${n.slice(2)}`,
            GB: n => `+44 ${n.slice(0,2)} ${n.slice(2)}`,
            FR: n => `+33 ${n.slice(0,1)} ${n.slice(1,3)} ${n.slice(3,5)} ${n.slice(5,7)} ${n.slice(7)}`
        };
        return fmts[this.cntry] ? fmts[this.cntry](nat) : e164;
    }

    fmtExt(ext, typ) {
        if (!ext) return '';
        switch (typ) {
            case 'contacts': return `,${ext}`;
            case 'documents': return ` ${this.extLbl} ${ext}`;
            case 'web': return `;ext=${ext}`;
            default: return `,${ext}`;
        }
    }

    fmtPhone(inp, typ) {
        if (!inp?.trim()) return null;
        const { main, ext } = this.parseNum(inp);
        if (!main) return null;
        const e164 = this.normE164(main);
        if (!e164 || e164.length < 8) return null;
        let fmt;
        switch (typ) {
            case 'contacts': fmt = e164; break;
            case 'documents': fmt = this.fmtDocs(e164); break;
            case 'web': fmt = `tel:${e164}`; break;
            default: fmt = e164;
        }
        return fmt ? fmt + this.fmtExt(ext, typ) : null;
    }
}

module.exports = {
    actions: [
        {
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
            code: (inp, opts) => {
                if (!inp.text?.trim()) return null;
                const cntry = opts.defaultCountry || 'RU';
                const fmt = new PhoneFmt(cntry);
                return fmt.fmtPhone(inp.text, 'contacts');
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
            code: (inp, opts) => {
                if (!inp.text?.trim()) return null;
                const cntry = opts.defaultCountry || 'RU';
                const fmt = new PhoneFmt(cntry);
                return fmt.fmtPhone(inp.text, 'documents');
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
            code: (inp, opts) => {
                if (!inp.text?.trim()) return null;
                const cntry = opts.defaultCountry || 'RU';
                const fmt = new PhoneFmt(cntry);
                return fmt.fmtPhone(inp.text, 'web');
            }
        }
    ]
};