package main

import (
	"net/http"

	"github.com/gofiber/fiber/v3"
)

func (app *application) internalServerError(c fiber.Ctx, err error) error {
	app.logger.Errorw("internal error", "method", c.Method, "path", c.Path, "error", err.Error())

	return writeJSONError(c, http.StatusInternalServerError, "the server encountered a problem")
}

func (app *application) badRequestResponse(c fiber.Ctx, err error) error {
	app.logger.Warnf("bad request", "method", c.Method, "path", c.Path, "error", err.Error())

	return writeJSONError(c, http.StatusBadRequest, err.Error())
}

func (app *application) notFoundResponse(c fiber.Ctx, err error) error {
	app.logger.Warnf("not found error", "method", c.Method, "path", c.Path, "error", err.Error())

	return writeJSONError(c, http.StatusNotFound, "not found")
}

func (app *application) unauthorizedErrorResponse(c fiber.Ctx, err error)  error{
	app.logger.Warnf("unauthorized error", "method", c.Method, "path", c.Path, "error", err.Error())

	return writeJSONError(c, http.StatusUnauthorized, "unauthorized")
}
