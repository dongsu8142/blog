import "./App.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { lazy, Suspense } from "react";
import { CookiesProvider } from "react-cookie";
import PostingPage from "./pages/PostingPage";

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
			{
				path: "/posting",
				element: <PostingPage />,
			},
		],
	},
]);

const App = () => {
	return (
		<div className="container">
			<CookiesProvider>
				<RouterProvider router={router} />
			</CookiesProvider>
		</div>
	);
};

export default App;
