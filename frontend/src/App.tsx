import "./App.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import PostingPage from "./pages/PostingPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		errorElement: <NotFound />,
		children: [
			{
				path: "/",
				element: <HomePage />,
			},
			{
				path: "/login",
				element: <LoginPage />,
			},
			{
				path: "/post/:id",
				element: <PostPage />,
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
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</CookiesProvider>
		</div>
	);
};

export default App;
