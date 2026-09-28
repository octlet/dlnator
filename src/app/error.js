"use client";

import Button from "@ui/Button";

export default function Error({ error, reset }) {
  return (
    <section className="flex min-h-[60vh] w-full items-center justify-center px-4 py-6 md:px-6 md:py-8">
      <div className="w-full max-w-sm rounded-2xl border border-white/8 p-6 text-center">
        <p className="text-sm text-white">something went wrong</p>
        <p className="mt-2 text-sm text-white/45">
          {error?.message || "unexpected error"}
        </p>

        <Button
          variant="primary"
          className="mt-6 w-full px-5 py-2.5"
          onClick={reset}
        >
          try again
        </Button>
      </div>
    </section>
  );
}
