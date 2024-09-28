package db

import (
	"context"
	"database/sql"
	"time"

	entsql "entgo.io/ent/dialect/sql"
	"github.com/dongsu8142/blog/ent"
)

func New(addr string, maxOpenConns, maxIdleConns int, maxIdleTime string) (*ent.Client, error) {
	db, err := sql.Open("postgres", addr)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(maxOpenConns)
	db.SetMaxIdleConns(maxIdleConns)

	duration, err := time.ParseDuration(maxIdleTime)
	if err != nil {
		return nil, err
	}
	db.SetConnMaxIdleTime(duration)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err = db.PingContext(ctx); err != nil {
		return nil, err
	}

	drv := entsql.OpenDB("postgres", db)
	return ent.NewClient(ent.Driver(drv)), nil
}
