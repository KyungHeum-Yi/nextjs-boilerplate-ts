"use server"

import { revalidatePath } from "next/cache"
import { getRequiredUser } from "@/lib/auth-session"
import { db } from "@/lib/db"

function getTrimmedValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

export async function createComment(formData: FormData) {
  const user = await getRequiredUser()
  const postId = String(formData.get("postId") ?? "")
  const content = getTrimmedValue(formData, "content")

  if (!content) {
    return
  }

  await db.comment.create({
    data: {
      postId,
      content,
      authorId: user.id,
    },
  })

  revalidatePath(`/posts/${postId}`)
}

export async function updateComment(formData: FormData) {
  const user = await getRequiredUser()
  const commentId = String(formData.get("commentId") ?? "")
  const content = getTrimmedValue(formData, "content")

  if (!content) {
    return
  }

  const comment = await db.comment.findUnique({
    where: { id: commentId },
    select: { id: true, authorId: true, postId: true },
  })

  if (!comment) {
    throw new Error("NOT_FOUND")
  }

  if (comment.authorId !== user.id) {
    throw new Error("FORBIDDEN")
  }

  await db.comment.update({
    where: { id: commentId },
    data: { content },
  })

  revalidatePath(`/posts/${comment.postId}`)
}

export async function deleteComment(formData: FormData) {
  const user = await getRequiredUser()
  const commentId = String(formData.get("commentId") ?? "")

  const comment = await db.comment.findUnique({
    where: { id: commentId },
    select: { id: true, authorId: true, postId: true },
  })

  if (!comment) {
    throw new Error("NOT_FOUND")
  }

  if (comment.authorId !== user.id) {
    throw new Error("FORBIDDEN")
  }

  await db.comment.delete({
    where: { id: commentId },
  })

  revalidatePath(`/posts/${comment.postId}`)
}
