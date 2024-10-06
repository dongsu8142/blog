package main

import (
	"compress/flate"
	"context"
	"errors"
	"io"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/andybalholm/brotli"
	"github.com/dongsu8142/blog/internal/auth"
	"github.com/dongsu8142/blog/internal/env"
	"github.com/dongsu8142/blog/internal/store"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
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

func (app *application) mount() http.Handler {
	r := chi.NewRouter()

	compressor := middleware.NewCompressor(flate.DefaultCompression)
	compressor.SetEncoder("br", func(w io.Writer, _ int) io.Writer {
		return brotli.NewWriterV2(w, 5)
	})

	r.Use(compressor.Handler)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{env.GetString("CORS_ALLOWED_ORIGIN", "https://scaling-telegram-7ppjwxq9x4pfxvvj-3000.app.github.dev")},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Route("/v1", func(r chi.Router) {
		r.Get("/health", app.healthCheckHandler)
		r.Route("/auth", func(r chi.Router) {
			r.Post("/register", app.registerHandler)
			r.Post("/login", app.loginHandler)
		})
		r.Route("/posts", func(r chi.Router) {
			r.Group(func(r chi.Router) {
				r.Use(app.AuthTokenMiddleware)
				r.Post("/", app.createPostHandler)
			})
			r.Get("/", app.getPostsHandler)
			r.Route("/{postID}", func(r chi.Router) {
				r.Use(app.postsContextMiddleware)
				r.Get("/", app.getPostHandler)
			})
		})
	})

	return r
}

func (app *application) run(mux http.Handler) error {
	srv := &http.Server{
		Addr:         app.config.addr,
		Handler:      mux,
		WriteTimeout: time.Second * 30,
		ReadTimeout:  time.Second * 10,
		IdleTimeout:  time.Minute,
	}

	shutdown := make(chan error)

	go func() {
		quit := make(chan os.Signal, 1)

		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		s := <-quit

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		app.logger.Infow("signal caught", "signal", s.String())

		shutdown <- srv.Shutdown(ctx)
	}()

	app.logger.Infow("server has started", "addr", app.config.addr, "env", app.config.env)

	err := srv.ListenAndServe()
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
