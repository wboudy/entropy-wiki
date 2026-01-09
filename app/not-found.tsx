import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/beads">View Beads Docs</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
