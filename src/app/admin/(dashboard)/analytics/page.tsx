import { getAnalyticsData } from "@/actions/analytics";
import AnalyticsClient from "@/components/admin/AnalyticsClient";

export const revalidate = 0;

export default async function AnalyticsPage() {
  const data = await getAnalyticsData(6);

  return <AnalyticsClient initialData={data} />;
}
