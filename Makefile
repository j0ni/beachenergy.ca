TESTS = test/*.spec.js
REPORTER = list
TIMEOUT = 100000

watch: npm-install
        @NODE_ENV=test node_modules/.bin/mocha \
                --timeout $(TIMEOUT) \
                --reporter $(REPORTER) \
                --bail \
                --growl \
                --watch \
                $(TESTS)

test:
        NODE_ENV=test node_modules/.bin/mocha \
                --bail \
                --timeout $(TIMEOUT) \
                --reporter $(REPORTER) \
                --growl \
                $(TESTS)
