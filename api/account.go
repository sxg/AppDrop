package api

import (
	"code.google.com/p/go.crypto/bcrypt"
	"time"
)

const bcryptCost int = 10

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

// NewAccount creates a basic user account.
// The password will be hashed.
func NewAccount(name, email, password string) *Account {
	byteHash, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
	passwordHash := string(byteHash)
	if err != nil {
		panic(err)
	}

	return &Account{
		Name:         &name,
		Email:        &email,
		PasswordHash: &passwordHash,
	}
}
