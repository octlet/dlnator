import PageHeader from "@ui/PageHeader";
import DownloadsList from "@ui/downloads/DownloadsList";

export default function DownloadsPage() {
  return (
    <section className="flex flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
      <PageHeader title="downloads" />
      <DownloadsList />
    </section>
  );
}
