import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function getCurrentUser() {
  const session = await auth()

  if (!session?.user?.email) {
    return null
  }

  return db.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
    },
  })
}

export async function getRequiredUser() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("UNAUTHORIZED")
  }

  return user
}
