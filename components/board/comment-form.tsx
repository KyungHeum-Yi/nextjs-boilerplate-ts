import { createComment } from "@/lib/actions/comment-actions"
import { Button } from "@/components/ui/button"

export function CommentForm({ postId }: { postId: string }) {
  return (
    <form action={createComment} className="space-y-3">
      <input type="hidden" name="postId" value={postId} />
      <textarea
        name="content"
        rows={4}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-muted disabled:text-muted-foreground"
        placeholder="댓글을 입력하세요"
      />
      <div className="flex justify-end">
        <Button type="submit">댓글 작성</Button>
      </div>
    </form>
  )
}
