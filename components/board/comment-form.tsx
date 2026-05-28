import { createComment } from "@/lib/actions/comment-actions"
import { Button } from "@/components/ui/button"

export function CommentForm({ postId }: { postId: string }) {
  return (
    <form action={createComment} className="space-y-3">
      <input type="hidden" name="postId" value={postId} />
      <textarea
        name="content"
        rows={4}
        className="w-full rounded-lg border bg-background px-3 py-2 outline-none ring-0"
        placeholder="댓글을 입력하세요"
      />
      <div className="flex justify-end">
        <Button type="submit">댓글 작성</Button>
      </div>
    </form>
  )
}
