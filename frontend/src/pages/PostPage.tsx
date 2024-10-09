import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getPost } from "../utils/api";
import type { Post } from "../utils/types";
import { useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

const PostPage = () => {
	const params = useParams<{ id: string }>();
	const [post, setPost] = useState<Post>();
	const navigate = useNavigate();
	useEffect(() => {
		if (!params.id) {
			return;
		}
		const id = Number.parseInt(params.id);
		getPost(id)
			.then((res) => {
				if (res.status !== 200) {
					navigate("/");
				}
				return res.json();
			})
			.then((json) => {
				setPost(json.data);
			});
	}, [params.id, navigate]);
	return (
		<div>
			{post?.title}
			<hr />
			{post?.author.username} ·{" "}
			{new Date(post?.created_at!).toLocaleDateString()}
			<div className="tag-container">
				{post?.tags.map((tag) => (
					<div className="tag" key={tag.id}>
						{tag.name}
					</div>
				))}
			</div>
			<hr />
			<MDEditor.Markdown
				source={post?.content}
				rehypePlugins={[rehypeSanitize]}
				style={{ backgroundColor: "var(--pico-background-color)" }}
			/>
		</div>
	);
};

export default PostPage;
