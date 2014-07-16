package models

import (
	"time"
)

// App collects all builds associated with a particular mobile app
type App struct {
	UUID         *string    `json:"uuid"`
	Private      *bool      `json:"private"`
	PasswordHash *string    `json:"password_hash" db:"password_hash"`
	Name         *string    `json:"name"`
	AccountID    *int64     `json:"account_id" db:"account_id"`
	AppID        *int64     `json:"app_id" db:"app_id"`
	CreatedAt    *time.Time `json:"created_at" db:"created_at"`
}
