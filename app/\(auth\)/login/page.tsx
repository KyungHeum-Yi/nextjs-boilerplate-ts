import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/50 px-4 py-8">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">로그인</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Google로 계속하세요
          </p>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/" })
            }}
          >
            <Button type="submit" className="w-full" size="lg">
              Google로 계속하기
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            계정이 없으면 자동으로 생성됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
