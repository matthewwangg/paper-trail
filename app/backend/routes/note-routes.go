package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/matthewwangg/papertrail-backend/controllers"
	"github.com/matthewwangg/papertrail-backend/middleware"
)

// SetupNoteRoutes configures the note routes
func SetupNoteRoutes(router *gin.Engine) {
	notes := router.Group("/notes")
	notes.Use(middleware.AuthMiddleware())
	{
		notes.GET("", controllers.GetNotes)
		notes.GET("/:id", controllers.GetNoteByID)
		notes.POST("", controllers.CreateNote)
		notes.PUT("/:id", controllers.UpdateNote)
		notes.DELETE("/:id", controllers.DeleteNote)
	}
}
