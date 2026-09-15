import { getCmsPrograms } from "@/lib/cmsPrograms";
import ProgramsListClient from "./ProgramsListClient";

export default async function ProgramsPage() {
  const programs = await getCmsPrograms();
  return <ProgramsListClient programs={programs} />;
}
