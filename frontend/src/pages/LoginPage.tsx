import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const handleLogin = async (event: React.FormEvent) => {
		event.preventDefault();

		const response = await fetch(
			"https://scaling-telegram-7ppjwxq9x4pfxvvj-8080.app.github.dev/v1/auth/login",
			{
				method: "POST",
				body: JSON.stringify({
					email,
					password,
				}),
			},
		);
		const result = await response.json();
		if (response.status === 201) {
			sessionStorage.setItem("token", result.data);
			console.log(`로그인성공, 이메일주소:${result.data}`);
			navigate("/"); // 로그인 성공시 홈으로 이동합니다.
		}
	};

	return (
		<form onSubmit={handleLogin}>
			<fieldset>
				<label>
					Email
					<input
						type="email"
						name="email"
						placeholder="Email"
						aria-label="Email"
						autoComplete="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</label>
				<label>
					Password
					<input
						type="password"
						name="password"
						placeholder="Password"
						aria-label="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</label>
			</fieldset>
			<button type="submit">로그인</button>
		</form>
	);
};

export default LoginPage;
