package main

import (
	"net/http"

	"github.com/dongsu8142/blog/ent"
)

type CreateCommentPayload struct {
	Content string `json:"content" validate:"required,max=1000"`
}

func (app *application) createCommentHandler(w http.ResponseWriter, r *http.Request) {
	var payload CreateCommentPayload
	user := getUserFromCtx(r)
	post := getPostFromCtx(r)

	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	comment := &ent.Comment{
		AuthorID: user.ID,
		PostID:   post.ID,
		Content:  payload.Content,
	}

	ctx := r.Context()
	app.store.Comments.Create(ctx, comment)
}
