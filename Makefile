TESTS = "test/*.spec.js"
REPORTER = list
TIMEOUT = 100000
MOCHA = ./node_modules/.bin/mocha
JSHINT = ./node_modules/.bin/jshint

watch: npm
	@NODE_ENV=test $(MOCHA) \
		--timeout $(TIMEOUT) \
		--reporter $(REPORTER) \
		--bail \
		--growl \
		--watch \
		$(TESTS)

jshint:
	@$(JSHINT) .

test: npm
	@NODE_ENV=test $(MOCHA) \
		--bail \
		--timeout $(TIMEOUT) \
		--reporter $(REPORTER) \
		$(TESTS)

test-ci: jshint npm
	@NODE_ENV=test $(MOCHA) \
		--timeout $(TIMEOUT) \
		--reporter $(REPORTER) \
		--no-colors \
		$(TESTS)

npm:
	@npm install -d

.PHONY: test test-ci npm watch jshint
