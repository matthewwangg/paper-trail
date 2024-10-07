package middleware

import (
	"github.com/matthewwangg/papertrail-backend/internal/database"
	"github.com/matthewwangg/papertrail-backend/internal/models"
	"github.com/matthewwangg/papertrail-backend/pkg/logger"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret []byte

func AuthMiddleware() gin.HandlerFunc {

	// Check if the JWT_SECRET is set
	if jwtSecret == nil {
		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			logger.Log.Fatal("JWT_SECRET environment variable not set")
			panic("JWT_SECRET environment variable not set")
		}
		jwtSecret = []byte(secret)
	}

	return func(c *gin.Context) {
		// Get the token from the Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			logger.Log.Warn("Authorization header missing")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}

		// Extract the token from the header
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			logger.Log.Warn("Invalid authorization header format")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			return
		}

		tokenString := parts[1]

		// Parse the token
		claims := &models.Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			logger.Log.WithError(err).Warn("Invalid token")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// Find the user
		var user models.User
		result := database.DB.First(&user, claims.UserID)
		if result.Error != nil {
			logger.Log.WithField("userID", claims.UserID).Warn("User not found")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}

		logger.Log.WithField("userID", claims.UserID).Info("Authenticated user successfully")

		// Attach user to context
		c.Set("user", user)

		c.Next()
	}
}
