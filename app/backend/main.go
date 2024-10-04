package main

import (
	"github.com/joho/godotenv"
	"github.com/matthewwangg/papertrail-backend/cmd/app"
	"log"
)

func main() {
	// Load environment variables
	err := godotenv.Overload()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Start the server
	app.StartServer()
}
