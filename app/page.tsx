import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold">Daily Gym Workout Logger</h1>
        <p className="text-neutral-600">
          Log your workouts fast, mid-rest, without the clutter. Pick a date,
          add exercises and sets, and keep a simple history you can actually
          use.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-700 transition"
          >
            Sign Up
          </Link>
          <Link
            href="/signin"
            className="px-5 py-2.5 rounded-lg border border-neutral-300 font-medium hover:bg-neutral-100 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
