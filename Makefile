PYTHON ?= python3
NODE ?= node
PORT ?= 18765
WEB_DIR := web
ARTIFACTS := .artifacts
URL := http://127.0.0.1:$(PORT)/index.html

.PHONY: dev test check

$(ARTIFACTS):
	mkdir -p $@

dev: $(ARTIFACTS)
	@echo "Serving $(WEB_DIR)/ at $(URL)"
	@exec $(PYTHON) -m http.server $(PORT) --directory $(WEB_DIR)

test: $(ARTIFACTS)
	$(NODE) --test $(WEB_DIR)/tests/game.test.js

check: test
	@set -eu; \
	$(MAKE) --no-print-directory dev > $(ARTIFACTS)/check-server.log 2>&1 & \
	server_pid=$$!; \
	trap 'kill $$server_pid 2>/dev/null || true; wait $$server_pid 2>/dev/null || true' EXIT INT TERM; \
	for attempt in 1 2 3 4 5 6 7 8 9 10; do \
		if curl --fail --silent $(URL) >/dev/null; then \
			echo "Dev server OK: $(URL)"; \
			exit 0; \
		fi; \
		sleep 1; \
	done; \
	echo "Dev server failed: $(URL)" >&2; \
	exit 1
