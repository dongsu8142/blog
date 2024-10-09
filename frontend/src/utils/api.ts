import { getCookie } from "./cookie";

const baseURL =
	"https://scaling-telegram-7ppjwxq9x4pfxvvj-8080.app.github.dev/v1";

export const getPosts = async () => {
	const res = await fetch(`${baseURL}/posts`, {
		method: "GET",
	});
	if (res.ok) {
		const result = await res.json();
		return result.data;
	}
	return Promise.reject(res.status);
};

export const getPost = async (id: string) => {
	const res = await fetch(`${baseURL}/posts/${id}`, {
		method: "GET",
	});
	if (res.ok) {
		const result = await res.json();
		return result.data;
	}
	return Promise.reject(res.status);
};

export const createPost = async (body: {
	title: string;
	content: string;
	tags: string[];
}) => {
	if (body.tags.length === 0) {
		return Promise.reject(new Error("테그 값이 없습니다."));
	}
	const res = await fetch(`${baseURL}/posts`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${getCookie("access_token")}`,
		},
		body: JSON.stringify(body),
	});
	if (res.ok) {
		const result = await res.json();
		return result.data;
	}
	return Promise.reject(new Error("포스팅하는 과정에서 에러가 발생했습니다."));
};

export const login = async (body: { username: string; password: string }) => {
	const res = await fetch(`${baseURL}/auth/login`, {
		method: "POST",
		body: JSON.stringify(body),
	});
	if (res.ok) {
		const result = await res.json();
		return result.data;
	}
	return Promise.reject(res.status);
};
