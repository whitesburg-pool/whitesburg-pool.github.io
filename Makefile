HOST := "ftp.whitesburgpool.org"
FTP_USERNAME := "automation"
FTP_URL := "ftp://$(FTP_USERNAME)@$(HOST)"
LOCAL_SITE_DIR := "_site"
REMOTE_SITE_DIR := "/httpdocs"

.PHONY: all
all: publish

publish: generate
	@echo "Publishing to $(FTP_URL)..."
	@echo "You will now be prompted for the password for the ftp user 'automation'..."
	@lftp -c " \
		set ftp:list-options -a; \
		set ftp:ssl-allow no; \
		set cmd:fail-exit yes; \
		open '$(FTP_URL)'; \
		mirror --reverse --delete --parallel=2 --verbose --exclude-glob *.pyc --exclude-glob venv/ \
			$(LOCAL_SITE_DIR) $(REMOTE_SITE_DIR);\
	"

generate:
	@echo "Generating site..."
	@jekyll build --quiet

clean: pyc-clean
	@jekyll clean
