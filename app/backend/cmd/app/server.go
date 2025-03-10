package app

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/matthewwangg/papertrail-backend/internal/database"
	"github.com/matthewwangg/papertrail-backend/internal/routes"
	"github.com/matthewwangg/papertrail-backend/pkg/logger"
	"github.com/matthewwangg/papertrail-backend/pkg/validator"
	"os"
	"time"
)

func StartServer() {
	// Setup Validator
	validator.InitValidator()

	// Setup Logger
	logger.SetupLogger()

	// Connect to the database
	if err := database.ConnectDatabase(); err != nil {
		logger.Log.Fatal("Failed to connect to the database: ", err)
	}

	// Create a new router
	router := gin.Default()

	// Apply the logging middleware
	router.Use(logger.GinLogger())

	allowOrigins := []string{os.Getenv("DEV_ALLOW_ORIGINS")}
	if env := os.Getenv("ENV"); env == "production" {
		allowOrigins = []string{"PROD_ALLOW_ORIGINS"}
	}

	// Apply CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins: allowOrigins,
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{
			"Authorization",
			"Content-Type",
			"Accept",
			"Origin",
			"X-Requested-With",
			"X-Custom-Header",
		},
		ExposeHeaders: []string{
			"Content-Length",
			"Authorization",
		},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Setup routes
	routes.SetupAuthRoutes(router)
	routes.SetupNoteRoutes(router)
	routes.SetupTaskRoutes(router)
	routes.SetupCommentRoutes(router)

	// Start the server on port 8080
	if err := router.Run(":8080"); err != nil {
		logger.Log.Fatal("Error starting the server: ", err)
	}
}
