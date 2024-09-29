package database

import (
	"fmt"
	"os"

	"github.com/matthewwangg/papertrail-backend/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	var err error

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
		panic("Failed to connect to database!")
	}

	fmt.Println("Database connection successfully opened")

	// Migrate the schema
	err = DB.AutoMigrate(&models.User{}, &models.Note{}, &models.Task{}, &models.Tag{}, &models.Comment{})
	if err != nil {
		panic("Failed to migrate database!")
	}
	fmt.Println("Database Migrated")

}
