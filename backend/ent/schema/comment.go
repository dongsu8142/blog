package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Comment holds the schema definition for the Comment entity.
type Comment struct {
	ent.Schema
}

// Fields of the Comment.
func (Comment) Fields() []ent.Field {
	return []ent.Field{
		field.Text("content").NotEmpty(),
		field.Int("author_id"),
		field.Int("post_id"),
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

// Edges of the Comment.
func (Comment) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("author", User.Type).
			Ref("comments").
			Field("author_id").
			Unique().
			Required(),
		edge.From("post", Post.Type).
			Ref("comments").
			Field("post_id").
			Unique().
			Required(),
	}
}
