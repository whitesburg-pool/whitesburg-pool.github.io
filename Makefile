.PHONY: all
all: generate

.PHONY: generate
generate:
	@echo "Generating site..."
	@bundle exec jekyll build --quiet

.PHONY: clean
clean:
	@bundle exec jekyll clean

.PHONY: serve
serve:
	@bundle exec jekyll serve
