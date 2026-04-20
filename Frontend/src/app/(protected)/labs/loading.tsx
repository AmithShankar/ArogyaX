import { TablePageSkeleton } from "@/components/shared/skeletons/TablePageSkeleton";

export default function LabsLoading() {
  return (
    <TablePageSkeleton 
      heroTitle={true}
      heroSubtitle={true}
      heroBadges={1}
      columns={5}
      rows={8}
    />
  );
}
