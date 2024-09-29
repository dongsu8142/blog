package store

import (
	"context"
	"database/sql"
	"errors"

	"github.com/dongsu8142/blog/ent"
	"github.com/dongsu8142/blog/ent/user"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrDuplicateEmail    = errors.New("a user with that email already exists")
	ErrDuplicateUsername = errors.New("a user with that username already exists")
)

type UserStore struct {
	db *ent.Client
}

func (s *UserStore) Create(ctx context.Context, user *ent.User) error {
	hash, err := bcrypt.GenerateFromPassword(user.Password, bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	err = s.db.User.
		Create().
		SetUsername(user.Username).
		SetEmail(user.Email).
		SetPassword(hash).
		Exec(ctx)
	if err != nil {
		switch {
		case err.Error() == `ent: constraint failed: pq: duplicate key value violates unique constraint "users_email_key"`:
			return ErrDuplicateEmail
		case err.Error() == `ent: constraint failed: pq: duplicate key value violates unique constraint "users_username_key"`:
			return ErrDuplicateUsername
		default:
			return err
		}
	}

	return nil
}

func (s *UserStore) GetByID(ctx context.Context, ID int) (*ent.User, error) {
	user, err := s.db.User.Get(ctx, ID)
	if err != nil {
		switch {
		case ent.IsNotFound(err):
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	return user, nil
}

func (s *UserStore) GetByUsername(ctx context.Context, Username string) (*ent.User, error) {
	user, err := s.db.User.Query().Where(user.UsernameEQ(Username)).First(ctx)
	if err != nil {
		switch {
		case ent.IsNotFound(err):
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	return user, nil
}

func (s *UserStore) Delete(ctx context.Context, ID int) error {
	err := s.db.User.DeleteOneID(ID).Exec(ctx)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrNotFound
		default:
			return err
		}
	}

	return nil
}
