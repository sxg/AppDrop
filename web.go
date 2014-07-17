package main

import (
	"github.com/codegangsta/negroni"
	"github.com/sghodas/AppDrop/api"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", api.CreateAccount)

	n := negroni.Classic()
	n.UseHandler(mux)
	n.Run(":5000")
}
