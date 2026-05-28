"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getRequiredUser } from "@/lib/auth-session"
import { db } from "@/lib/db"

function getTrimmedValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

export async function createPost(formData: FormData) {
  const user = await getRequiredUser()
  const title = getTrimmedValue(formData, "title")
  const content = getTrimmedValue(formData, "content")

  if (!title || !content) {
    return
  }

  const post = await db.post.create({
    data: {
      title,
      content,
      authorId: user.id,
    },
  })

  revalidatePath("/")
  redirect(`/posts/${post.id}`)
}

export async function updatePost(formData: FormData) {
  const user = await getRequiredUser()
  const postId = String(formData.get("postId") ?? "")
  const title = getTrimmedValue(formData, "title")
  const content = getTrimmedValue(formData, "content")

  if (!title || !content) {
    return
  }

  const post = await db.post.findUnique({
    where: { id: postId },
    select: { id: true, authorId: true },
  })

  if (!post) {
    throw new Error("NOT_FOUND")
  }

  if (post.authorId !== user.id) {
    throw new Error("FORBIDDEN")
  }

  await db.post.update({
    where: { id: postId },
    data: {
      title,
      content,
    },
  })

  revalidatePath("/")
  revalidatePath(`/posts/${postId}`)
  redirect(`/posts/${postId}`)
}

export async function deletePost(formData: FormData) {
  const user = await getRequiredUser()
  const postId = String(formData.get("postId") ?? "")

  const post = await db.post.findUnique({
    where: { id: postId },
    select: { id: true, authorId: true },
  })

  if (!post) {
    throw new Error("NOT_FOUND")
  }

  if (post.authorId !== user.id) {
    throw new Error("FORBIDDEN")
  }

  await db.post.delete({
    where: { id: postId },
  })

  revalidatePath("/")
  redirect("/")
}
