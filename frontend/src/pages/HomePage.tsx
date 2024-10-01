import { useEffect, useState } from "react";
import { getPosts } from "../utils/api";
import type { Post } from "../utils/types";
import { Link } from "react-router-dom";
import { getRelativeTimeString } from "../utils/date";

const HomePage = () => {
	const [posts, setPosts] = useState<[Post] | undefined>();
	useEffect(() => {
		getPosts().then((res) => {
			setPosts(res.data);
		});
	}, []);
	return (
		<>
			{posts?.map((post) => {
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
