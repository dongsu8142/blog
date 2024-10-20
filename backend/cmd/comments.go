package main

import (
	"net/http"

	"github.com/dongsu8142/blog/ent"
	"github.com/gofiber/fiber/v3"
)

type CreateCommentPayload struct {
	Content string `json:"content" validate:"required,max=1000"`
}

func (app *application) createCommentHandler(c fiber.Ctx) error {
	var payload CreateCommentPayload
	user := getUserFromCtx(c)
	post := getPostFromCtx(c)

	if err := readJSON(c, &payload); err != nil {
		return app.badRequestResponse(c, err)
	}

	comment := &ent.Comment{
		AuthorID: user.ID,
		PostID:   post.ID,
		Content:  payload.Content,
	}

	ctx := c.Context()
	if err := app.store.Comments.Create(ctx, comment); err!= nil {
		return app.internalServerError(c, err)
	}

	if err := app.jsonResponse(c, http.StatusCreated, comment); err != nil {
		return app.internalServerError(c, err)
	}
	return nil
}
