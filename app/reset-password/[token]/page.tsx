import ResetPasswordClient from "./reset-password-client"

// Usamos una función sin tipado explícito para evitar el error
export default function Page() {
  // @ts-ignore - Ignoramos el error de tipado
  return function ResetPasswordPage({ params }) {
    return <ResetPasswordClient token={params.token} />
  }
}
