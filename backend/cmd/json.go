package main

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
)

type structValidator struct {
    validate *validator.Validate
}

func (v *structValidator) Validate(out any) error {
    return v.validate.Struct(out)
}

func readJSON(c fiber.Ctx, data any) error {
	// maxBytes := 1_048_578 // 1mb
	// r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))

	// decoder := json.NewDecoder(c.Request().BodyStream())
	// decoder.DisallowUnknownFields()

	// return decoder.Decode(data)

	return c.Bind().JSON(data)
}

func writeJSONError(c fiber.Ctx, status int, message string) error {
	type envelope struct {
		Error string `json:"error"`
	}

	return c.Status(status).JSON(&envelope{Error: message})
}

func (app *application) jsonResponse(c fiber.Ctx, status int, data any) error {
	type envelope struct {
		Data any `json:"data"`
	}

	return c.Status(status).JSON(&envelope{Data: data})
}
