import PageHeader from "@ui/PageHeader";
import DashboardStats from "@ui/dashboard/DashboardStats";
import RecentJobs from "@ui/dashboard/RecentJobs";
import QuickAdd from "@ui/dashboard/QuickAdd";

export default function DashboardPage() {
  return (
    <section className="flex flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
      <PageHeader title="dashboard" />
      <DashboardStats />

      <div className="flex flex-col gap-6">
        <RecentJobs />
        <QuickAdd />
      </div>
    </section>
  );
}
