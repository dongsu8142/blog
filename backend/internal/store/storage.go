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
		Create(context.Context, *ent.Post) error
		Delete(context.Context, int) error
	}
}

func NewStorage(db *ent.Client) Storage {
	return Storage{
		Users: &UserStore{db},
		Posts: &PostStore{db},
	}
}
