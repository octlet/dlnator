import Button from "@ui/Button";

export default function SettingsActions() {
  return (
    <section className="rounded-2xl border border-white/8 p-5">
      <div>
        <p className="text-sm text-white">system actions</p>
        <p className="mt-1 text-sm text-white/45">
          maintenance and cleanup tools
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" className="px-4 py-2">
          rescan library
        </Button>

        <Button variant="outline" className="px-4 py-2">
          clear failed jobs
        </Button>
      </div>
    </section>
  );
}
