package models

import (
	"github.com/golang-jwt/jwt/v5"
)

// Claims struct for JWT claims
type Claims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}
