package store

import (
	"context"
	"database/sql"
	"errors"

	"github.com/dongsu8142/blog/ent"
	"github.com/dongsu8142/blog/ent/post"
	entTag "github.com/dongsu8142/blog/ent/tag"
	"github.com/dongsu8142/blog/ent/user"
)

type PostStore struct {
	db *ent.Client
}

func (s *PostStore) Create(ctx context.Context, tx *ent.Tx, post *ent.Post) (*ent.Post, error) {
	post, err := tx.Post.
		Create().
		SetTitle(post.Title).
		SetContent(post.Content).
		SetAuthorID(post.AuthorID).
		Save(ctx)
	if err != nil {
		return nil, err
	}

	return post, nil
}

func (s *PostStore) CreateAndTags(ctx context.Context, post *ent.Post, tags []string) error {
	return withTx(s.db, ctx, func(tx *ent.Tx) error {
		post, err := s.Create(ctx, tx, post)
		if err != nil {
			return nil
		}
		if err := s.createPostTags(ctx, tx, post, tags); err != nil {
			return nil
		}
		return nil
	})
}

func (s *PostStore) createPostTags(ctx context.Context, tx *ent.Tx, post *ent.Post, tags []string) error {
	for _, tag := range tags {
		// 태그가 존재하는지 확인하고, 없으면 생성
		t, err := tx.Tag.Query().Where(entTag.Name(tag)).Only(ctx)
		if ent.IsNotFound(err) {
			t, err = tx.Tag.Create().SetName(tag).Save(ctx)
			if err != nil {
				return err
			}
		} else if err != nil {
			return err
		}

		// 포스트에 태그 추가
		_, err = tx.Post.UpdateOne(post).AddTags(t).Save(ctx)
		if err != nil {
			return err
		}
	}
	return nil
}

func (s *PostStore) GetAll(ctx context.Context) ([]*ent.Post, error) {
	user, err := s.db.Post.Query().
		Order(ent.Desc(post.FieldCreatedAt)).
		WithAuthor(func(q *ent.UserQuery) {
			q.Select(user.FieldUsername)
		}).
		WithTags().
		All(ctx)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *PostStore) GetByID(ctx context.Context, ID int) (*ent.Post, error) {
	post, err := s.db.Post.Query().
		WithAuthor(func(q *ent.UserQuery) {
			q.Select(user.FieldUsername)
		}).
		WithTags().
		Where(post.ID(ID)).
		Only(ctx)
	if err != nil {
		switch {
		case ent.IsNotFound(err):
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	post, err = post.Update().AddViews(1).Save(ctx)

	if err != nil {
		return nil, err
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
