package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/matthewwangg/papertrail-backend/controllers"
	"github.com/matthewwangg/papertrail-backend/middleware"
)

func SetupTaskRoutes(router *gin.Engine) {
	tasks := router.Group("/tasks")
	tasks.Use(middleware.AuthMiddleware())
	{
		tasks.GET("", controllers.GetTasks)
		tasks.GET("/:id", controllers.GetTaskByID)
		tasks.POST("", controllers.CreateTask)
		tasks.PUT("/:id", controllers.UpdateTask)
		tasks.DELETE("/:id", controllers.DeleteTask)
		tasks.PUT("/:id/status", controllers.UpdateTaskStatus)
	}
}
