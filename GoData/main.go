package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

func main() {
	ip, defip := os.LookupEnv("GOIP")
	port, defport := os.LookupEnv("GOPORT")

	if !defip {
		ip = "182.18.7.9"
	}

	if !defport {
		port = "8000"
	}

	http.HandleFunc("/", handler)

	fmt.Println("Escuchando por IP:" + ip + " PORT:" + port)

	http.ListenAndServe(":"+port, nil)
}

func handler(w http.ResponseWriter, r *http.Request) {

	enableCors(&w)

	urlPath := r.URL.Path[1:]

	if strings.HasPrefix(urlPath, "api/") {
		// api rest
		trimmedURL := urlPath[4:]

		routePath(w, r, trimmedURL)

	} else {
		// serve files
		log.Print("static file handler: " + urlPath)

		staticFilePath := "./static-files/"

		http.ServeFile(w, r, staticFilePath+urlPath)
	}
}

func routePath(w http.ResponseWriter, request *http.Request, trimURL string) {

	if strings.HasPrefix(trimURL, "analizarjs") {
		b, err := ioutil.ReadAll(request.Body)
		if err != nil {
			panic(err)
		}

		fmt.Print("analizando la entrada de javascript")

		var resp = analizarJsHandler(b)

		w.Write(resp)

	} else if strings.HasPrefix(trimURL, "analizarpy") {
		b, err := ioutil.ReadAll(request.Body)
		if err != nil {
			panic(err)
		}

		fmt.Print("analizando la entrada de python")

		var resp = analizarPyHandler(b)

		w.Write(resp)
	} else if strings.HasPrefix(trimURL, "arboljs") {
		body := getRequest("http://182.18.7.7:3000/api/grafo", "application/pdf")
		fmt.Print(body)
		w.Write(body)
	} else if strings.HasPrefix(trimURL, "arbolpy") {
		body := getRequest("http://182.18.7.8:4000/api/arbol", "application/pdf")
		fmt.Print(body)
		w.Write(body)
	} else if strings.HasPrefix(trimURL, "traduccionjs") {
		body := getRequest("http://182.18.7.7:3000/api/traduccion", "application/javascript")

		w.Write(body)
	} else if strings.HasPrefix(trimURL, "traduccionpy") {
		body := getRequest("http://182.18.7.8:4000/api/traducir", "application/javascript")

		w.Write(body)
	} else if strings.HasPrefix(trimURL, "tokensjs") {

		body := getRequest("http://182.18.7.7:3000/api/tokens", "application/json")

		w.Write(body)

	} else if strings.HasPrefix(trimURL, "tokenspy") {
		body := getRequest("http://182.18.7.8:4000/api/tokens", "application/json")

		w.Write(body)
	}
}

func analizarJsHandler(b []byte) []byte {

	body := postRequest(b, "http://182.18.7.7:3000/api/analizar", "text/plain")

	return body
}

func analizarPyHandler(b []byte) []byte {
	body := postRequest(b, "http://182.18.7.8:4000/api/analizar", "text/plain")

	return body
}

func getErroresHandler() []error {

	body := getRequest("http://localhost:3001/api/errores", "application/json")

	var errores []error

	if err := json.Unmarshal(body, &errores); err != nil {
		panic(err)
	}

	return errores
}

func postRequest(b []byte, url string, content_type string) []byte {
	var client = &http.Client{}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(b))

	if err != nil {
		log.Fatal(err)
	}

	req.Header.Add("Content-Type", content_type)

	res, err := client.Do(req)

	if err != nil {
		log.Fatal(err)
	}

	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)

	if err != nil {
		log.Fatal(err)
	}

	return body

}

func getRequest(url string, content_type string) []byte {
	var client = &http.Client{}

	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		log.Fatal(err)
	}

	req.Header.Add("Content-Type", content_type)

	res, err := client.Do(req)

	if err != nil {
		log.Fatal(err)
	}

	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)

	if err != nil {
		log.Fatal(err)
	}

	return body
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

type error struct {
	Lexema    string
	Linea     int
	Columna   int
	Esperados []string
	Tipo      string
}

type token struct {
	Token   string
	Lexema  string
	Linea   int
	Columna int
}

type response struct {
	Status  int
	Message string
}

type json_response struct {
	Status  int
	Message string
}
