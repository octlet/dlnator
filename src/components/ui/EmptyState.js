export default function EmptyState({ children }) {
  return (
    <div className="rounded-2xl border border-white/8 px-4 py-12 text-center text-sm text-white/35">
      {children}
    </div>
  );
}
