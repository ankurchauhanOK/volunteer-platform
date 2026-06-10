import { redirect } from "next/navigation"

export default function HostOnboardingRedirect() {
  redirect("/onboarding/host/welcome")
}
