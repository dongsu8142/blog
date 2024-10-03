import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { getCookie, removeCookie } from "../utils/cookie";

const Layout = () => {
	const [isLogin, setIsLogin] = useState(false);
	useEffect(() => {
		const token = getCookie("access_token");
		if (token) {
			setIsLogin(true);
		}
	}, []);
	const handleLogout = () => {
		removeCookie("access_token");
		window.location.href = "/";
	};
	return (
		<>
			<nav>
				<ul>
					<li>
						<strong>Blog</strong>
					</li>
				</ul>
				<ul>
					<li>
						<Link className="contrast" to="/">
							Home
						</Link>
					</li>
					{isLogin ? (
						<li>
							<a className="contrast" onClick={handleLogout}>
								Logout
							</a>
						</li>
					) : (
						<li>
							<Link className="contrast" to="/login">
								Login
							</Link>
						</li>
					)}
				</ul>
			</nav>
			<Outlet />
		</>
	);
};

export default Layout;
