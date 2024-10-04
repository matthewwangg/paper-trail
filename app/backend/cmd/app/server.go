package app

import (
	"github.com/gin-gonic/gin"
	"github.com/matthewwangg/papertrail-backend/internal/database"
	"github.com/matthewwangg/papertrail-backend/internal/routes"
)

func StartServer() {
	// Connect to the database
	database.ConnectDatabase()

	// Create a new router
	router := gin.Default()

	// Setup routes
	routes.SetupAuthRoutes(router)
	routes.SetupNoteRoutes(router)
	routes.SetupTaskRoutes(router)
	routes.SetupCommentRoutes(router)

	// Start the server on port 8080
	err := router.Run(":8080")
	if err != nil {
		panic("Error starting the server: " + err.Error())
	}
}
