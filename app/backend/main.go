package main

import (
	"github.com/matthewwangg/papertrail-backend/cmd/app"
	"github.com/matthewwangg/papertrail-backend/pkg/env"
)

func main() {
	// Load environment variables
	env.LoadEnv()

	// Start the server
	app.StartServer()
}
