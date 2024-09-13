package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/matthewwangg/papertrail-backend/controllers"
)

func SetupAuthRoutes(router *gin.Engine) {
	auth := router.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
	}
}
