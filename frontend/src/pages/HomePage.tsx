import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getPosts } from "../utils/api";
import { getRelativeTimeString } from "../utils/date";
import type { Post } from "../utils/types";

const HomePage = () => {
	const { isSuccess, data: posts } = useQuery<Post[]>({
		queryKey: ["posts"],
		queryFn: getPosts,
	});

	if (!isSuccess) {
		return <article aria-busy="true" />;
	}

	return (
		<>
			{posts.map((post) => {
				const date = new Date(post.created_at);
				return (
					<article key={post.id}>
						<Link className="contrast" to={`/post/${post.id}`}>
							{post.title}
						</Link>
						<footer>
							<span className="username">{post.author.username}</span>
							<span className="date">{getRelativeTimeString(date)}</span>
						</footer>
					</article>
				);
			})}
		</>
	);
};

export default HomePage;
