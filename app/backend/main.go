package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/matthewwangg/papertrail-backend/database"
	"github.com/matthewwangg/papertrail-backend/routes"
)

func main() {
	// Load environment variables
	err := godotenv.Overload()
	if err != nil {
		panic("Error loading .env file")
	}

	// Connect to the database
	database.ConnectDatabase()

	router := gin.Default()

	// Setup routes
	routes.SetupAuthRoutes(router)
	routes.SetupNoteRoutes(router)
	routes.SetupTaskRoutes(router)
	routes.SetupCommentRoutes(router)

	// Start the server
	router.Run(":8080")
}
