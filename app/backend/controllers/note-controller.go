package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/matthewwangg/papertrail-backend/database"
	"github.com/matthewwangg/papertrail-backend/models"
)

// GetNotes retrieves all notes
func GetNotes(c *gin.Context) {
	var notes []models.Note
	result := database.DB.Find(&notes)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, notes)
}

// GetNoteByID retrieves a note by its ID
func GetNoteByID(c *gin.Context) {
	id := c.Param("id")
	var note models.Note
	result := database.DB.First(&note, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Note not found"})
		return
	}
	c.JSON(http.StatusOK, note)
}

// CreateNote adds a new note
func CreateNote(c *gin.Context) {
	var newNote models.Note
	if err := c.ShouldBindJSON(&newNote); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result := database.DB.Create(&newNote)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusCreated, newNote)
}

// UpdateNote modifies an existing note
func UpdateNote(c *gin.Context) {
	id := c.Param("id")
	var note models.Note
	result := database.DB.First(&note, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Note not found"})
		return
	}
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	saveResult := database.DB.Save(&note)
	if saveResult.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": saveResult.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, note)
}

// DeleteNote removes a note by its ID
func DeleteNote(c *gin.Context) {
	id := c.Param("id")
	var note models.Note
	result := database.DB.First(&note, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Note not found"})
		return
	}
	deleteResult := database.DB.Delete(&note)
	if deleteResult.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": deleteResult.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Note deleted"})
}
