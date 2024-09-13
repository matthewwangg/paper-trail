package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/matthewwangg/papertrail-backend/controllers"
)

// SetupNoteRoutes configures the note routes
func SetupNoteRoutes(router *gin.Engine) {
	notes := router.Group("/notes")
	{
		notes.GET("", controllers.GetNotes)
		notes.GET("/:id", controllers.GetNoteByID)
		notes.POST("", controllers.CreateNote)
		notes.PUT("/:id", controllers.UpdateNote)
		notes.DELETE("/:id", controllers.DeleteNote)
	}
}
