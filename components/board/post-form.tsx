import Link from "next/link"
import { createPost, updatePost } from "@/lib/actions/post-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PostFormProps = {
  mode: "create" | "edit"
  post?: {
    id: string
    title: string
    content: string
  }
}

export function PostForm({ mode, post }: PostFormProps) {
  const action = mode === "create" ? createPost : updatePost

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{mode === "create" ? "글쓰기" : "글 수정"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          {post ? <input type="hidden" name="postId" value={post.id} /> : null}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="title">
              제목
            </label>
            <input
              id="title"
              name="title"
              defaultValue={post?.title}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-muted disabled:text-muted-foreground"
              placeholder="제목을 입력하세요"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="content">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              defaultValue={post?.content}
              rows={12}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-muted disabled:text-muted-foreground"
              placeholder="내용을 입력하세요"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Link href={post ? `/posts/${post.id}` : "/"}>
              <Button type="button" variant="outline">
                취소
              </Button>
            </Link>
            <Button type="submit">{mode === "create" ? "등록" : "수정"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
