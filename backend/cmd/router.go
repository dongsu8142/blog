package main

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/compress"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/healthcheck"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/gofiber/fiber/v3/middleware/recover"
)

func (app *application) SetupRoutes(fiberApp *fiber.App) {
	// Middleware
	fiberApp.Use(compress.New(compress.Config{
		Level: compress.LevelBestSpeed,
	}))
	fiberApp.Use(logger.New())
	fiberApp.Use(recover.New())
	fiberApp.Use(cors.New())

	api := fiberApp.Group("/v1")
	api.Get(healthcheck.DefaultLivenessEndpoint, healthcheck.NewHealthChecker())
	api.Get("/health", app.healthCheckHandler)

	// Auth
	auth := api.Group("/auth")
	auth.Post("/register", app.registerHandler)
	auth.Post("/login", app.loginHandler)

	// Posts
	posts := api.Group("/posts")
	posts.Post("/", app.createPostHandler, app.AuthTokenMiddleware())
	posts.Get("/", app.getPostsHandler)
	posts.Get("/:postID", app.getPostHandler, app.postsContextMiddleware())

	// Comments
	comments := api.Group("/comments/:postID", app.postsContextMiddleware())
	comments.Post("/", app.createCommentHandler, app.AuthTokenMiddleware())
}