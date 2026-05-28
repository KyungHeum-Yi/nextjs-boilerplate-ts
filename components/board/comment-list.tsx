import { deleteComment, updateComment } from "@/lib/actions/comment-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type CommentItem = {
  id: string
  content: string
  createdAt: Date
  author: {
    id: string
    name: string | null
    email: string
  }
}

type CommentListProps = {
  comments: CommentItem[]
  currentUserId: string | null
}

export function CommentList({ comments, currentUserId }: CommentListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>댓글 {comments.length}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요.
          </p>
        ) : null}
        {comments.map((comment) => {
          const canEdit = comment.author.id === currentUserId

          return (
            <div key={comment.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-medium">
                    {comment.author.name ?? comment.author.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleString("ko-KR")}
                  </p>
                </div>
                {canEdit ? (
                  <form action={deleteComment}>
                    <input type="hidden" name="commentId" value={comment.id} />
                    <Button type="submit" variant="ghost" size="sm">
                      삭제
                    </Button>
                  </form>
                ) : null}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                {comment.content}
              </p>
              {canEdit ? (
                <details className="mt-4 rounded-lg bg-muted/50 p-3">
                  <summary className="cursor-pointer text-sm font-medium">
                    댓글 수정
                  </summary>
                  <form action={updateComment} className="mt-3 space-y-3">
                    <input type="hidden" name="commentId" value={comment.id} />
                    <textarea
                      name="content"
                      rows={4}
                      defaultValue={comment.content}
                      className="w-full rounded-lg border bg-background px-3 py-2 outline-none ring-0"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" size="sm">
                        수정 저장
                      </Button>
                    </div>
                  </form>
                </details>
              ) : null}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
