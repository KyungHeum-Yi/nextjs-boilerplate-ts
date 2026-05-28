// app/page.tsx
import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { getPosts } from "@/lib/board/queries"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Home() {
  const [session, posts] = await Promise.all([auth(), getPosts()])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle>커뮤니티 게시판</CardTitle>
              <p className="text-sm text-muted-foreground">
                최신 글부터 확인하고 댓글로 대화를 이어가세요.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {session ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    {session.user?.email}
                  </p>
                  <Link href="/posts/new">
                    <Button>글쓰기</Button>
                  </Link>
                  <form
                    action={async () => {
                      "use server"
                      await signOut({ redirectTo: "/" })
                    }}
                  >
                    <Button type="submit" variant="outline">
                      로그아웃
                    </Button>
                  </form>
                </>
              ) : (
                <Link href="/login">
                  <Button>Google로 로그인</Button>
                </Link>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden grid-cols-[minmax(0,1fr)_90px_90px_140px_160px] gap-4 border-b px-4 py-3 text-xs font-medium text-muted-foreground md:grid">
            <span>제목</span>
            <span>댓글</span>
            <span>조회수</span>
            <span>작성자</span>
            <span>작성 시간</span>
          </div>
          {posts.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              아직 등록된 글이 없습니다.
            </div>
          ) : (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="block border-b px-4 py-4 transition-colors hover:bg-muted/40"
              >
                <div className="md:hidden">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium">
                      {post.title}
                      <span className="ml-2 text-sm text-muted-foreground">
                        [{post._count.comments}]
                      </span>
                    </p>
                    <span className="text-xs text-muted-foreground">
                      조회 {post.viewCount}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>{post.author.name ?? post.author.email}</span>
                    <span>{new Date(post.createdAt).toLocaleString("ko-KR")}</span>
                  </div>
                </div>
                <div className="hidden grid-cols-[minmax(0,1fr)_90px_90px_140px_160px] items-center gap-4 md:grid">
                  <p className="truncate font-medium">
                    {post.title}
                    <span className="ml-2 text-sm text-muted-foreground">
                      [{post._count.comments}]
                    </span>
                  </p>
                  <span className="text-sm text-muted-foreground">
                    {post._count.comments}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {post.viewCount}
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    {post.author.name ?? post.author.email}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleString("ko-KR")}
                  </span>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  )
}
