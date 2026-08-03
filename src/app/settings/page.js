import PageHeader from "@ui/PageHeader";
import SettingsSection from "@ui/settings/SettingsSection";
import SettingsActions from "@ui/settings/SettingsActions";

export default function SettingsPage() {
  return (
    <section className="flex flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
      <PageHeader title="settings" />
      <SettingsSection />
      <SettingsActions />
    </section>
  );
}
