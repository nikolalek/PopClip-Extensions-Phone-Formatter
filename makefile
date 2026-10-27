# Makefile для PopClip-расширения
# Использование:
#   make release          - создать релиз (VERSION из файла)
#   make release V=2.6.0  - создать релиз с конкретной версией
#   make zip              - только собрать .popclipextz
#   make check            - проверить состояние
#   make list             - показать релизы
#   make rollback V=x.x.x - удалить релиз

# ---
# 1. Обновить версию
#    make version V=2.5.1
# 2. Закоммить
#    git add . && git commit -m "release: v2.5.1"
# 3. Создай релиз
#    make release
# Готово! Релиз на GitHub с тегом v2.5.1
# ---

NAME     := phone-formatter
EXT      := $(NAME).popclipext
ZIP      := $(NAME).popclipextz
CONFIG   := $(EXT)/Config.js
POPCLIP  ?= /Applications/PopClip.app/Contents/MacOS/PopClip
INSTALLED := $(HOME)/Library/Application Support/PopClip/Extensions/$(EXT)

# Версия из аргумента или из файла. Фильтр на месте рождения значения: VERSION
# контролируется контентом PR, и $(V) подставляется в shell-рецепты как есть.
# V= с командной строки — доверенный ввод оператора (как у rollback).
V        ?= $(shell grep -E '^[0-9]+(\.[0-9]+)*$$' VERSION 2>/dev/null)
# Один аргумент = одна строка: перенос строки или пробел в $(V) ломает
# shell-рецепты (grep-проверки линейны и такой обход пропускают).
$(if $(word 2,$(V)),$(error V=$(V) содержит пробел или перенос строки — отмена))
TAG      := v$(V)

GREEN    := \033[32m
YELLOW   := \033[33m
RED      := \033[31m
RESET    := \033[0m

.PHONY: all clean zip verify-zip install check-installed release check check-version-sync version list rollback test check-lib update-lib typecheck harness jsc

# === Основная цель ===
release: check-clean check-version check-version-sync typecheck test zip verify-zip git-tag gh-release
	@echo ""
	@echo "$(GREEN)✓ Релиз $(TAG) создан$(RESET)"
	@echo "  https://github.com/nikolalek/PopClip-Extensions-Phone-Formatter/releases/tag/$(TAG)"

# === Проверки ===
check-clean:
	@if ! git diff --quiet HEAD 2>/dev/null || [ -n "$$(git ls-files --others --exclude-standard)" ]; then \
		echo "$(YELLOW)⚠ Есть незакоммиченные изменения$(RESET)"; \
		echo "  Выполните: git add . && git commit -m '...''"; \
		exit 1; \
	fi

check-version:
	@test -n "$(V)" || (echo "$(RED)✗ VERSION отсутствует или пуст$(RESET)"; exit 1)
	@if git tag -l 2>/dev/null | grep -q "^$(TAG)$$"; then \
		echo "$(RED)✗ Тег $(TAG) уже существует$(RESET)"; \
		echo "  Используйте: make release V=x.x.x с новой версией"; \
		exit 1; \
	fi

# VERSION должен совпадать с бейджами README и секцией в RELEASE_NOTES
check-version-sync:
	@test -n "$(V)" || (echo "$(RED)✗ VERSION отсутствует или пуст$(RESET)"; exit 1)
	@grep -q "version-$(V)-green" README.md && grep -q "version-$(V)-green" README.ru.md || \
		(echo "$(RED)✗ Бейдж версии не совпадает с VERSION ($(V)) в README.md/README.ru.md$(RESET)"; exit 1)
	@grep -q "^### v$(V)\b" RELEASE_NOTES.md || \
		(echo "$(RED)✗ В RELEASE_NOTES.md нет секции v$(V)$(RESET)"; exit 1)
	@echo "$(GREEN)✓$(RESET) Версии синхронизированы ($(V))"

# === Обновить версию ===
version:
	@printf '%s' '$(V)' | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$$' || \
		(echo "$(RED)✗ V=$(V) не похож на x.y.z — отмена$(RESET)"; exit 1)
	@echo "$(V)" > VERSION
	@echo "$(GREEN)Версия: $(V)$(RESET)"

# === Сборка ===
clean:
	@rm -f $(ZIP)
	@echo "Очищено: $(ZIP)"

zip: $(EXT)
	@rm -f $(ZIP)
	@zip -qr $(ZIP) $(CONFIG) $(LIBFILE)
	@SIZE=$$(du -h $(ZIP) | cut -f1); \
	echo "$(GREEN)✓$(RESET) Создано: $(ZIP) ($$SIZE)"

verify-zip: $(ZIP)
	@test "$$(unzip -Z1 $(ZIP) | sort)" = "$$(printf '%s\n' '$(CONFIG)' '$(LIBFILE)' | sort)" || \
		(echo "$(RED)✗ zip содержит посторонние файлы$(RESET)"; exit 1)
	@unzip -p $(ZIP) $(CONFIG) | cmp - $(CONFIG)
	@unzip -p $(ZIP) $(LIBFILE) | cmp - $(LIBFILE)
	@echo "$(GREEN)✓$(RESET) zip совпадает с исходниками"

# === Локальная установка ===
install:
	@mkdir -p "$(INSTALLED)"
	@cp $(CONFIG) $(LIBFILE) "$(INSTALLED)/"
	@open -a PopClip
	@echo "$(GREEN)✓$(RESET) Установлено в $(INSTALLED)"

check-installed:
	@if [ -d "$(INSTALLED)" ] && cmp -s $(CONFIG) "$(INSTALLED)/Config.js" && cmp -s $(LIBFILE) "$(INSTALLED)/libphonenumber-max.js"; then \
		echo "$(GREEN)✓$(RESET) Установленная копия совпадает с репозиторием"; \
	else \
		echo "$(YELLOW)⚠$(RESET) Установлена устаревшая копия (или расширение не установлено) — выполните: make install"; \
	fi

# === Git операции ===
git-tag:
	@git tag -a $(TAG) -m "Release $(TAG)"
	@git push origin $(TAG)
	@echo "$(GREEN)✓$(RESET) Тег $(TAG) создан и отправлен"

# === GitHub Release ===
gh-release: $(ZIP)
	@echo "$(GREEN)Создаю GitHub Release $(TAG)...$(RESET)"
	@if [ -f RELEASE_NOTES.md ]; then \
		gh release create $(TAG) --title "$(NAME) $(TAG)" --notes-file=RELEASE_NOTES.md $(ZIP); \
	else \
		gh release create $(TAG) --title "$(NAME) $(TAG)" --notes "См. CHANGELOG.md" $(ZIP); \
	fi || { echo "$(RED)✗ gh release create не удался — тег уже отправлен, откат: make rollback V=$(V)$(RESET)"; exit 1; }

# === Среда разработки (popclip.app/dev/js-environment) ===
# TypeScript в PopClip встроен (sucrase, сборка не нужна); здесь только проверка
# типов через @popclip/types и официальный CLI-харнесс PopClip.
typecheck:
	@test -x node_modules/.bin/tsc || (echo "$(RED)✗ выполните: npm install$(RESET)"; exit 1)
	@npx tsc --noEmit && echo "$(GREEN)✓$(RESET) Типы OK"

harness:
	@$(POPCLIP) run $(CONFIG) && echo "$(GREEN)✓$(RESET) PopClip загрузил модуль (JavaScriptCore)"

# Тот же движок без PopClip (для CI и локальных прогонов).
JSC ?= $(firstword $(wildcard /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Resources/jsc))
jsc:
	@test -x "$(JSC)" || (echo "$(RED)✗ jsc не найден: $(JSC)$(RESET)"; exit 1)
	@cd $(EXT) && "$(JSC)" ../test/jsc-harness.js

# === Тесты ===
test:
	@node --check $(CONFIG) && echo "$(GREEN)✓$(RESET) Синтаксис Config.js"
	@node test/phonefmt.test.js
	@SEED=0x123456 node test/phonefmt.test.js
	@SEED=7 node test/phonefmt.test.js
	@node test/no-lib.test.js

# === Библиотека libphonenumber ===
# Бандл собирается из npm-пакета libphonenumber-js (ветка max, IIFE, offline).
# IIFE + footer: sandbox PopClip делает `exports` доступным только для чтения,
# поэтому CJS-бандл там не загружается. Footer кладёт библиотеку в globalThis
# и в module.exports — обычный `require(...)` возвращает её напрямую.
# Версия зашита баннером в начало libphonenumber-max.js — по нему check-lib
# понимает, что встроено. Файлы без баннера (старые) всегда считаются устаревшими.
LIBFILE  := $(EXT)/libphonenumber-max.js
LIBPKG   := libphonenumber-js
LIBBUILD := max/index.cjs
LIBVER   = $(shell grep -o '$(LIBPKG)@[0-9][0-9.]*' $(LIBFILE) 2>/dev/null | head -1 | cut -d@ -f2)
LIBLATEST ?= $(shell python3 -c "import json,urllib.request; print(json.load(urllib.request.urlopen('https://registry.npmjs.org/$(LIBPKG)/latest', timeout=30))['version'])" 2>/dev/null | grep -E '^[0-9]+(\.[0-9]+)*$$')

check-lib:
	@echo "Встроена: $(or $(LIBVER),неизвестно — обновите через make update-lib)"
	@echo "Latest:   $(or $(LIBLATEST),реестр недоступен)"

update-lib:
	@if [ -z "$(LIBLATEST)" ]; then echo "$(RED)✗ Реестр npm недоступен$(RESET)"; exit 1; fi
	@if [ -n "$(LIBVER)" ] && [ "$(LIBVER)" = "$(LIBLATEST)" ] && [ -z "$(FORCE)" ]; then \
		echo "$(GREEN)✓$(RESET) Актуальна ($(LIBVER))"; \
	else \
		echo "Обновляю $(LIBVER) → $(LIBLATEST)..."; \
		test -x node_modules/.bin/esbuild || (echo "$(RED)✗ выполните: npm install$(RESET)"; exit 1); \
		TMP=$$(mktemp -d) && trap 'rm -rf "$$TMP"' EXIT && \
		(cd "$$TMP" && npm pack "$(LIBPKG)@$(LIBLATEST)" --silent --ignore-scripts >/dev/null) && \
		tar -xzf "$$TMP/$(LIBPKG)-$(LIBLATEST).tgz" -C "$$TMP" && \
		node_modules/.bin/esbuild "$$TMP/package/$(LIBBUILD)" --bundle --platform=node --format=iife --minify \
			--global-name=libphonenumber \
			--banner:js="// @ts-nocheck $(LIBPKG)@$(LIBLATEST) max bundle (IIFE, offline)" \
			--footer:js="globalThis.libphonenumber = libphonenumber; if (typeof module === 'object') module.exports = libphonenumber;" --outfile="$(LIBFILE)" && \
		rm -rf "$$TMP" && \
		$(MAKE) test; \
	fi

# === Утилиты ===
check:
	@echo "$(GREEN)=== Содержимое $(EXT) ===$(RESET)"
	@ls -la $(EXT)/ 2>/dev/null || echo "  Папка не найдена"
	@echo ""
	@echo "$(GREEN)=== Текущая версия ===$(RESET)"
	@echo "  $(V)"
	@echo ""
	@echo "$(GREEN)=== Последние теги ===$(RESET)"
	@git tag -l 'v*' | tail -5 2>/dev/null || echo "  Нет тегов"
	@echo ""
	@echo "$(GREEN)=== Последние релизы ===$(RESET)"
	@gh release list --limit 5 2>/dev/null || echo "  gh CLI не настроен или не в git репозитории"

list:
	@echo "$(GREEN)Релизы:$(RESET)"
	@gh release list --limit 10

# === Откат последнего релиза ===
rollback:
ifneq ($(origin V),command line)
	@echo "$(RED)✗ Укажите версию: make rollback V=x.x.x$(RESET)"
	@exit 1
else
	@printf '%s\n' '$(V)' | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$$' || \
		(echo "$(RED)✗ V=$(V) не похож на x.y.z — отмена$(RESET)"; exit 1)
	@echo "$(YELLOW)Удаление релиза $(TAG)...$(RESET)"
	@gh release delete $(TAG) -y 2>/dev/null || echo "  Релиз не найден"
	@git tag -d $(TAG) 2>/dev/null || echo "  Тег не найден локально"
	@git push origin :refs/tags/$(TAG) 2>/dev/null || echo "  Тег не найден удалённо"
	@echo "$(GREEN)✓ Релиз $(TAG) удалён$(RESET)"
endif

# === Помощь ===
help:
	@echo "Использование:"
	@echo "  make release        - создать релиз (версия из VERSION файла)"
	@echo "  make release V=x.x.x  - создать релиз с конкретной версией"
	@echo "  make version V=x.x.x  - обновить версию в файлах"
	@echo "  make zip            - собрать .popclipextz"
	@echo "  make test           - синтаксис + тесты форматирования"
	@echo "  make check-version-sync - VERSION ↔ README-бейджи ↔ RELEASE_NOTES"
	@echo "  make typecheck      - типы (@popclip/types + tsc)"
	@echo "  make harness        - загрузка Config.js в среде PopClip (JSC)"
	@echo "  make check-lib      - встроенная vs последняя версия libphonenumber"
	@echo "  make update-lib     - скачать и пересобрать бандл при необходимости"
	@echo "  make check          - проверить состояние"
	@echo "  make list           - показать релизы"
	@echo "  make rollback V=x.x - удалить релиз"