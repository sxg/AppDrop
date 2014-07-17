package api

import (
	"database/sql"
	"github.com/coopernurse/gorp"
	_ "github.com/lib/pq" // This is the PostgreSQL driver for the Go sql package
)

func db() *gorp.DbMap {
	// TODO: make the connection URL an environmental variable
	db, err := sql.Open("postgres", "postgres://appdrop:@localhost:5432/appdropdb?sslmode=disable")
	if err != nil {
		panic(err)
	}
	return &gorp.DbMap{Db: db, Dialect: gorp.PostgresDialect{}}
}
