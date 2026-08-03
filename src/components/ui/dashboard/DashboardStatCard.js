export default function DashboardStatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/8 p-5">
      <p className="font-mono text-xs text-white/35">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
