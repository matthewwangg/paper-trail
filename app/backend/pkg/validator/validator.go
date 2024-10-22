package validator

import (
	"github.com/go-playground/validator/v10"
	"log"
)

var Validate *validator.Validate

// InitValidator initializes the validator instance
func InitValidator() {
	Validate = validator.New()
}

// ValidateStruct validates a struct based on tags
func ValidateStruct(data interface{}) error {
	err := Validate.Struct(data)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			log.Printf("Validation failed on field '%s' with condition '%s'", err.Field(), err.ActualTag())
		}
		return err
	}
	return nil
}
