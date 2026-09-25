import { login } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <form
        action={login}
        className="w-full max-w-sm rounded-2xl border border-theme bg-surface p-8"
      >
        <h1 className="mb-1 font-display text-2xl font-bold">MoKnight</h1>
        <p className="mb-6 text-sm text-muted">دخول المالك / Owner Login</p>

        {searchParams.error && (
          <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {searchParams.error === "not_owner"
              ? "هذا الحساب غير مصرّح له بالدخول."
              : "بيانات الدخول غير صحيحة."}
          </p>
        )}

        <label className="mb-1 block text-sm text-muted">البريد الإلكتروني</label>
        <input
          name="email"
          type="email"
          required
          className="mb-4 w-full rounded-lg border border-theme bg-surface2 px-4 py-2.5 outline-none"
        />

        <label className="mb-1 block text-sm text-muted">كلمة المرور</label>
        <input
          name="password"
          type="password"
          required
          className="mb-6 w-full rounded-lg border border-theme bg-surface2 px-4 py-2.5 outline-none"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-blue to-violet py-2.5 font-semibold text-white"
        >
          دخول
        </button>
      </form>
    </div>
  );
}
