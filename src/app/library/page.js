import PageHeader from "@ui/PageHeader";
import LibraryGrid from "@ui/library/LibraryGrid";

export default function LibraryPage() {
  return (
    <section className="flex flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
      <PageHeader title="library" />
      <LibraryGrid />
    </section>
  );
}
