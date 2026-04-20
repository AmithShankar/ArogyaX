import { TablePageSkeleton } from "@/components/shared/skeletons/TablePageSkeleton";

export default function PatientsLoading() {
  return (
    <TablePageSkeleton 
      heroTitle={true}
      heroSubtitle={true}
      heroBadges={1}
      columns={6}
      rows={10}
    />
  );
}
