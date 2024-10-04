package models

import (
	"gorm.io/gorm"
)

// Define task status options
type TaskStatus string

const (
	StatusTodo       TaskStatus = "To Do"
	StatusInProgress TaskStatus = "In Progress"
	StatusDone       TaskStatus = "Done"
)

// Define task priority options
type TaskPriority string

const (
	PriorityLow    TaskPriority = "low"
	PriorityMedium TaskPriority = "medium"
	PriorityHigh   TaskPriority = "high"
)

// Task model with priority and tags
type Task struct {
	gorm.Model
	Title       string       `json:"title"`
	Description string       `json:"description"`
	Status      TaskStatus   `json:"status"`
	Priority    TaskPriority `json:"priority"`
	UserID      uint         `json:"user_id"`
	Tags        []Tag        `gorm:"many2many:task_tags" json:"tags"`
}
