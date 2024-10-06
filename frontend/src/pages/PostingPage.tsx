import MDEditor from "@uiw/react-md-editor";
import type { KeyboardEvent, ChangeEvent } from "react";
import { useState } from "react";
import rehypeSanitize from "rehype-sanitize";
import { createPost } from "../utils/api";

const PostingPage = () => {
	const [content, setContent] = useState<string | undefined>("");
	const [title, setTitle] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [tag, setTag] = useState("");
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
	const handleSubmit = async () => {
		if (content === undefined || tags.length === 0) {
			return;
		}
		const response = await createPost(title, content, tags);

		if (response.status === 201) {
			window.location.href = "/";
		}
	};
	return (
		<form>
			<fieldset>
				<input
					placeholder="제목"
					autoComplete="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
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
					onChange={setContent}
					textareaProps={{
						placeholder: "내용을 입력해주세요.",
					}}
					previewOptions={{
						rehypePlugins: [[rehypeSanitize]],
					}}
				/>
				<br />
				<button type="button" onClick={handleSubmit}>
					출간하기
				</button>
			</fieldset>
		</form>
	);
};

export default PostingPage;
