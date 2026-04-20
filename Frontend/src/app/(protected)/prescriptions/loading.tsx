import { TablePageSkeleton } from "@/components/shared/skeletons/TablePageSkeleton";

export default function PrescriptionsLoading() {
  return (
    <TablePageSkeleton 
      heroTitle={true}
      heroSubtitle={true}
      heroBadges={1}
      columns={6}
      rows={8}
    />
  );
}
