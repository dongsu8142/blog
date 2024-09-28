package store

import (
	"context"
	"database/sql"
	"errors"

	"github.com/dongsu8142/blog/ent"
	"github.com/dongsu8142/blog/ent/post"
)

type PostStore struct {
	db *ent.Client
}

func (s *PostStore) Create(ctx context.Context, post *ent.Post) error {
	err := s.db.Post.
		Create().
		SetTitle(post.Title).
		SetContent(post.Content).
		Exec(ctx)
	if err != nil {
		return err
	}

	return nil
}

func (s *PostStore) GetAll(ctx context.Context) ([]*ent.Post, error) {
	posts, err := s.db.Post.Query().Order(ent.Desc(post.FieldCreatedAt)).All(ctx)
	if err != nil {
		return nil, err
	}

	return posts, nil
}

func (s *PostStore) GetByID(ctx context.Context, ID int) (*ent.Post, error) {
	post, err := s.db.Post.Get(ctx, ID)
	if err != nil {
		switch {
		case ent.IsNotFound(err):
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	return post, nil
}

func (s *PostStore) Delete(ctx context.Context, ID int) error {
	err := s.db.Post.DeleteOneID(ID).Exec(ctx)

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
