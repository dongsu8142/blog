import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getPost } from "../utils/api";
import type { Post } from "../utils/types";

const PostPage = () => {
	const params = useParams<{ id: string }>();
	const [post, setPost] = useState<Post>();
	useEffect(() => {
		if (!params.id) {
			return;
		}
		const id = Number.parseInt(params.id);
		getPost(id).then((res) => {
			setPost(res.data);
		});
	}, [params.id]);
	return (
		<div>
			{post?.title}
			<hr />
			{post?.content}
		</div>
	);
};

export default PostPage;
