import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-session"
import { getPostById } from "@/lib/board/queries"
import { PostForm } from "@/components/board/post-form"

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ postId: string }>
}) {
  const { postId } = await params
  const [post, currentUser] = await Promise.all([
    getPostById(postId),
    getCurrentUser(),
  ])

  if (!post) {
    notFound()
  }

  if (!currentUser) {
    redirect("/login")
  }

  if (post.author.id !== currentUser.id) {
    notFound()
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6">
      <PostForm
        mode="edit"
        post={{
          id: post.id,
          title: post.title,
          content: post.content,
        }}
      />
    </main>
  )
}
