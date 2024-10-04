package routes

import (
	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth_gin"
	"github.com/gin-gonic/gin"
	"github.com/matthewwangg/papertrail-backend/internal/handlers"
	"time"
)

func SetupAuthRoutes(router *gin.Engine) {
	limiter := tollbooth.NewLimiter(5, nil)
	limiter.SetTokenBucketExpirationTTL(time.Minute)

	auth := router.Group("/auth")
	{
		auth.POST("/register", tollbooth_gin.LimitHandler(limiter), handlers.Register)
		auth.POST("/login", tollbooth_gin.LimitHandler(limiter), handlers.Login)
	}
}
