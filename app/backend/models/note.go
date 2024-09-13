package models

import (
	"gorm.io/gorm"
)

// Note represents a note object
type Note struct {
	gorm.Model
	Title   string `json:"title"`
	Content string `json:"content"`
}
