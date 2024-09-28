package main

import (
	"context"
	"expvar"
	"fmt"
	"time"

	"github.com/dongsu8142/blog/internal/auth"
	"github.com/dongsu8142/blog/internal/db"
	"github.com/dongsu8142/blog/internal/env"
	"github.com/dongsu8142/blog/internal/store"
	_ "github.com/lib/pq"
	"go.uber.org/zap"
)

const version = "1.0.0"

func main() {
	cfg := config{
		addr: env.GetString("ADDR", fmt.Sprintf(":%s", env.GetString("PORT", "8080"))),
		db: dbConfig{
			addr:         env.GetString("DB_ADDR", "postgres://admin:adminpassword@localhost/blog?sslmode=disable"),
			maxOpenConns: env.GetInt("DB_MAX_OPEN_CONNS", 30),
			maxIdleConns: env.GetInt("DB_MAX_IDLE_CONNS", 30),
			maxIdleTime:  env.GetString("DB_MAX_IDLE_TIME", "15m"),
		},
		env: env.GetString("ENV", "development"),
		auth: authConfig{
			admin: adminConfig{
				email:    env.GetString("EMAIL", "admin@admin.com"),
				password: env.GetString("PASSWORD", "admin"),
			},
			token: tokenConfig{
				secret: env.GetString("AUTH_TOKEN_SECRET", "example"),
				exp:    time.Hour * 24 * 3, // 3 days
				iss:    "blog",
			},
		},
	}

	logger := zap.Must(zap.NewProduction()).Sugar()
	defer logger.Sync()

	db, err := db.New(
		cfg.db.addr,
		cfg.db.maxOpenConns,
		cfg.db.maxIdleConns,
		cfg.db.maxIdleTime,
	)
	if err != nil {
		logger.Fatal(err)
	}

	defer db.Close()
	logger.Info("database connection pool established")

	if cfg.env == "development" {
		if err := db.Schema.Create(context.Background()); err != nil {
			logger.Fatalf("failed creating schema resources: %v", err)
		}
	}

	jwtAuthenticator := auth.NewJWTAuthenticator(
		cfg.auth.token.secret,
		cfg.auth.token.iss,
		cfg.auth.token.iss,
	)

	store := store.NewStorage(db)

	app := &application{
		config:        cfg,
		store:         store,
		logger:        logger,
		authenticator: jwtAuthenticator,
	}

	expvar.NewString("version").Set(version)

	mux := app.mount()

	logger.Fatal(app.run(mux))
}
