package main

import (
	"net/http"

	"github.com/gofiber/fiber/v3"
)

func (app *application) healthCheckHandler(c fiber.Ctx) error {
	data := map[string]string{
		"status":  "ok",
		"env":     app.config.env,
		"version": version,
	}

	if err := app.jsonResponse(c, http.StatusOK, data); err != nil {
		return app.internalServerError(c, err)
	}
	return nil
}
