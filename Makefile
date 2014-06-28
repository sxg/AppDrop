test:
	@NODE_ENV=test
	@DATABASE_URL=postgres://appdrop:@localhost:5432/appdroptestdb
	mocha tests --reporter spec

.PHONY: test
