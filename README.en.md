<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/lang-Русский 🇷🇺-red?style=for-the-badge"></a>
  <a href="https://www.popclip.app/extensions/"><img src="https://img.shields.io/badge/PopClip-Extension-blue?style=for-the-badge&logo=apple">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge"></a>
</p>

# 📱 PopClip Phone Formatter

A PopClip extension for intelligent phone number formatting with extension support and localization in 15 languages.
---
## Screenshots
### PopClip Settings Panel
Select a locale for formatting your phone number. 
![PopClip Settings Panel in action](screenshot1.png)
---
### PopClip panel
The formatting button appears when you select a number.
![PopClip panel in action](screenshot.png)
---
## ✨ Features

- **Three output formats**:
  - 📱 **Contacts**: E.164 format (`+19175551234,123`)
  - 📄 **Documents**: International format (`+1 917 555 1234 ext. 123`)
  - 🌐 **Web**: tel: URI (`tel:+19175551234;ext=123`)

- **Extension support**: Automatic recognition and formatting
- **42 countries**: From Russia to Luxembourg
- **15 interface languages**: Full localization
- **Smart recognition**: Works with various input formats

## 🚀 Installation

1. Make sure you have [PopClip](https://pilotmoon.com/popclip/) installed
2. Download `phone-formatter.popclipext` from [Releases](../../releases/latest)
3. Double-click the file to install
4. Configure default country in extension settings

## 📖 Usage

1. Select a phone number in any app
2. Choose the desired format from PopClip menu:
   - 📱 **Contacts** — for adding to phone book
   - 📄 **Documents** — for inserting into documents
   - 🌐 **Web** — for creating clickable links

### Examples

| Input | Contacts | Documents | Web |
|-------|----------|-----------|-----|
| `(917) 555-1234` | `+19175551234` | `+1 917 555 1234` | `tel:+19175551234` |
| `+1(917)555-1234 ext.123` | `+19175551234,123` | `+1 917 555 1234 ext. 123` | `tel:+19175551234;ext=123` |
| `tel:+79001234567;ext=456` | `+79001234567,456` | `+7 900 123 45 67 доб. 456` | `tel:+79001234567;ext=456` |

## 🌍 Supported Countries

<details>
<summary>Full list (42 countries)</summary>

| Country | Code | Number Length | Extensions |
|---------|------|---------------|------------|
| 🇺🇸 United States | +1 | 10-11 | 2-6 digits |
| 🇷🇺 Russia | +7 | 10-11 | 2-6 digits |
| 🇩🇪 Germany | +49 | 10-12 | 2-5 digits |
| 🇬🇧 United Kingdom | +44 | 10-11 | 2-5 digits |
| 🇫🇷 France | +33 | 10 | 2-4 digits |
| ... and 37 other countries |

</details>

## 🛠 Technical Details

- **Library**: [libphonenumber-js](https://unpkg.com/libphonenumber-js/bundle/libphonenumber-js.min.js) for accurate parsing
- **Fallback**: Custom parser when library unavailable
- **Compatibility**: PopClip 4200+
- **Localization**: 15 interface languages

## 📝 License

MIT License - see [LICENSE](LICENSE)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and create a pull request

## 🐛 Report Issues

Create an [issue](../../issues) with problem description and phone number example.

---

<p align="center">
  Made with ❤️ for PopClip community
</p>

