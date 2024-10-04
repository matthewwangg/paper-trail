package routes

import (
	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth_gin"
	"github.com/gin-gonic/gin"
	"github.com/matthewwangg/papertrail-backend/internal/handlers"
	"github.com/matthewwangg/papertrail-backend/internal/middleware"
	"time"
)

// SetupNoteRoutes configures the note routes
func SetupNoteRoutes(router *gin.Engine) {
	limiter := tollbooth.NewLimiter(5, nil)
	limiter.SetTokenBucketExpirationTTL(time.Minute)

	notes := router.Group("/notes")
	notes.Use(middleware.AuthMiddleware())
	{
		notes.GET("", tollbooth_gin.LimitHandler(limiter), handlers.GetNotes)
		notes.GET("/:id", tollbooth_gin.LimitHandler(limiter), handlers.GetNoteByID)
		notes.POST("", tollbooth_gin.LimitHandler(limiter), handlers.CreateNote)
		notes.PUT("/:id", tollbooth_gin.LimitHandler(limiter), handlers.UpdateNote)
		notes.DELETE("/:id", tollbooth_gin.LimitHandler(limiter), handlers.DeleteNote)
	}
}
