package routes

import (
	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth_gin"
	"github.com/gin-gonic/gin"
	"github.com/matthewwangg/papertrail-backend/controllers"
	"github.com/matthewwangg/papertrail-backend/middleware"
	"time"
)

// SetupNoteRoutes configures the note routes
func SetupNoteRoutes(router *gin.Engine) {
	limiter := tollbooth.NewLimiter(5, nil)
	limiter.SetTokenBucketExpirationTTL(time.Minute)

	notes := router.Group("/notes")
	notes.Use(middleware.AuthMiddleware())
	{
		notes.GET("", tollbooth_gin.LimitHandler(limiter), controllers.GetNotes)
		notes.GET("/:id", tollbooth_gin.LimitHandler(limiter), controllers.GetNoteByID)
		notes.POST("", tollbooth_gin.LimitHandler(limiter), controllers.CreateNote)
		notes.PUT("/:id", tollbooth_gin.LimitHandler(limiter), controllers.UpdateNote)
		notes.DELETE("/:id", tollbooth_gin.LimitHandler(limiter), controllers.DeleteNote)
	}
}
