package models

import (
	"gorm.io/gorm"
)

type TaskStatus string

const (
	StatusTodo       TaskStatus = "To Do"
	StatusInProgress TaskStatus = "In Progress"
	StatusDone       TaskStatus = "Done"
)

type Task struct {
	gorm.Model
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Status      TaskStatus `json:"status"`
	UserID      uint       `json:"user_id"`
}
