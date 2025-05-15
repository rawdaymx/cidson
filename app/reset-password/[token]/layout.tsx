import type React from "react"
export default function ResetPasswordLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { token: string }
}) {
  return <>{children}</>
}
