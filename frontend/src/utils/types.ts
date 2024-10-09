export interface Post {
	id: number;
	title: string;
	content: string;
	created_at: string;
	updated_at: string;
	author: PostAuthor;
	tags: PostTag[];
}

export interface PostAuthor {
	username: string;
}

export interface PostTag {
	id: number;
	name: string;
}
