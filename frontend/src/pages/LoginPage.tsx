import type React from "react";
import { useState } from "react";
import { setCookie } from "../utils/cookie";

const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [alertHidden, setAlertHidden] = useState(true);

	const handleLogin = async (event: React.FormEvent) => {
		event.preventDefault();

		const response = await fetch(
			"https://scaling-telegram-7ppjwxq9x4pfxvvj-8080.app.github.dev/v1/auth/login",
			{
				method: "POST",
				body: JSON.stringify({
					username,
					password,
				}),
			},
		);
		const result = await response.json();
		if (response.status === 201) {
			setCookie("access_token", result.data);
			window.location.href = "/"; // 로그인 성공시 홈으로 이동합니다.
		} else {
			setAlertHidden(false);
		}
	};

	return (
		<>
			<main className="form">
				<h1>Sign in</h1>
				<form onSubmit={handleLogin}>
					<div className="alert alert-danger" role="alert" hidden={alertHidden}>
						Incorrect login!
					</div>
					<fieldset>
						<label>
							Username
							<input
								type="text"
								name="username"
								placeholder="Username"
								aria-label="Username"
								autoComplete="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
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
								required
							/>
						</label>
					</fieldset>
					<button type="submit">로그인</button>
				</form>
			</main>
		</>
	);
};

export default LoginPage;
