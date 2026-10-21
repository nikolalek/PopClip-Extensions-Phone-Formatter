## What's New

### v2.6.3

**Fixes:**
- Menu no longer appears for dates, IPv4 addresses, decimals, and thousands-separated numbers; a real phone after a date/IP/`/` is still detected
- National trunk prefixes handled: `01` MX, `06` HU, `8` LT, `0` DE/AT/IE/FI; RU `77`/`78` forms fixed
- Manual fallback (bundle unavailable) accepts short valid numbers, keeps numbers that start with the calling code, and splits multiple numbers on `/`
- 7-digit numbers show the menu again
- Unknown country values normalize consistently across the menu, formatter, and GOST guard
- Invalid numbers are rejected instead of passed through when the bundled library is present

**Security:**
- Fixed ReDoS in extension-keyword parsing on long whitespace runs
- 4 KB input guard retained

**Tooling:**
- npm version validated before use in CI
- Release zip verified byte-for-byte against sources; only two files allowed
- Library update build remains read-only; artifact checks added before PR
- `make verify-zip` runs in CI and release

**Tests:**
- 498 checks × 3 seeds + 25 manual-fallback checks
- Added regressions for dates/IPs, trunk prefixes, 7-digit numbers, multi-number slash, invalid inputs, and ReDoS

### v2.6.2

**Fixes:**
- Bundled libphonenumber now really loads in PopClip (IIFE + `module.exports`); previously the CJS bundle failed on frozen exports and silently used manual formatting
- 5–6 digit extensions are no longer dropped (e.g. FR `poste 12345`, DE `ext. 123456`)

**Changes:**
- GOST checkbox removed: GOST now shows automatically for RU (PopClip cannot hide options conditionally)
- Settings and submenu labels localized for all 16 languages
- New submenu icon (`tabler:phone-check`)

**Tooling:**
- CI runs tests on every push/PR and rebuilds the zip when the library updates
- esbuild is pinned; the updater runs in a read-only CI job and installs the package with `--ignore-scripts`
- Added a test for the manual fallback (library unavailable)

### v2.6.1

**Library:**
- Bundled libphonenumber-js updated 1.13.13 → 1.13.15
- Bundle banner carries `@ts-nocheck`, so `make typecheck` skips generated code

**Tooling:**
- `make typecheck` (TypeScript + `@popclip/types`) and `make harness` (PopClip JavaScriptCore load check); release now gates on typecheck and tests
- Dev-only `package.json` / `tsconfig.json`; release zip excludes `*.d.ts`
- Daily lib check workflow: idempotent PR step (skips when a PR is already open, force-updates the bot branch), actions bumped to v7

No formatting behaviour changes.

### v2.6.0

**Fixes:**
- Space-separated extensions no longer dropped (`Durchwahl 123`, `poste 123`, `ext 123`, incl. quoted)
- Bare separators `;123`, `#123` (incl. after closing quote) now parsed as extensions
- `00` IDD prefix converts to `+` with libphonenumber validation
- `#resolveCountry` actually resolves the country (was dead code: `'+7' === '7'` comparison)
- `+60` maps to MY (Malaysia), was ID
- Label typos fixed: `lista` → `lisa`, `DOB` removed; `uitb`, `interno`, `extn`, `extension` added for PHONE_REGEX parity

**Testing:**
- 3717 checks (7 seeds × 531): 50 countries, random valid numbers, 14 dirty formats, 10 extension styles — 100%
- In-repo suite: `make test` (`test/phonefmt.test.js`)

**Output safety:**
- Runtime validation before paste: `contact` = strict E.164, `web` = strict RFC 3966 URI

**Visibility:**
- 📋 GOST item shown only for RU locale (`requirements: option-country=RU`, no entitlements)

**Library:**
- Bundle updated to libphonenumber-js 1.13.13 (latest); `make check-lib` / `make update-lib` keep it fresh
- Daily freshness check: `.github/workflows/libphonenumber.yml` opens a PR when stale

---

## Что нового

### v2.6.3

**Исправления:**
- Меню больше не появляется для дат, IPv4, десятичных дробей и чисел с разделителями тысяч; реальный телефон после даты/IP/`/` определяется
- Обрабатываются национальные trunk-префиксы: `01` MX, `06` HU, `8` LT, `0` DE/AT/IE/FI; исправлены формы RU `77`/`78`
- Ручной fallback (бандл недоступен) принимает короткие валидные номера, не путает номера, начинающиеся с кода страны, и разделяет несколько номеров через `/`
- 7-значные номера снова показывают меню
- Неизвестная страна нормализуется одинаково в меню, форматере и ГОСТ
- Невалидные номера отклоняются, а не передаются как есть, когда встроенная библиотека доступна

**Безопасность:**
- Исправлен ReDoS в разборе добавочных на длинных последовательностях пробелов
- Лимит ввода 4 КБ сохранён

**Инструменты:**
- Версия из npm валидируется до использования в CI
- Релизный zip сверяется с исходниками побайтно; допускаются только два файла
- Сборка обновления библиотеки остаётся read-only; добавлены проверки артефакта перед PR
- `make verify-zip` запускается в CI и при релизе

**Тесты:**
- 498 проверок × 3 сида + 25 проверок ручного fallback
- Добавлены регрессии на даты/IP, trunk-префиксы, 7-значные номера, несколько номеров через `/`, невалидный ввод и ReDoS

### v2.6.1

**Библиотека:**
- Бандл libphonenumber-js обновлён 1.13.13 → 1.13.15
- В баннер бандла добавлен `@ts-nocheck`, чтобы `make typecheck` не проверял сгенерированный код

**Инструменты:**
- `make typecheck` (TypeScript + `@popclip/types`) и `make harness` (загрузка в JavaScriptCore PopClip); релиз теперь гейтится типами и тестами
- Dev-файлы `package.json` / `tsconfig.json`; в zip не попадают `*.d.ts`
- Ежедневная проверка библиотеки: идемпотентный шаг PR (пропуск при открытом PR, force-обновление ветки бота), actions обновлены до v7

Поведение форматирования не изменилось.

### v2.6.0

**Исправления:**
- Добавочные через пробел больше не теряются (`Durchwahl 123`, `poste 123`, `ext 123`, в т.ч. в кавычках)
- «Голые» разделители `;123`, `#123` (в т.ч. после закрывающей кавычки) теперь распознаются как добавочные
- Префикс `00` (IDD, E.123) конвертируется в `+` с проверкой через libphonenumber
- `#resolveCountry` реально резолвит страну (было мёртвым кодом: сравнение `'+7' === '7'`)
- `+60` маппится на MY (Малайзия), был ID
- Опечатки меток: `lista` → `lisa`, `DOB` удалён; добавлены `uitb`, `interno`, `extn`, `extension` для паритета с PHONE_REGEX

**Тестирование:**
- 3717 проверок (7 сидов × 531): 50 стран, случайные валидные номера, 14 «грязных» форматов, 10 стилей добавочных — 100%
- Тесты в репозитории: `make test` (`test/phonefmt.test.js`)

**Безопасность вывода:**
- Runtime-валидация перед вставкой: `contact` — строгий E.164, `web` — строгий RFC 3966 URI

**Видимость:**
- Пункт 📋 ГОСТ показывается только при стране RU (`requirements: option-country=RU`, без ентайтлментов)

**Библиотека:**
- Бандл обновлён до libphonenumber-js 1.13.13 (latest); `make check-lib` / `make update-lib` следят за свежестью
- Ежедневная проверка свежести: `.github/workflows/libphonenumber.yml` открывает PR при устаревании

### v2.5.0

**Критические исправления:**
- Номера с `isValid()=false` теперь отклоняются (ранее передавались в fallback)
- Исправлена обработка множественных плюсов (`++`, `+++`, `++++`)

**Новые функции:**
- Модификатор **Option (⌥)** — инвертирует формат документа (intl ↔ natl)
- Улучшенное определение страны из кода номера

**Улучшения:**
- 41/41 тест проходят
- Улучшена документация

---

## Installation / Установка

1. Download / Скачайте `phone-formatter.popclipextz`
2. Double-click to install / Дважды кликните для установки
3. Set your default country in extension settings / Настройте страну по умолчанию в параметрах расширения

## Support / Поддержка

- [Report an issue / Сообщить об ошибке](https://github.com/nikolalek/PopClip-Extensions-Phone-Formatter/issues)
- [Documentation / Документация](https://github.com/nikolalek/PopClip-Extensions-Phone-Formatter#readme)
