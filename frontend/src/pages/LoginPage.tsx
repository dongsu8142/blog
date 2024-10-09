import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { login } from "../utils/api";
import { setCookie } from "../utils/cookie";

const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [alertHidden, setAlertHidden] = useState(true);

	const { mutate: loginMutation } = useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			setCookie("access_token", data);
			window.location.href = "/";
		},
		onError: () => {
			setAlertHidden(false);
		},
	});

	return (
		<>
			<main className="form">
				<h1>Sign in</h1>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						loginMutation({ username, password });
					}}
				>
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
