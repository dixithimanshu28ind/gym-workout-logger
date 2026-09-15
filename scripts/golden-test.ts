/**
 * Golden test for Milestone D1/D2.
 *
 * D1 check: proves lib/cmsAdapter.ts's output for the 3 seeded programs is
 * exactly equivalent to today's hardcoded lib/programs.ts /
 * lib/programDetails.ts. This is what makes cutting the app's consumers
 * over to the CMS safe — same output, different source.
 *
 * Comparison is normalized through JSON (which drops undefined-valued
 * keys) before deepStrictEqual, since the adapter and the hand-authored
 * source data don't always agree on omitting vs. explicitly undefined-ing
 * an absent optional field — a distinction JS property access can't see
 * and the eventual JSON API wouldn't preserve either.
 *
 * D2 added loggable deload days (lib/cmsAdapter.ts's buildDeloadDays) — a
 * deliberate divergence from the hardcoded source, which never had these,
 * so they're stripped before the D1 comparison above and checked
 * separately here instead: every deload day should match its source
 * phase's day 1:1 (same exercises, same order) with sets scaled by the
 * phase's setsScale (ceil, minimum 1).
 *
 * Run with: node --env-file=.env.local ./node_modules/.bin/tsx scripts/golden-test.ts
 */
import assert from "node:assert/strict";

import { getPayloadClient } from "../lib/payloadClient";
import { adaptCmsProgram, type CmsProgramDoc } from "../lib/cmsAdapter";
import { PROGRAMS } from "../lib/programs";
import { getProgramDetail } from "../lib/programDetails";
import type { ProgramDetail } from "../lib/types";

function jsonNormalize<T>(value: T): unknown {
  return JSON.parse(JSON.stringify(value));
}

function stripDeloadDays(detail: ProgramDetail): ProgramDetail {
  return {
    ...detail,
    weekBlocks: detail.weekBlocks.map((b) => (b.kind === "deload" ? { ...b, days: undefined } : b)),
  };
}

// Known for the 3 real seeded programs (scripts/seed-programs.ts) — not
// derivable from the legacy ProgramDetail shape itself, since DeloadBlock
// doesn't carry sourcePhaseKey.
const DELOAD_SOURCE_PAIRS: [deloadId: string, sourceId: string][] = [
  ["week-6", "weeks-1-5"],
  ["week-12", "weeks-7-11"],
];

function verifyDeloadDays(programId: string, detail: ProgramDetail): string[] {
  const errors: string[] = [];
  const blocksById = new Map(detail.weekBlocks.map((b) => [b.id, b]));

  for (const [deloadId, sourceId] of DELOAD_SOURCE_PAIRS) {
    const deload = blocksById.get(deloadId);
    const source = blocksById.get(sourceId);
    if (!deload || deload.kind !== "deload") {
      errors.push(`missing deload block "${deloadId}"`);
      continue;
    }
    if (!source || source.kind !== "training") {
      errors.push(`missing source training block "${sourceId}"`);
      continue;
    }
    if (!deload.days || deload.days.length === 0) {
      errors.push(`deload "${deloadId}" has no days`);
      continue;
    }
    if (deload.days.length !== source.days.length) {
      errors.push(`deload "${deloadId}" day count ${deload.days.length} !== source day count ${source.days.length}`);
    }

    for (const sourceDay of source.days) {
      const deloadDay = deload.days.find((d) => d.day === sourceDay.day);
      if (!deloadDay) {
        errors.push(`deload "${deloadId}" missing day ${sourceDay.day}`);
        continue;
      }
      if (!deloadDay.title.endsWith("(Deload)")) {
        errors.push(`deload "${deloadId}" day ${sourceDay.day} title "${deloadDay.title}" missing "(Deload)" suffix`);
      }

      const sourceExercises = (sourceDay.groups ?? []).flatMap((g) => g.exercises);
      const deloadExercises = (deloadDay.groups ?? []).flatMap((g) => g.exercises);
      if (sourceExercises.length !== deloadExercises.length) {
        errors.push(`deload "${deloadId}" day ${sourceDay.day} exercise count mismatch`);
        continue;
      }
      for (let i = 0; i < sourceExercises.length; i++) {
        const src = sourceExercises[i];
        const dl = deloadExercises[i];
        if (src.exercise !== dl.exercise) {
          errors.push(`deload "${deloadId}" day ${sourceDay.day} item ${i}: "${dl.exercise}" !== source "${src.exercise}"`);
          continue;
        }
        if (src.sets != null) {
          const expectedSets = Math.max(1, Math.ceil(src.sets * 0.5));
          if (dl.sets !== expectedSets) {
            errors.push(
              `deload "${deloadId}" day ${sourceDay.day} "${src.exercise}": sets ${dl.sets} !== expected ${expectedSets} (source ${src.sets}, scale 0.5)`
            );
          }
        }
      }
    }
  }

  return errors.map((e) => `${programId}: ${e}`);
}

async function main() {
  const payload = await getPayloadClient();
  let failures = 0;

  for (const expectedProgram of PROGRAMS) {
    const expectedDetail = getProgramDetail(expectedProgram.id);
    if (!expectedDetail) {
      console.log(`FAIL ${expectedProgram.id}: no hardcoded ProgramDetail found`);
      failures++;
      continue;
    }

    const found = await payload.find({
      collection: "programs",
      where: { slug: { equals: expectedProgram.id } },
      depth: 2,
      limit: 1,
    });
    const doc = found.docs[0] as unknown as CmsProgramDoc | undefined;
    if (!doc) {
      console.log(`FAIL ${expectedProgram.id}: no CMS doc found`);
      failures++;
      continue;
    }

    const { program: actualProgram, detail: actualDetail } = adaptCmsProgram(doc);

    try {
      assert.deepStrictEqual(jsonNormalize(actualProgram), jsonNormalize(expectedProgram));
      assert.deepStrictEqual(jsonNormalize(stripDeloadDays(actualDetail)), jsonNormalize(expectedDetail));
      console.log(`PASS ${expectedProgram.id} (parity with hardcoded data)`);
    } catch (err) {
      failures++;
      console.log(`FAIL ${expectedProgram.id} (parity with hardcoded data)`);
      console.log(err instanceof Error ? err.message : err);
    }

    const deloadErrors = verifyDeloadDays(expectedProgram.id, actualDetail);
    if (deloadErrors.length > 0) {
      failures++;
      console.log(`FAIL ${expectedProgram.id} (deload days)`);
      deloadErrors.forEach((e) => console.log("  " + e));
    } else {
      console.log(`PASS ${expectedProgram.id} (deload days)`);
    }
  }

  console.log(failures === 0 ? "GOLDEN_TEST_PASSED" : `GOLDEN_TEST_FAILED (${failures} check(s))`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
