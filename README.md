<p align="center">
  <a href="README.ru.md"><img src="https://img.shields.io/badge/lang-Русский-red?style=flat-square"></a>
  <img src="https://img.shields.io/badge/PopClip-4200+-blue?style=flat-square&logo=apple">
  <img src="https://img.shields.io/badge/version-2.6.0-green?style=flat-square">
  <img src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square">
</p>

<h1 align="center">📱 PopClip Phone Formatter</h1>

<p align="center">
  <strong>Intelligent phone number formatting for macOS</strong><br>
  <sub>Supports 42 countries • 16 languages • Extensions • E.164, E.123, RFC 3966, GOST</sub>
</p>

---

## Features

**Four output formats (submenu):**

| Format | Output | Use Case |
|--------|--------|----------|
| 📱 **Contacts** | `+19175551234,123` | Address books, CRM (E.164) |
| 📄 **Documents** | `+1 917 555 1234 ext. 123` | Emails, documents (E.123) |
| 📋 **GOST** | `+7 (900) 123-45-67, доб. 123` | RU documents (GOST R 7.0.97-2016, RU locale only) |
| 🌐 **Web** | `tel:+19175551234;ext=123` | Clickable links (RFC 3966) |

**Key capabilities:**

- ✅ Automatic extension detection (`доб.`, `ext.`, `x`, `#`, `,`, `;`, `Durchwahl`, `poste`, …)
- ✅ Smart parsing of messy input (`++`, `00`-prefix, quotes, `Тел:`, `tel:` URIs)
- ✅ Validated against bundled `libphonenumber-max.js` (offline-first)
- ✅ Runtime output guard: strict E.164 / RFC 3966 check before paste
- ✅ Modifier key: hold **Option (⌥)** on **Documents** to invert format (intl ↔ natl)
- ✅ Full manual fallback when the library rejects input

## Screenshots

| Settings Panel | PopClip Menu |
|:--------------:|:------------:|
| <img src="screenshot1.png" width="300"> | <img src="screenshot.png" width="300"> |

## Installation

1. Install [PopClip](https://pilotmoon.com/popclip/) (version 4200+)
2. Download `phone-formatter.popclipextz` from [Releases](https://github.com/nikolalek/PopClip-Extensions-Phone-Formatter/releases/latest)
3. Double-click to install
4. Set your default country in extension settings

## Usage

**Basic:**
1. Select any phone number
2. Hover the 📱 button and pick a format from the submenu

**Advanced:**
- Hold **Option (⌥)** when clicking **Documents** to invert format (intl ↔ natl)
- **GOST** appears only when the country option is RU

### Supported Input Formats

| Input Type | Example |
|------------|---------|
| International | `+1 (917) 555-1234` |
| IDD prefix | `0019175551234` |
| National | `(917) 555-1234` / `8 (900) 123-45-67` |
| Plain digits | `19175551234` |
| With extension | `+19175551234 ext. 123`, `+79001234567 доб. 123`, `+442079460958#123` |
| URI format | `tel:+19175551234;ext=123` |
| Multiple plus signs | `++19175551234` |

### Output Examples

| Input | Contacts | Documents (intl) | Web |
|-------|----------|------------------|-----|
| `(917) 555-1234` | `+19175551234` | `+1 917 555 1234` | `tel:+19175551234` |
| `8 900 123 45 67` | `+79001234567` | `+7 900 123 45 67` | `tel:+79001234567` |
| `+44 20 7946 0958 x123` | `+442079460958,123` | `+44 20 7946 0958 ext. 123` | `tel:+442079460958;ext=123` |

## Supported Countries

<details>
<summary><strong>View all 42 countries</strong></summary>

| Country | Code | National Length | Ext. Length |
|---------|------|-----------------|-------------|
| 🇷🇺 Russia | +7 | 10 | 2-6 |
| 🇺🇸 United States | +1 | 10 | 2-6 |
| 🇬🇧 United Kingdom | +44 | 10-11 | 2-5 |
| 🇩🇪 Germany | +49 | 10-11 | 2-5 |
| 🇫🇷 France | +33 | 9 | 2-4 |
| 🇨🇳 China | +86 | 11 | 2-5 |
| 🇯🇵 Japan | +81 | 10-11 | 2-4 |
| 🇰🇷 South Korea | +82 | 9-10 | 2-5 |
| 🇧🇷 Brazil | +55 | 10-11 | 2-5 |
| 🇮🇳 India | +91 | 10 | 2-5 |
| 🇦🇺 Australia | +61 | 9 | 2-5 |
| 🇨🇦 Canada | +1 | 10 | 2-6 |
| 🇲🇽 Mexico | +52 | 10-11 | 2-4 |
| 🇮🇹 Italy | +39 | 9-11 | 2-4 |
| 🇪🇸 Spain | +34 | 9 | 2-4 |
| 🇳🇱 Netherlands | +31 | 9 | 2-4 |
| 🇵🇱 Poland | +48 | 9 | 2-4 |
| 🇹🇷 Turkey | +90 | 10 | 2-4 |
| 🇹🇭 Thailand | +66 | 9 | 2-4 |
| 🇸🇪 Sweden | +46 | 7-9 | 2-4 |
| 🇳🇴 Norway | +47 | 8 | 2-4 |
| 🇩🇰 Denmark | +45 | 8 | 2-4 |
| 🇫🇮 Finland | +358 | 9 | 2-4 |
| 🇦🇹 Austria | +43 | 9-13 | 2-4 |
| 🇨🇭 Switzerland | +41 | 9 | 2-4 |
| 🇧🇪 Belgium | +32 | 9 | 2-4 |
| 🇮🇪 Ireland | +353 | 9 | 2-4 |
| 🇵🇹 Portugal | +351 | 9 | 2-4 |
| 🇬🇷 Greece | +30 | 10 | 2-4 |
| 🇨🇿 Czech Republic | +420 | 9 | 2-4 |
| 🇭🇺 Hungary | +36 | 9 | 2-4 |
| 🇷🇴 Romania | +40 | 9 | 2-4 |
| 🇧🇬 Bulgaria | +359 | 8-9 | 2-4 |
| 🇭🇷 Croatia | +385 | 8-9 | 2-4 |
| 🇸🇮 Slovenia | +386 | 8 | 2-4 |
| 🇸🇰 Slovakia | +421 | 9 | 2-4 |
| 🇱🇹 Lithuania | +370 | 8 | 2-4 |
| 🇱🇻 Latvia | +371 | 8 | 2-4 |
| 🇪🇪 Estonia | +372 | 7-8 | 2-4 |
| 🇨🇾 Cyprus | +357 | 8 | 2-4 |
| 🇲🇹 Malta | +356 | 8 | 2-4 |
| 🇱🇺 Luxembourg | +352 | 9 | 2-4 |

</details>

## Localization

Interface available in 16 languages:

> English, Русский, Deutsch, Français, 中文, 日本語, Italiano, Español, Nederlands, Polski, Português (BR), 한국어, Tiếng Việt, Türkçe, Slovenčina, Dansk

## Technical Details

<details>
<summary><strong>Architecture</strong></summary>

```
Input → Clean & Parse Extension → libphonenumber-max (bundled, offline)
                                          ↓
                                     isValid()?
                                     ┌────┴────┐
                                    YES        NO → try default country → else manual fallback
                                     ↓
                               Format E.164
                                     ↓
                    Format by type (contact/document/gost/web)
                                     ↓
                     Spec guard (E.164 / RFC 3966) → Add extension
```

**Validation flow:**
1. Clean input (remove garbage, fix `+++` → `+`, `00` → `+` with lib check)
2. Try bundled `libphonenumber` parsing (resolve country from `+CC`, RU/KZ `8`/`7` trunk fix)
3. If parsed but `isValid() = false` → retry with default country, else manual fallback
4. Format according to output type; strict regex guard for `contact`/`web`

**Tests:** `make test` runs `test/phonefmt.test.js` — randomized conformance across 50 countries (E.164 vs library, E.123/GOST non-empty, RFC 3966 shape).

</details>

<details>
<summary><strong>Dependencies</strong></summary>

- **Runtime**: `libphonenumber-max.js` (bundled UMD, ~250 KB, offline)
- **Updates**: `make check-lib` shows bundled vs latest; `make update-lib` rebuilds the bundle from npm when stale
- **Platform**: PopClip 4200+
- **OS**: macOS 11+

</details>

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Reporting Issues

Found a bug? Please [open an issue](https://github.com/nikolalek/PopClip-Extensions-Phone-Formatter/issues) with:

- Input phone number
- Expected output
- Actual output
- PopClip version

## Changelog

### v2.6.0
- **New**: 📋 GOST submenu item (GOST R 7.0.97-2016), visible only for RU locale
- **New**: runtime output guard — strict E.164 / RFC 3966 check before paste
- **New**: repo test suite (`make test`, `test/phonefmt.test.js`) — 3717 randomized checks, 100%
- Fixed: space-separated extensions dropped (`Durchwahl 123`, `poste 123`, quoted `ext 123`)
- Fixed: bare `;123` / `#123` separators (incl. after closing quote)
- Fixed: `00` IDD prefix → `+` conversion with library validation
- Fixed: dead `#resolveCountry` (country resolution now works, incl. RU/KZ split)
- Fixed: `+60` mapped to MY (was ID); label typos (`lista` → `lisa`)

<details>
<summary><strong>Previous versions</strong></summary>

### v2.5.1
- **Critical fix**: Numbers with `isValid()=false` now rejected (not fallback)
- Fixed handling of multiple plus signs (`++`, `+++`, etc.)
- Added Option (⌥) modifier for format inversion
- Improved country detection from country code
- 41/41 tests passing

### v2.4.0
- Added Option (⌥) modifier support
- Improved document formatting

### v2.3.0
- Added modifier key infrastructure
- Fixed extension parsing

</details>

## License

[MIT](LICENSE) © nikolalek

---

<p align="center">
  <sub>Made with ❤️ for the PopClip community</sub>
</p>
