import { useEffect, useRef, useState } from "preact/hooks";
import { Heart, MessageSquare } from "lucide-preact";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  image: string;
  commentCount: number;
  likeCount: number;
}

const generateDummyPosts = (count: number, startIndex: number = 0) => {
  return Array.from({ length: count }, (_, i) => ({
    id: startIndex + i + 1,
    title: `포스트 제목 ${startIndex + i + 1}`,
    description:
      "This is a short description of the blog post. It gives a brief overview of what the post is about.",
    author: {
      name: "John Doe",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString(),
    image: `https://picsum.photos/seed/${startIndex + i + 1}/400/300`,
    commentCount: Math.floor(Math.random() * 100),
    likeCount: Math.floor(Math.random() * 1000),
  }));
};

export const BlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  const loadMorePosts = () => {
    const newPosts = generateDummyPosts(page * 12, posts.length);
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 1 },
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [page]);

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <img
            src={post.image}
            alt={post.title}
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2">{post.title}</h2>
            <p class="text-gray-600 mb-4">{post.description}</p>
            <div class="flex items-center mb-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                class="w-8 h-8 rounded-full mr-2"
              />
              <span class="text-sm text-gray-500">{post.author.name}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <div class="flex items-center space-x-2">
                <span class="flex items-center">
                  <MessageSquare class="w-4 h-4 mr-1" />
                  {post.commentCount}
                </span>
                <span class="flex items-center">
                  <Heart class="w-4 h-4 mr-1" />
                  {post.likeCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={loader} className="h-10" />
      {/* {loading && <div class="col-span-full text-center py-4">Loading...</div>} */}
    </div>
  );
};
