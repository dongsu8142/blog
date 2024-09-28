import { Link, Outlet } from "react-router-dom";

const Layout = () => {
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
				</ul>
			</nav>
			<Outlet />
		</>
	);
};

export default Layout;
