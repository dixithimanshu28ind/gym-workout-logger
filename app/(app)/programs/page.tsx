import { getCmsPrograms } from "@/lib/cmsPrograms";
import { getFeatureState } from "@/lib/features";
import { CustomProgramsSection, FreeProgramsHeading } from "@/components/programs/CustomProgramsSection";
import ProgramsListClient from "./ProgramsListClient";

export default async function ProgramsPage() {
  const [programs, customPrograms] = await Promise.all([getCmsPrograms(), getFeatureState("custom_programs")]);

  // Off: the page is exactly as it was, with nothing about Custom Programs on
  // it or in what is sent to the browser. The "Free Training Programs" heading
  // only exists to tell the two sections apart, so it appears with the first.
  const intro =
    customPrograms === "off" ? null : (
      <>
        <CustomProgramsSection state={customPrograms} />
        <FreeProgramsHeading />
      </>
    );

  return <ProgramsListClient programs={programs} intro={intro} />;
}
