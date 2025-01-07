package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username     string `gorm:"unique" json:"username" validate:"required,min=3,max=20"`
	Password     string `json:"-" validate:"required,min=8"`
	RefreshToken string `json:"-"`
	Notes        []Note `json:"notes"`
}
