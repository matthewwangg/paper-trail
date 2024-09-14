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
	TaskID      uint       `gorm:"primaryKey;autoIncrement" json:"task_id"` // Explicit task_id field
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Status      TaskStatus `json:"status"`
	UserID      uint       `json:"user_id"`
}
