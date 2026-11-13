## What's New

### v2.7.0

**Fixes:**
- Formatting no longer discards the text around a number: `Звонить 84951234567 сегодня` → `Звонить +74951234567 сегодня`; list separators stay as typed (`/`, `;`, `,`)
- GOST menu item is hidden when the selection has no RU-formattable number; a foreign number under RU country used to show a dead item
- Full-width digits (`８４９５…`) are normalized (NFKC) before matching
- Number lists with extensions no longer lose the first number (`84951234567 ext. 12, 84957654321` formats both)
- Brackets and parentheses around a number are consumed as a pair instead of being half-deleted
- The menu appears only when the selection actually formats: dates, times and IPs no longer produce dead items; dotted numbers (`8495.123.45.67`) show it again
- Whitespace, indentation and CRLF line endings around numbers are preserved as typed
- Korean `내선` and Thai `ต่อ` are recognised, so document output can be re-parsed; locale keys fixed to `pt-BR` / `zh-Hans`
- Manual fallback: parenthesized and 1-digit extensions work, US numbers starting with `1` are rejected
- All bracket types (`[]`, `{}`, `()`) that wrap an extension behave the same: `[84951234567 ext. 12]` no longer hides the menu and `{…}` no longer leaks braces into the output
- A bare parenthesized extension (`8 495 123-45-67 (123)`) is recognised in both the library and manual paths
- A stray `+` inside a number (`+7+4951234567`) is removed instead of passing through unchanged; a space before the number is kept

**Tooling:**
- `strict` typecheck enabled (`noImplicitAny` stays off until the JS gets annotations)
- `make jsc` runs Config.js in the real JavaScriptCore; new macOS CI job
- Tests: 689 checks × 3 seeds + 59 fallback; deterministic country sampling for shared calling codes (+7 RU/KZ, +1 US/CA), extension-bound and output-guard mutation tests

---

## Что нового

### v2.7.0

**Исправления:**
- Форматирование больше не выбрасывает текст вокруг номера: `Звонить 84951234567 сегодня` → `Звонить +74951234567 сегодня`; разделители списка сохраняются как в исходнике (`/`, `;`, `,`)
- Пункт ГОСТ скрывается, если в выделении нет номера РФ; раньше иностранный номер при стране RU показывал нерабочий пункт
- Полноширинные цифры (`８４９５…`) нормализуются (NFKC) до разбора
- Списки с добавочными больше не теряют первый номер (`84951234567 ext. 12, 84957654321` форматирует оба)
- Скобки вокруг номера поглощаются парой, а не удаляются наполовину
- Меню показывается только когда выделение действительно форматируется: даты, время и IP больше не дают нерабочих пунктов; точечные номера (`8495.123.45.67`) снова видны
- Пробелы, отступы и переводы строк CRLF вокруг номеров сохраняются как набраны
- Корейский `내선` и тайский `ต่อ` распознаются, поэтому документный вывод разбирается обратно; ключи локалей исправлены на `pt-BR` / `zh-Hans`
- Ручной fallback: добавочные в скобках и однозначные работают, номера США с ведущей `1` отклоняются
- Все виды скобок (`[]`, `{}`, `()`) вокруг добавочного обрабатываются одинаково: `[84951234567 ext. 12]` больше не скрывает меню, `{…}` не оставляет скобки в выводе
- Добавочный в голых скобках (`8 495 123-45-67 (123)`) распознаётся и в библиотечном, и в ручном пути
- Лишний `+` внутри номера (`+7+4951234567`) убирается, а не проходит насквозь; пробел перед номером сохраняется

**Инструменты:**
- Включён `strict` в typecheck (`noImplicitAny` пока выключен — в JS нет аннотаций)
- `make jsc` запускает Config.js в настоящем JavaScriptCore; новая macOS-джоба в CI
- Тесты: 689 проверок × 3 сида + 59 проверок fallback; детерминированная выборка стран с общими кодами (+7 RU/KZ, +1 US/CA), тесты границ добавочного и guard вывода

---

## Installation / Установка

1. Download / Скачайте `phone-formatter.popclipextz`
2. Double-click to install / Дважды кликните для установки
3. Set your default country in extension settings / Настройте страну по умолчанию в параметрах расширения

## Support / Поддержка

- [Report an issue / Сообщить об ошибке](https://github.com/nikolalek/PopClip-Extensions-Phone-Formatter/issues)
- [Documentation / Документация](https://github.com/nikolalek/PopClip-Extensions-Phone-Formatter#readme)
