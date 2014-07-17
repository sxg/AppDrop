package api

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// CreateAccount returns a handler to create an account for a new AppDrop user
func CreateAccount(w http.ResponseWriter, r *http.Request) {
	dbMap := db()
	var results []Build
	_, err := dbMap.Select(&results, "select * from build")
	if err != nil {
		panic(err)
	}

	s, err := json.Marshal(results)
	fmt.Fprint(w, string(s))
}
