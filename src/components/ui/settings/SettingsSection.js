export default function SettingsSection() {
  return (
    <section className="rounded-2xl border border-white/8 p-5">
      <div>
        <p className="text-sm text-white">download preferences</p>
        <p className="mt-1 text-sm text-white/45">
          configure your local media behavior and defaults
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/8 p-4">
          <p className="text-sm text-white">default video format</p>
          <p className="mt-2 text-sm text-white/45">mp4</p>
        </div>

        <div className="rounded-2xl border border-white/8 p-4">
          <p className="text-sm text-white">default audio format</p>
          <p className="mt-2 text-sm text-white/45">mp3</p>
        </div>
      </div>
    </section>
  );
}
