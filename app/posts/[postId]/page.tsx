import Link from "next/link"
import { notFound } from "next/navigation"
import { deletePost } from "@/lib/actions/post-actions"
import { getCurrentUser } from "@/lib/auth-session"
import { getPostById, incrementPostViewCount } from "@/lib/board/queries"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CommentForm } from "@/components/board/comment-form"
import { CommentList } from "@/components/board/comment-list"

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>
}) {
  const { postId } = await params

  const postBeforeIncrement = await getPostById(postId)

  if (!postBeforeIncrement) {
    notFound()
  }

  await incrementPostViewCount(postId)

  const [post, currentUser] = await Promise.all([
    getPostById(postId),
    getCurrentUser(),
  ])

  if (!post) {
    notFound()
  }

  const canEditPost = post.author.id === currentUser?.id

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <CardTitle>{post.title}</CardTitle>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span>{post.author.name ?? post.author.email}</span>
                  <span>{new Date(post.createdAt).toLocaleString("ko-KR")}</span>
                  <span>조회 {post.viewCount}</span>
                  <span>댓글 {post._count.comments}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/">
                  <Button type="button" variant="outline">
                    목록
                  </Button>
                </Link>
                {canEditPost ? (
                  <>
                    <Link href={`/posts/${post.id}/edit`}>
                      <Button type="button" variant="outline">
                        수정
                      </Button>
                    </Link>
                    <form action={deletePost}>
                      <input type="hidden" name="postId" value={post.id} />
                      <Button type="submit" variant="ghost">
                        삭제
                      </Button>
                    </form>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-sm leading-7">{post.content}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>댓글 작성</CardTitle>
        </CardHeader>
        <CardContent>
          {currentUser ? (
            <CommentForm postId={post.id} />
          ) : (
            <p className="text-sm text-muted-foreground">
              댓글을 작성하려면 로그인해 주세요.
            </p>
          )}
        </CardContent>
      </Card>

      <CommentList
        comments={post.comments}
        currentUserId={currentUser?.id ?? null}
      />
    </main>
  )
}
