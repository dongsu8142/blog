export interface Post {
	id: number;
	title: string;
	content: string;
	created_at: string;
	updated_at: string;
	author: PostAuthor
}

export interface PostAuthor {
	username: string;
}