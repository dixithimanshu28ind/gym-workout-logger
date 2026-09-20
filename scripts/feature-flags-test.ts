/**
 * Tests for the pure feature-flag rules in lib/featureFlags.ts: the state each
 * feature ends up in, the environment override, and above all the fail-safe
 * (a flag that cannot be read, or holds a bad value, must be Off).
 *
 * Needs no database. Run with: node ./node_modules/.bin/tsx scripts/feature-flags-test.ts
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  FEATURE_KEYS,
  parseOverride,
  publicFeatureStates,
  resolveFeatureStates,
  type FeatureStates,
} from "../lib/featureFlags";

const allOff = Object.fromEntries(FEATURE_KEYS.map((k) => [k, "off"])) as FeatureStates;

test("the registry starts with custom_programs and community", () => {
  assert.ok(FEATURE_KEYS.includes("custom_programs"));
  assert.ok(FEATURE_KEYS.includes("community"));
});

test("nothing saved yet -> every feature is off (the registry default)", () => {
  assert.deepEqual(resolveFeatureStates({}, {}), allOff);
});

test("saved values are used as they are", () => {
  const states = resolveFeatureStates({ custom_programs: "live", community: "coming_soon" }, {});
  assert.equal(states.custom_programs, "live");
  assert.equal(states.community, "coming_soon");
});

test("FAIL SAFE: CMS unreadable -> everything off", () => {
  assert.deepEqual(resolveFeatureStates(null, {}), allOff);
});

test("FAIL SAFE: a saved value that is not a state -> off, never live", () => {
  for (const bad of ["LIVE", "Live ", "on", "true", "", 1, true, {}, []]) {
    assert.equal(resolveFeatureStates({ custom_programs: bad }, {}).custom_programs, "off", `value ${JSON.stringify(bad)}`);
  }
});

test("a bad value in one feature does not affect another", () => {
  const states = resolveFeatureStates({ custom_programs: "garbage", community: "live" }, {});
  assert.equal(states.custom_programs, "off");
  assert.equal(states.community, "live");
});

test("override wins over the CMS, both ways", () => {
  const cms = { custom_programs: "off", community: "live" };
  const states = resolveFeatureStates(cms, { custom_programs: "live", community: "off" });
  assert.equal(states.custom_programs, "live");
  assert.equal(states.community, "off");
});

test("override only touches the features it names", () => {
  const states = resolveFeatureStates({ custom_programs: "coming_soon", community: "live" }, { custom_programs: "live" });
  assert.equal(states.custom_programs, "live");
  assert.equal(states.community, "live");
});

test("override still applies when the CMS is unreadable; the rest stay off", () => {
  const states = resolveFeatureStates(null, { custom_programs: "live" });
  assert.equal(states.custom_programs, "live");
  assert.equal(states.community, "off");
});

test("parseOverride reads one or several entries, tolerating spaces", () => {
  assert.deepEqual(parseOverride("custom_programs=live").override, { custom_programs: "live" });
  assert.deepEqual(parseOverride(" custom_programs = live , community=coming_soon ").override, {
    custom_programs: "live",
    community: "coming_soon",
  });
  assert.deepEqual(parseOverride("custom_programs=live,").override, { custom_programs: "live" });
});

test("parseOverride: empty or missing -> nothing", () => {
  assert.deepEqual(parseOverride(undefined), { override: {}, warnings: [] });
  assert.deepEqual(parseOverride(""), { override: {}, warnings: [] });
  assert.deepEqual(parseOverride(" , ,"), { override: {}, warnings: [] });
});

test("FAIL SAFE: a typo in a state forces the feature off and says so", () => {
  const { override, warnings } = parseOverride("custom_programs=liev");
  assert.deepEqual(override, { custom_programs: "off" });
  assert.equal(warnings.length, 1);
  // ...even though the CMS says live:
  assert.equal(resolveFeatureStates({ custom_programs: "live" }, override).custom_programs, "off");
});

test("FAIL SAFE: a feature named with no state is forced off", () => {
  assert.deepEqual(parseOverride("custom_programs").override, { custom_programs: "off" });
  assert.deepEqual(parseOverride("custom_programs=").override, { custom_programs: "off" });
});

test("parseOverride: an unknown feature is skipped with a warning", () => {
  const { override, warnings } = parseOverride("no_such_feature=live,community=live");
  assert.deepEqual(override, { community: "live" });
  assert.equal(warnings.length, 1);
});

test("parseOverride is not fooled by inherited object keys", () => {
  for (const key of ["toString", "constructor", "__proto__", "hasOwnProperty"]) {
    assert.deepEqual(parseOverride(`${key}=live`).override, {}, key);
  }
});

test("public list has coming_soon and live features only, never off", () => {
  const states = resolveFeatureStates({ custom_programs: "coming_soon", community: "off" }, {});
  assert.deepEqual(publicFeatureStates(states), { custom_programs: "coming_soon" });
  assert.deepEqual(publicFeatureStates(allOff), {});
  assert.deepEqual(publicFeatureStates(resolveFeatureStates({ custom_programs: "live", community: "live" }, {})), {
    custom_programs: "live",
    community: "live",
  });
});
