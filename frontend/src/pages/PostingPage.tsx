import { useMutation } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useState } from "react";
import rehypeSanitize from "rehype-sanitize";
import { createPost } from "../utils/api";

const PostingPage = () => {
	const [content, setContent] = useState<string>("");
	const [title, setTitle] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [tag, setTag] = useState("");
	const [alert, setAlert] = useState("");
	const removeTag = (i: number) => {
		const clonetags = tags.slice();
		clonetags.splice(i, 1);
		setTags(clonetags);
	};
	const addTag = (e: ChangeEvent<HTMLInputElement>) => {
		setTag(e.target.value);
	};
	const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (
			e.key === "Enter" &&
			tag !== "" &&
			tags.find((e) => e === tag) === undefined &&
			tags.length <= 4
		) {
			handleClick();
		}
	};
	const handleClick = () => {
		setTags([...tags, tag]);
		setTag("");
	};
	const { mutate: createPostMutation } = useMutation({
		mutationFn: createPost,
		onSuccess: () => {
			window.location.href = "/";
		},
		onError: (err) => {
			setAlert(err.message);
		},
	});
	return (
		<form>
			<div className="alert alert-danger" role="alert" hidden={!alert}>
				{alert}
			</div>
			<fieldset>
				<input
					placeholder="제목"
					autoComplete="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
				<div className="tag-container">
					{tags.map((e, i) => (
						<div className="hash" key={e}>
							<h3 className="hash-name">{e}</h3>
							<button
								className="hash-btn"
								onClick={() => removeTag(i)}
								type="button"
							>
								x
							</button>
						</div>
					))}
					<input
						className="tag-input"
						placeholder="Press enter to add tags"
						onChange={(e) => addTag(e)}
						onKeyDown={(e) => handleKeyPress(e)}
						value={tag}
					/>
				</div>
				<MDEditor
					value={content}
					onChange={(v) => (v ? setContent(v) : setContent(""))}
					textareaProps={{
						placeholder: "내용을 입력해주세요.",
						required: true,
					}}
					previewOptions={{
						rehypePlugins: [[rehypeSanitize]],
					}}
					aria-required
				/>
				<br />
				<button
					type="submit"
					onSubmit={() => createPostMutation({ title, content, tags })}
				>
					출간하기
				</button>
			</fieldset>
		</form>
	);
};

export default PostingPage;
