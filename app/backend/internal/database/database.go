package database

import (
	"fmt"
	"github.com/matthewwangg/papertrail-backend/internal/models"
	"github.com/matthewwangg/papertrail-backend/pkg/logger"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() error {
	var err error

	// Validate required environment variables
	requiredEnvVars := []string{"DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", "DB_PORT"}
	for _, envVar := range requiredEnvVars {
		if os.Getenv(envVar) == "" {
			logger.Log.WithField("env_var", envVar).Error("Environment variable is not set")
			return fmt.Errorf("environment variable %s is not set", envVar)
		}
	}

	// Database connection string
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	// Open connection
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		logger.Log.WithError(err).Error("Failed to connect to database")
		return err
	}

	logger.Log.Info("Database connection successfully opened")

	// Migrate the schema
	err = DB.AutoMigrate(&models.User{}, &models.Note{}, &models.Task{}, &models.Tag{}, &models.Comment{})
	if err != nil {
		logger.Log.WithError(err).Error("Failed to migrate database")
		return err
	}

	logger.Log.Info("Database migrated successfully")
	return nil
}
