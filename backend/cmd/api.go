package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/dongsu8142/blog/internal/auth"
	"github.com/dongsu8142/blog/internal/store"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"go.uber.org/zap"
)

type application struct {
	config        config
	store         store.Storage
	logger        *zap.SugaredLogger
	authenticator auth.Authenticator
}

type config struct {
	addr string
	db   dbConfig
	auth authConfig
	env  string
}

type dbConfig struct {
	addr         string
	maxOpenConns int
	maxIdleConns int
	maxIdleTime  string
}

type authConfig struct {
	admin adminConfig
	token tokenConfig
}

type adminConfig struct {
	email    string
	password string
}

type tokenConfig struct {
	secret string
	exp    time.Duration
	iss    string
}

func (app *application) run() error {
	srv := fiber.New(fiber.Config{
		StructValidator: &structValidator{validate: validator.New(validator.WithRequiredStructEnabled())},
		WriteTimeout: time.Second *30,
		ReadTimeout: time.Second *10,
		IdleTimeout: time.Minute,
	})

	app.SetupRoutes(srv)

	shutdown := make(chan error)

	go func() {
		quit := make(chan os.Signal, 1)

		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		s := <-quit

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		app.logger.Infow("signal caught", "signal", s.String())

		shutdown <- srv.ShutdownWithContext(ctx)
	}()

	app.logger.Infow("server has started", "addr", app.config.addr, "env", app.config.env)

	err := srv.Listen(app.config.addr)
	if !errors.Is(err, http.ErrServerClosed) {
		return err
	}

	err = <-shutdown
	if err != nil {
		return err
	}

	app.logger.Infow("server has stopped", "addr", app.config.addr, "env", app.config.env)

	return nil
}
