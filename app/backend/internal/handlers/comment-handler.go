package handlers

import (
	"github.com/matthewwangg/papertrail-backend/internal/database"
	"github.com/matthewwangg/papertrail-backend/internal/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// AddComment adds a comment to a task
func AddComment(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	taskID, err := strconv.Atoi(c.Param("task_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var input struct {
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	comment := models.Comment{
		Content: input.Content,
		TaskID:  uint(taskID),
		UserID:  user.ID,
	}

	result := database.DB.Create(&comment)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, comment)
}

// GetComments retrieves comments for a task
func GetComments(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	taskID, err := strconv.Atoi(c.Param("task_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var comments []models.Comment
	result := database.DB.Where("task_id = ? AND user_id = ?", taskID, user.ID).Find(&comments)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, comments)
}
