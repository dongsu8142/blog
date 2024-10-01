//go:build ignore
// +build ignore

package main

import (
	"log"

	"entgo.io/ent/entc"
	"entgo.io/ent/entc/gen"
	"entgo.io/ent/schema/edge"
)

func main() {
	opts := []entc.Option{
		entc.Extensions(
			&EncodeExtension{},
		),
	}
	err := entc.Generate("./schema", &gen.Config{}, opts...)
	if err != nil {
		log.Fatalf("running ent codegen: %v", err)
	}
}

type EncodeExtension struct {
	entc.DefaultExtension
}

func (e *EncodeExtension) Templates() []*gen.Template {
	return []*gen.Template{
		gen.MustParse(gen.NewTemplate("model/additional/jsonencode").
			Parse(`
{{ if $.Edges }}
    // MarshalJSON implements the json.Marshaler interface.
    func ({{ $.Receiver }} *{{ $.Name }}) MarshalJSON() ([]byte, error) {
        type Alias {{ $.Name }}
        return json.Marshal(&struct {
            *Alias
            {{ $.Name }}Edges
        }{
            Alias: (*Alias)({{ $.Receiver }}),
            {{ $.Name }}Edges: {{ $.Receiver }}.Edges,
        })
    }
{{ end }}
`)),
	}
}

func (e *EncodeExtension) Hooks() []gen.Hook {
	return []gen.Hook{
		func(next gen.Generator) gen.Generator {
			return gen.GenerateFunc(func(g *gen.Graph) error {
				tag := edge.Annotation{StructTag: `json:"-"`}
				for _, n := range g.Nodes {
					n.Annotations.Set(tag.Name(), tag)
				}
				return next.Generate(g)
			})
		},
	}
}
