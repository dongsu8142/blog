package store

import (
	"context"

	"github.com/dongsu8142/blog/ent"
)

type CommentStore struct {
	db *ent.Client
}

func (s *CommentStore) Create(ctx context.Context, comment *ent.Comment) error {
	return s.db.Comment.Create().
		SetPostID(comment.PostID).
		SetAuthorID(comment.AuthorID).
		SetContent(comment.Content).
		Exec(ctx)
}
