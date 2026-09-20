@AGENTS.md

## Definition of done

Applies to any change to what a user sees or does: copy, labels, routes, flows, auth, redirects.

1. **Update or add the e2e spec.** The end-to-end suite lives in a separate repo, `logandtrain-e2e-tests` (locally `~/Desktop/My Learnings/LogAndTrain-e2e-tests`; see its README). It selects on visible copy, roles and labels, so UI changes break it. It once sat red for two weeks because nothing kept it in step with the app. Critical paths are tagged `@smoke` and run against every PR preview and after every production deploy; deeper scenarios are `@regression` and run nightly.
2. **Check the `e2e/smoke` status** on the PR (from its preview) and on the merge commit (from production). A failure links to the run, with a trace and video. Do not merge over a red one without knowing why.
3. **Fix the cause; do not loosen the test.** The suite fails on any console error, uncaught exception, 5xx response or failed request, and that has found real bugs (GYM-36, GYM-37). Only allow-list a message for a test that deliberately triggers it, and say why.
4. **A bug the suite finds gets its own Jira card**, and the PR that fixes it includes the matching test change in the e2e repo.
