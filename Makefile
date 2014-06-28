test:
	@NODE_ENV=test
	@DATABASE_URL=postgres://appdrop:@localhost:5432/appdroptestdb
	mocha test --reporter spec

.PHONY: test
