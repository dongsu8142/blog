package main

import (
	"context"
	"fmt"
	"strconv"
	"strings"

	"github.com/dongsu8142/blog/ent"
	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

func (app *application) AuthTokenMiddleware() fiber.Handler {
	return func(c fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return app.unauthorizedErrorResponse(c, fmt.Errorf("authorization header is missing"))
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return app.unauthorizedErrorResponse(c, fmt.Errorf("authorization header is malformed"))
		}

		token := parts[1]

		jwtToken, err := app.authenticator.ValidateToken(token)
		if err != nil {
			return app.unauthorizedErrorResponse(c, err)
		}

		claims, _ := jwtToken.Claims.(jwt.MapClaims)

		userID, err := strconv.Atoi(fmt.Sprintf("%.f", claims["sub"]))
		if err != nil {
			return app.unauthorizedErrorResponse(c, err)
		}

		ctx := c.Context()

		user, err := app.getUser(ctx, userID)
		if err != nil {
			return app.unauthorizedErrorResponse(c, err)
		}

		ctx.SetUserValue(userCtx, user)
		
		return c.Next()
	}
}

func (app *application) getUser(ctx context.Context, userID int) (*ent.User, error) {
	user, err := app.store.Users.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return user, nil
}
