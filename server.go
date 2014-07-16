package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/codegangsta/negroni"
	"github.com/coopernurse/gorp"
	_ "github.com/lib/pq"
	"github.com/sghodas/AppDrop/models"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		db, err := sql.Open("postgres", "postgres://appdrop:@localhost:5432/appdropdb?sslmode=disable")
		if err != nil {
			panic(err)
		}

		dbmap := &gorp.DbMap{Db: db, Dialect: gorp.PostgresDialect{}}
		var results []models.Build
		_, err = dbmap.Select(&results, "select * from build")
		if err != nil {
			panic(err)
		}

		s, err := json.Marshal(results)
		fmt.Fprint(w, string(s))
	})

	n := negroni.Classic()
	n.UseHandler(mux)
	n.Run(":5000")
}
