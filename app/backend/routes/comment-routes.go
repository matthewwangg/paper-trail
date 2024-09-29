package routes

import (
	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth_gin"
	"github.com/gin-gonic/gin"
	"github.com/matthewwangg/papertrail-backend/controllers"
	"github.com/matthewwangg/papertrail-backend/middleware"
	"time"
)

func SetupCommentRoutes(router *gin.Engine) {
	limiter := tollbooth.NewLimiter(5, nil)
	limiter.SetTokenBucketExpirationTTL(time.Minute)

	comments := router.Group("/tasks/:task_id/comments")
	comments.Use(middleware.AuthMiddleware())
	{
		comments.POST("", tollbooth_gin.LimitHandler(limiter), controllers.AddComment)
		comments.GET("", tollbooth_gin.LimitHandler(limiter), controllers.GetComments)
	}
}
