package main

import (
	"net/http"
	"time"

	"github.com/dongsu8142/blog/ent"
	"github.com/dongsu8142/blog/internal/store"
	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type LoginPayload struct {
	Username string `json:"username" validate:"required,max=100"`
	Password string `json:"password" validate:"required,min=3,max=72"`
}

type RegisterPayload struct {
	Username string `json:"username" validate:"required,max=100"`
	Email    string `json:"email" validate:"required,email,max=255"`
	Password string `json:"password" validate:"required,min=3,max=72"`
}

func (app *application) loginHandler(c fiber.Ctx)error {
	var payload LoginPayload
	if err := readJSON(c, &payload); err != nil {
		return app.badRequestResponse(c, err)
	}

	user, err := app.store.Users.GetByUsername(c.Context(), payload.Username)
	if err != nil {
		switch err {
		case store.ErrNotFound:
			return app.unauthorizedErrorResponse(c, err)
		default:
			return app.internalServerError(c, err)
		}
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(payload.Password)); err != nil {
		return app.unauthorizedErrorResponse(c, err)
	}

	claims := jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(app.config.auth.token.exp).Unix(),
		"iat": time.Now().Unix(),
		"nbf": time.Now().Unix(),
		"iss": app.config.auth.token.iss,
		"aud": app.config.auth.token.iss,
	}

	token, err := app.authenticator.GenerateToken(claims)
	if err != nil {
		return app.internalServerError(c, err)
	}

	if err := app.jsonResponse(c, http.StatusCreated, token); err != nil {
		return app.internalServerError(c, err)
	}
	return nil
}

func (app *application) registerHandler(c fiber.Ctx) error {
	var payload RegisterPayload

	if err := readJSON(c, &payload); err != nil {
		return app.badRequestResponse(c, err)
	}

	user := &ent.User{
		Username: payload.Username,
		Email:    payload.Email,
		Password: []byte(payload.Password),
	}

	if err := app.store.Users.Create(c.Context(), user); err != nil {
		switch err {
		case store.ErrDuplicateEmail:
			return app.badRequestResponse(c, err)
		case store.ErrDuplicateUsername:
			return app.badRequestResponse(c, err)
		default:
			return app.internalServerError(c, err)
		}
	}

	data := map[string]string{
		"status":  "ok",
		"message": "registered user",
	}

	if err := app.jsonResponse(c, http.StatusCreated, data); err != nil {
		return app.internalServerError(c, err)
	}
	return nil
}
