package pagination

import (
	"math"

	"gorm.io/gorm"
)

type PaginationResult struct {
	Data        interface{} `json:"data"`        // Paginated data
	TotalItems  int64       `json:"totalItems"`  // Total number of records
	TotalPages  int         `json:"totalPages"`  // Total pages
	PageSize    int         `json:"pageSize"`    // Items per page
	CurrentPage int         `json:"currentPage"` // Current page number
}

func Paginate(db *gorm.DB, model interface{}, page, pageSize int) (PaginationResult, error) {
	var totalItems int64
	db.Model(model).Count(&totalItems)

	totalPages := int(math.Ceil(float64(totalItems) / float64(pageSize)))
	offset := (page - 1) * pageSize

	var results []interface{}
	err := db.Model(model).
		Offset(offset).  // Skip records
		Limit(pageSize). // Limit number of records
		Find(&results).  // Fetch data
		Error

	if err != nil {
		return PaginationResult{}, err
	}

	return PaginationResult{
		Data:        results,
		TotalItems:  totalItems,
		TotalPages:  totalPages,
		PageSize:    pageSize,
		CurrentPage: page,
	}, nil
}
