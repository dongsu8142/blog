import { define } from "@/utils.ts";
import { Navbar } from "@/islands/Navbar.tsx";
import { BlogPosts } from "@/islands/BlogPosts.tsx";

export default define.page(function Home() {
  return (
    <div class="min-h-screen bg-gray-100">
      <Navbar />
      <main class="container mx-auto px-4 py-8">
        <BlogPosts />
      </main>
    </div>
  );
});
