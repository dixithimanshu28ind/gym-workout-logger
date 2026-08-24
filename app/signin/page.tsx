import AuthForm from "@/components/AuthForm";

export default function SignInPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-12">
      <AuthForm mode="signin" />
    </main>
  );
}
