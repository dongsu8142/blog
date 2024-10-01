const baseURL =
	"https://scaling-telegram-7ppjwxq9x4pfxvvj-8080.app.github.dev/v1";

export const getPosts = () => {
	return fetch(`${baseURL}/posts`, {
		method: "GET",
	}).then((res) => res.json());
};

export const getPost = (id: number) => {
	return fetch(`${baseURL}/posts/${id}`, {
		method: "GET",
	});
};
