import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name: string, value: string) => {
	return cookies.set(name, value, { path: "/", sameSite: "none" });
};

export const getCookie = (name: string) => {
	return cookies.get(name);
};

export const removeCookie = (name: string) => {
	cookies.remove(name);
};
