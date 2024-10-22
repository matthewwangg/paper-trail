package models

// RegisterInput struct for registration input
type RegisterInput struct {
	Username string `json:"username" binding:"required,min=3,max=20"`
	Password string `json:"password" binding:"required,min=8"`
}
