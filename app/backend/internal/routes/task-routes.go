package routes

import (
	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth_gin"
	"github.com/gin-gonic/gin"
	"github.com/matthewwangg/papertrail-backend/internal/handlers"
	"github.com/matthewwangg/papertrail-backend/internal/middleware"
	"time"
)

func SetupTaskRoutes(router *gin.Engine) {
	limiter := tollbooth.NewLimiter(5, nil)
	limiter.SetTokenBucketExpirationTTL(time.Minute)

	tasks := router.Group("/tasks")
	tasks.Use(middleware.AuthMiddleware())
	{
		tasks.GET("", tollbooth_gin.LimitHandler(limiter), handlers.GetTasks)
		tasks.GET("/:id", tollbooth_gin.LimitHandler(limiter), handlers.GetTaskByID)
		tasks.GET("/grouped/status", tollbooth_gin.LimitHandler(limiter), handlers.GetTasksGroupedByStatus)
		tasks.GET("/grouped/priority", tollbooth_gin.LimitHandler(limiter), handlers.GetTasksGroupedByPriority)
		tasks.POST("", tollbooth_gin.LimitHandler(limiter), handlers.CreateTask)
		tasks.PUT("/:id", tollbooth_gin.LimitHandler(limiter), handlers.UpdateTask)
		tasks.DELETE("/:id", tollbooth_gin.LimitHandler(limiter), handlers.DeleteTask)
		tasks.PUT("/:id/status", tollbooth_gin.LimitHandler(limiter), handlers.UpdateTaskStatus)
		tasks.PUT("/:id/priority", tollbooth_gin.LimitHandler(limiter), handlers.UpdateTaskPriority)
	}
}
