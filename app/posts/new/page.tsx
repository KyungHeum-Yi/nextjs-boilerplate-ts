import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-session"
import { PostForm } from "@/components/board/post-form"

export default async function NewPostPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6">
      <PostForm mode="create" />
    </main>
  )
}
