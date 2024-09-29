package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/matthewwangg/papertrail-backend/controllers"
	"github.com/matthewwangg/papertrail-backend/middleware"
)

func SetupCommentRoutes(router *gin.Engine) {
	comments := router.Group("/tasks/:task_id/comments")
	comments.Use(middleware.AuthMiddleware())
	{
		comments.POST("", controllers.AddComment)
		comments.GET("", controllers.GetComments)
	}
}
