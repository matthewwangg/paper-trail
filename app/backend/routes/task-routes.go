package routes

import (
	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth_gin"
	"github.com/gin-gonic/gin"
	"github.com/matthewwangg/papertrail-backend/controllers"
	"github.com/matthewwangg/papertrail-backend/middleware"
	"time"
)

func SetupTaskRoutes(router *gin.Engine) {
	limiter := tollbooth.NewLimiter(5, nil)
	limiter.SetTokenBucketExpirationTTL(time.Minute)
	
	tasks := router.Group("/tasks")
	tasks.Use(middleware.AuthMiddleware())
	{
		tasks.GET("", tollbooth_gin.LimitHandler(limiter), controllers.GetTasks)
		tasks.GET("/:id", tollbooth_gin.LimitHandler(limiter), controllers.GetTaskByID)
		tasks.POST("", tollbooth_gin.LimitHandler(limiter), controllers.CreateTask)
		tasks.PUT("/:id", tollbooth_gin.LimitHandler(limiter), controllers.UpdateTask)
		tasks.DELETE("/:id", tollbooth_gin.LimitHandler(limiter), controllers.DeleteTask)
		tasks.PUT("/:id/status", tollbooth_gin.LimitHandler(limiter), controllers.UpdateTaskStatus)
	}
}
