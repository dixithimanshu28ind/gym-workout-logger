import type { CollectionConfig } from "payload";

import { INTEREST_KEY_LIST, INTEREST_KEYS, INTEREST_MESSAGE_MAX } from "../lib/interest";

const isCmsUser = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

/**
 * People who asked to hear about a feature before it launches (GYM-47): an
 * email and, if they wanted, a comment about what they would like.
 *
 * Entries arrive only through the site's own endpoint (app/(app)/api/interest),
 * which validates them and saves with the Local API, so nobody can create one
 * through the CMS API. CMS users can read, edit and delete them.
 *
 * These are email addresses. The table is created with row-level security on
 * and the public roles revoked (see the migration and lib/rlsSql.ts), so the
 * public Supabase key cannot read it.
 */
export const InterestRegistrations: CollectionConfig = {
  slug: "interest-registrations",
  labels: { singular: "Interest registration", plural: "Interest registrations" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "interest", "message", "emailStatus", "createdAt"],
    description:
      "People who asked to hear about a feature before it launches. Newest first: open the list and sort by Created.",
  },
  defaultSort: "-createdAt",
  access: {
    create: () => false,
    read: isCmsUser,
    update: isCmsUser,
    delete: isCmsUser,
  },
  fields: [
    { name: "email", type: "email", required: true, index: true },
    {
      name: "interest",
      type: "select",
      required: true,
      index: true,
      options: INTEREST_KEY_LIST.map((key) => ({ label: INTEREST_KEYS[key].label, value: key })),
    },
    {
      name: "message",
      type: "textarea",
      maxLength: INTEREST_MESSAGE_MAX,
      admin: { description: "What they said they would want, in their own words." },
    },
    {
      name: "noticeVersion",
      type: "text",
      admin: { readOnly: true, description: "Which version of the privacy notice was shown when they registered." },
    },
    {
      name: "emailStatus",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Sent to support", value: "sent" },
        { label: "Sending failed", value: "failed" },
        { label: "Not configured (saved only)", value: "not_configured" },
        { label: "Test entry (not emailed)", value: "skipped_test" },
        { label: "Not emailed (hourly limit)", value: "skipped_cap" },
      ],
      admin: { description: "Whether the copy to support@logandtrain.com went out. The entry itself is always saved." },
    },
  ],
};
