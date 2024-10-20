package main

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/dongsu8142/blog/ent"
	"github.com/dongsu8142/blog/internal/store"
	"github.com/gofiber/fiber/v3"
)

type postKey string

const postCtx postKey = "post"

type CreatePostPayload struct {
	Title   string   `json:"title" validate:"required,max=100"`
	Content string   `json:"content" validate:"required,max=1000"`
	Tags    []string `json:"tags" validate:"required"`
}

func (app *application) createPostHandler(c fiber.Ctx) error {
	var payload CreatePostPayload
	if err := readJSON(c, &payload); err != nil {
		return app.badRequestResponse(c, err)
	}

	user := getUserFromCtx(c)

	post := &ent.Post{
		Title:    payload.Title,
		Content:  payload.Content,
		AuthorID: user.ID,
	}

	ctx := c.Context()

	if err := app.store.Posts.CreateAndTags(ctx, post, payload.Tags); err != nil {
		return app.internalServerError(c, err)
	}

	if err := app.jsonResponse(c, http.StatusCreated, post); err != nil {
		return app.internalServerError(c, err)
	}
	return nil
}

func (app *application) getPostsHandler(c fiber.Ctx) error {
	ctx := c.Context()

	post, err := app.store.Posts.GetAll(ctx)
	if err != nil {
		return app.internalServerError(c, err)
	}

	if err := app.jsonResponse(c, http.StatusOK, post); err != nil {
		return app.internalServerError(c, err)
		
	}

	return nil
}

func (app *application) getPostHandler(c fiber.Ctx) error {
	post := getPostFromCtx(c)

	if err := app.jsonResponse(c, http.StatusOK, post); err != nil {
		return app.internalServerError(c, err)
	}

	return nil
}

func (app *application) postsContextMiddleware() fiber.Handler {
	return func(c fiber.Ctx) error {
		idParam := c.Params("postID")
		id, err := strconv.ParseInt(idParam, 10, 64)
		if err != nil {
			return app.internalServerError(c, err)
		}

		ctx := c.Context()

		post, err := app.store.Posts.GetByID(ctx, int(id))
		if err != nil {
			switch {
			case errors.Is(err, store.ErrNotFound):
				return app.notFoundResponse(c, err)
			default:
				return app.internalServerError(c, err)
			}
		}

		ctx.SetUserValue(postCtx, post)

		return c.Next()
	}
}

func getPostFromCtx(c fiber.Ctx) *ent.Post {
	post, _ := c.Context().Value(postCtx).(*ent.Post)
	return post
}
