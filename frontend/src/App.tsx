import "./App.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const PostPage = lazy(() => import("./pages/PostPage"));

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		errorElement: <NotFound />,
		children: [
			{
				path: "/",
				element: (
					<Suspense fallback={<article aria-busy="true" />}>
						<HomePage />
					</Suspense>
				),
			},
			{
				path: "/login",
				element: <LoginPage />,
			},
			{
				path: "/post/:id",
				element: (
					<Suspense fallback={<article aria-busy="true" />}>
						<PostPage />
					</Suspense>
				),
			},
		],
	},
]);

const App = () => {
	return (
		<div className="container">
			<RouterProvider router={router} />
		</div>
	);
};

export default App;