package store

import (
	"context"
	"errors"

	"github.com/dongsu8142/blog/ent"
)

var ErrNotFound = errors.New("resource not found")

type Storage struct {
	Users interface {
		GetByID(context.Context, int) (*ent.User, error)
		GetByUsername(context.Context, string) (*ent.User, error)
		Create(context.Context, *ent.User) error
		Delete(context.Context, int) error
	}
	Posts interface {
		GetAll(context.Context) ([]*ent.Post, error)
		GetByID(context.Context, int) (*ent.Post, error)
		Create(context.Context, *ent.Tx, *ent.Post) (*ent.Post, error)
		CreateAndTags(ctx context.Context, post *ent.Post, tags []string) error
		Delete(context.Context, int) error
	}
}

func NewStorage(db *ent.Client) Storage {
	return Storage{
		Users: &UserStore{db},
		Posts: &PostStore{db},
	}
}

func withTx(db *ent.Client, ctx context.Context, fn func(*ent.Tx) error) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	if err := fn(tx); err != nil {
		_ = tx.Rollback()
		return err
	}

	return tx.Commit()
}
