# Makefile для PopClip-расширения
# Запуск: make release
# Выходной файл: phone-formatter.popclipextz

NAME     := phone-formatter
EXT      := $(NAME).popclipext
ZIP      := $(NAME).popclipextz
CONFIG   := $(EXT)/Config.js
IDENT    := com.nikolalek.$(NAME)

GREEN    := \033[32m
RESET    := \033[0m

.PHONY: all clean zip release push release-gh

# === Основная цель ===
release: clean zip push release-gh
	@echo "$(GREEN)Релиз $(ZIP) создан и загружен в GitHub Releases$(RESET)"

# === Удалить старый .popclipextz ===
clean:
	@rm -f $(ZIP)
	@echo "Очищено: $(ZIP)"

# === Создать .popclipextz ===
zip: $(EXT)
	@zip -r $(ZIP) $(EXT)/
	@echo "Создано: $(ZIP) ($$(du -h $(ZIP) | cut -f1))"

# === Обновить Identifier в Config.js ===
$(CONFIG):
	@echo "Обновляю Identifier → $(IDENT)"
	@plutil -replace Identifier -string "$(IDENT)" -- $(CONFIG) 2>/dev/null || \
	perl -i -pe 's|(Identifier"\s*:\s*")[^"]+|\1$(IDENT)|' $(CONFIG)

# === Запушить изменения в Git ===
push:
	@git add $(EXT) $(CONFIG) Makefile
	@git commit -m "chore: update $(NAME) extension" || echo "Нет изменений для коммита"
	@git push origin main

# === Создать GitHub Release с .popclipextz ===
release-gh: $(ZIP)
	@gh release delete v$$(date +%Y.%m.%d) -y 2>/dev/null || true
	@gh release create v$$(date +%Y.%m.%d) \
		--title "$(NAME) $$(date +%Y.%m.%d)" \
		--notes "Автоматическая сборка" \
		$(ZIP)
	@echo "Релиз: https://github.com/nikolalek/PopClip-Extensions-Phone-Formatter/releases/latest"

# === Проверка ===
check:
	@echo "Содержимое $(EXT):"
	@ls -R $(EXT)
	@unzip -l $(ZIP) | head -10
