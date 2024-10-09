import { useQuery } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import rehypeSanitize from "rehype-sanitize";
import { getPost } from "../utils/api";
import type { Post } from "../utils/types";

const PostPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	if (!id) {
		return;
	}
	const {
		isError,
		isSuccess,
		data: post,
	} = useQuery<Post>({
		queryKey: ["post", id],
		queryFn: () => {
			return getPost(id);
		},
	});
	if (isError) {
		navigate("/");
		return;
	}
	if (!isSuccess) {
		return <article aria-busy="true" />;
	}
	return (
		<div>
			{post.title}
			<hr />
			{post.author.username} · {new Date(post.created_at).toLocaleDateString()}
			<div className="tag-container">
				{post.tags.map((tag) => (
					<div className="tag" key={tag.id}>
						{tag.name}
					</div>
				))}
			</div>
			<hr />
			<MDEditor.Markdown
				source={post.content}
				rehypePlugins={[rehypeSanitize]}
				style={{ backgroundColor: "var(--pico-background-color)" }}
			/>
		</div>
	);
};

export default PostPage;
