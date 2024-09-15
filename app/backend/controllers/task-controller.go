package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/matthewwangg/papertrail-backend/database"
	"github.com/matthewwangg/papertrail-backend/models"
)

// GetTasks retrieves all tasks for the authenticated user
func GetTasks(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	var tasks []models.Task
	result := database.DB.Preload("Tags").Where("user_id = ?", user.ID).Find(&tasks)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, tasks)
}

// GetTaskByID retrieves a task by its ID
func GetTaskByID(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	id := c.Param("id")
	var task models.Task
	result := database.DB.Preload("Tags").Where("user_id = ?", user.ID).First(&task, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}
	c.JSON(http.StatusOK, task)
}

// CreateTask adds a new task
func CreateTask(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	var newTask struct {
		Title       string              `json:"title" binding:"required"`
		Description string              `json:"description"`
		Priority    models.TaskPriority `json:"priority"`
		Tags        []string            `json:"tags"`
	}

	if err := c.ShouldBindJSON(&newTask); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Prepare the task model
	task := models.Task{
		Title:       newTask.Title,
		Description: newTask.Description,
		Status:      models.StatusTodo,
		Priority:    newTask.Priority,
		UserID:      user.ID,
	}

	// Handle tags
	if len(newTask.Tags) > 0 {
		var tags []models.Tag
		for _, tagName := range newTask.Tags {
			var tag models.Tag
			// Find or create the tag
			database.DB.Where("name = ?", tagName).FirstOrCreate(&tag, models.Tag{Name: tagName})
			tags = append(tags, tag)
		}
		task.Tags = tags
	}

	// Save the task to the database
	result := database.DB.Create(&task)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, task)
}

// UpdateTask modifies an existing task
func UpdateTask(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	id := c.Param("id")

	var task models.Task
	result := database.DB.Preload("Tags").Where("user_id = ?", user.ID).First(&task, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	var updatedTask struct {
		Title       string              `json:"title"`
		Description string              `json:"description"`
		Status      models.TaskStatus   `json:"status"`
		Priority    models.TaskPriority `json:"priority"`
		Tags        []string            `json:"tags"`
	}

	if err := c.ShouldBindJSON(&updatedTask); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update task fields
	task.Title = updatedTask.Title
	task.Description = updatedTask.Description
	task.Status = updatedTask.Status
	task.Priority = updatedTask.Priority

	// Handle tags (Clear existing tags and re-assign)
	if len(updatedTask.Tags) > 0 {
		var tags []models.Tag
		for _, tagName := range updatedTask.Tags {
			var tag models.Tag
			// Find or create the tag
			database.DB.Where("name = ?", tagName).FirstOrCreate(&tag, models.Tag{Name: tagName})
			tags = append(tags, tag)
		}
		task.Tags = tags
	}

	// Save the updated task
	saveResult := database.DB.Save(&task)
	if saveResult.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": saveResult.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, task)
}

// DeleteTask removes a task by its ID
func DeleteTask(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	id := c.Param("id")
	var task models.Task
	result := database.DB.Where("user_id = ?", user.ID).First(&task, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}
	deleteResult := database.DB.Delete(&task)
	if deleteResult.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": deleteResult.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Task deleted"})
}

// UpdateTaskStatus changes the status of a task
func UpdateTaskStatus(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	id := c.Param("id")
	var input struct {
		Status models.TaskStatus `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Status != models.StatusTodo && input.Status != models.StatusInProgress && input.Status != models.StatusDone {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status"})
		return
	}

	var task models.Task
	result := database.DB.Where("user_id = ?", user.ID).First(&task, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	task.Status = input.Status
	saveResult := database.DB.Save(&task)
	if saveResult.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": saveResult.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, task)
}
