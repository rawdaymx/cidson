"use client"

import { useSearchParams } from "next/navigation"
import ResetPasswordClient from "./[token]/reset-password-client"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  return <ResetPasswordClient token={token} />
}
