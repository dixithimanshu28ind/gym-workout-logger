/**
 * Golden test for Milestone D1: proves lib/cmsAdapter.ts's output for the 3
 * seeded programs is exactly equivalent to today's hardcoded
 * lib/programs.ts / lib/programDetails.ts. This is what makes cutting the
 * app's consumers over to the CMS safe — same output, different source.
 *
 * Comparison is normalized through JSON (which drops undefined-valued
 * keys) before deepStrictEqual, since the adapter and the hand-authored
 * source data don't always agree on omitting vs. explicitly undefined-ing
 * an absent optional field — a distinction JS property access can't see
 * and the eventual JSON API wouldn't preserve either.
 *
 * Run with: node --env-file=.env.local ./node_modules/.bin/tsx scripts/golden-test.ts
 */
import assert from "node:assert/strict";

import { getPayloadClient } from "../lib/payloadClient";
import { adaptCmsProgram, type CmsProgramDoc } from "../lib/cmsAdapter";
import { PROGRAMS } from "../lib/programs";
import { getProgramDetail } from "../lib/programDetails";

function jsonNormalize<T>(value: T): unknown {
  return JSON.parse(JSON.stringify(value));
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
      assert.deepStrictEqual(jsonNormalize(actualDetail), jsonNormalize(expectedDetail));
      console.log(`PASS ${expectedProgram.id}`);
    } catch (err) {
      failures++;
      console.log(`FAIL ${expectedProgram.id}`);
      console.log(err instanceof Error ? err.message : err);
    }
  }

  console.log(failures === 0 ? "GOLDEN_TEST_PASSED" : `GOLDEN_TEST_FAILED (${failures} program(s))`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
