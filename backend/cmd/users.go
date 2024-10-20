package main

import (
	"github.com/dongsu8142/blog/ent"
	"github.com/gofiber/fiber/v3"
)

type userKey string

const userCtx userKey = "user"

func getUserFromCtx(c fiber.Ctx) *ent.User {
	user, _ := c.Context().Value(userCtx).(*ent.User)
	return user
}
