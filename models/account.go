package models

import (
	"time"
)

// Account represents a user of AppDrop
type Account struct {
	AccountID      *int64     `json:"account_id" db:"account_id"`
	Name           *string    `json:"name"`
	Email          *string    `json:"email"`
	PasswordHash   *string    `json:"-" db:"password_hash" `
	CreatedAt      *time.Time `json:"created_at" db:"created_at"`
	TokenExpiresAt *time.Time `json:"-" db:"token_expires_at"`
	Token          *string    `json:"token"`
	Permission     *string    `json:"permission"`
}
