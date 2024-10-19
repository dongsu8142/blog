package main

import (
	"net/http"

	"github.com/dongsu8142/blog/ent"
)

type userKey string

const userCtx userKey = "user"

func getUserFromCtx(r *http.Request) *ent.User {
	user, _ := r.Context().Value(userCtx).(*ent.User)
	return user
}
