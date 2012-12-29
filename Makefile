TESTS = test/*.spec.js
REPORTER = list
TIMEOUT = 100000
MOCHA = node_modules/.bin/mocha

watch: npm-install
	@NODE_ENV=test $(MOCHA) \
		--timeout $(TIMEOUT) \
		--reporter $(REPORTER) \
		--bail \
		--growl \
		--watch \
		$(TESTS)

test: npm-install
	@NODE_ENV=test $(MOCHA) \
		--bail \
		--timeout $(TIMEOUT) \
		--reporter $(REPORTER) \
		$(TESTS)

test-ci: npm-install
	@NODE_ENV=test $(MOCHA) \
		--timeout $(TIMEOUT) \
		--reporter $(REPORTER) \
		--no-colors \
		$(TESTS)

npm-install:
	@npm install -d

.PHONY: test test-ci npm-install watch
