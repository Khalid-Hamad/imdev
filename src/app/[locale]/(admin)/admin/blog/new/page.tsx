import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-[28px] font-semibold tracking-[-0.01em] mb-8">
        New Post
      </h1>
      <PostForm />
    </div>
  );
}
