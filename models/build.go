package models

import (
	"time"
)

// Build is one version of an app that will be distributed
type Build struct {
	BuildNumber      *string    `json:"build_number" db:"build_number"`
	Version          *string    `json:"version"`
	DownloadCount    *int64     `json:"download_count" db:"download_count"`
	BundleID         *string    `json:"bundle_id" db:"bundle_id"`
	BuildID          *string    `json:"build_id" db:"build_id"`
	AccountID        *int64     `json:"account_id" db:"account_id"`
	DownloadedLastAt *time.Time `json:"downloaded_last_at" db:"downloaded_last_at"`
	CreatedAt        *time.Time `json:"created_at" db:"created_at"`
}
