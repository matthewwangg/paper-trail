package models

import (
	"gorm.io/gorm"
)

type Comment struct {
	gorm.Model
	Content string `json:"content"`
	TaskID  uint   `json:"task_id"`
	UserID  uint   `json:"user_id"`
}
