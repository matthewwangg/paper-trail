package env

import (
	"github.com/joho/godotenv"
	"log"
)

// LoadEnv loads environment variables from a .env file
func LoadEnv() {
	err := godotenv.Overload()
	if err != nil {
		log.Fatal("Error loading .env file: ", err)
	}
}
