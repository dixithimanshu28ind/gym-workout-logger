import { getCmsProgramDetail } from "@/lib/cmsPrograms";
import ProgramDetailClient from "./ProgramDetailClient";

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getCmsProgramDetail(id);
  return <ProgramDetailClient result={result} />;
}
