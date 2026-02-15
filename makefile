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
IDENT    := com.nikolalek.$(NAME)

# Версия из аргумента или из файла
V        ?= $(shell cat VERSION 2>/dev/null || echo "2.5.0")
TAG      := v$(V)

GREEN    := \033[32m
YELLOW   := \033[33m
RED      := \033[31m
RESET    := \033[0m

.PHONY: all clean zip release check version list rollback

# === Основная цель ===
release: check-clean check-version zip git-tag gh-release
	@echo ""
	@echo "$(GREEN)✓ Релиз $(TAG) создан$(RESET)"
	@echo "  https://github.com/nikolalek/PopClip-Extensions-Phone-Formatter/releases/tag/$(TAG)"

# === Проверки ===
check-clean:
	@git diff --quiet HEAD 2>/dev/null || ( \
		echo "$(YELLOW)⚠ Есть незакоммиченные изменения$(RESET)"; \
		echo "  Выполните: git add . && git commit -m '...''"; \
		exit 1 \
	)

check-version:
	@if git tag -l 2>/dev/null | grep -q "^$(TAG)$$"; then \
		echo "$(RED)✗ Тег $(TAG) уже существует$(RESET)"; \
		echo "  Используйте: make release V=x.x.x с новой версией"; \
		exit 1; \
	fi

# === Обновить версию ===
version:
	@echo "$(V)" > VERSION
	@echo "$(GREEN)Версия: $(V)$(RESET)"
# Обновить версию в Config.js если есть поле version
	@if [ -f "$(CONFIG)" ]; then \
		perl -i -pe 's/("version"\s*:\s*)"[\d.]+"/$$1"$(V)"/gi' $(CONFIG) 2>/dev/null || true; \
	fi

# === Сборка ===
clean:
	@rm -f $(ZIP)
	@echo "Очищено: $(ZIP)"

zip: $(EXT)
	@rm -f $(ZIP)
	@zip -qr $(ZIP) $(EXT)/
	@SIZE=$$(du -h $(ZIP) | cut -f1); \
	echo "$(GREEN)✓$(RESET) Создано: $(ZIP) ($$SIZE)"

# === Git операции ===
git-tag:
	@git tag -a $(TAG) -m "Release $(TAG)"
	@git push origin $(TAG)
	@echo "$(GREEN)✓$(RESET) Тег $(TAG) создан и отправлен"

# === GitHub Release ===
gh-release: $(ZIP)
	@echo "$(GREEN)Создаю GitHub Release $(TAG)...$(RESET)"
	@if [ -f RELEASE_NOTES.md ]; then \
		NOTES="--notes-file=RELEASE_NOTES.md"; \
	else \
		NOTES="--notes='См. CHANGELOG.md'"; \
	fi; \
	gh release create $(TAG) \
		--title "$(NAME) $(TAG)" \
		$$NOTES \
		$(ZIP)

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
ifndef V
	@echo "$(RED)✗ Укажите версию: make rollback V=x.x.x$(RESET)"
	@exit 1
endif
	@echo "$(YELLOW)Удаление релиза $(TAG)...$(RESET)"
	@gh release delete $(TAG) -y 2>/dev/null || echo "  Релиз не найден"
	@git tag -d $(TAG) 2>/dev/null || echo "  Тег не найден локально"
	@git push origin :refs/tags/$(TAG) 2>/dev/null || echo "  Тег не найден удалённо"
	@echo "$(GREEN)✓ Релиз $(TAG) удалён$(RESET)"

# === Помощь ===
help:
	@echo "Использование:"
	@echo "  make release        - создать релиз (версия из VERSION файла)"
	@echo "  make release V=2.6  - создать релиз с версией 2.6"
	@echo "  make version V=2.6  - обновить версию в файлах"
	@echo "  make zip            - собрать .popclipextz"
	@echo "  make check          - проверить состояние"
	@echo "  make list           - показать релизы"
	@echo "  make rollback V=x.x - удалить релиз"