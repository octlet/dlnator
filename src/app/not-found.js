import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] w-full items-center justify-center px-4 py-6 md:px-6 md:py-8">
      <div className="w-full max-w-sm rounded-2xl border border-white/8 p-6 text-center">
        <p className="text-sm text-white">page not found</p>
        <p className="mt-2 text-sm text-white/45">
          the page you are looking for does not exist
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-xl bg-white px-5 py-2.5 text-sm text-black"
        >
          back to dashboard
        </Link>
      </div>
    </section>
  );
}
