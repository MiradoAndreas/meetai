import { auth } from "@/lib/auth"
import { CallView } from "@/modules/call/ui/views/call-view"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface Props {
  params: Promise<{
    meetingId: string
  }>
}

const Page = async ({ params }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const { meetingId } = await params

  prefetch(
    trpc.meetings.getOne.queryOptions({
      id: meetingId
    })
  )

  return (
    <>
      <HydrateClient>
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <CallView meetingId={meetingId} />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </>
  )
}

export default Page