CSS_SRC := src/assets/sass
CSS_OUT := src/assets/css
CSS_FLAGS := -t expanded --sourcemap=none
CSS_TARGETS=$(patsubst $(CSS_SRC)/%.scss,%.css,$(wildcard $(CSS_SRC)/*.scss))

.PHONY: all
all: css

css: $(CSS_TARGETS)

.SECONDEXPANSION:
%.css: $(CSS_SRC)/$$*.scss
	@sass $(CSS_FLAGS) $? $(CSS_OUT)/$@

clean:
	rm -rf .sass-cache/

