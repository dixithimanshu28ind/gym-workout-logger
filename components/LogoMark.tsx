"use client";

import { useId } from "react";

/**
 * The "&" in the Log & Train wordmark, with its lower-right tail replaced by
 * an upward arrow (progress). Traced from Poppins ExtraBold's ampersand —
 * see GYM-25 for the design review. Renders in `currentColor`, sized to the
 * surrounding text via the `className` passed in (e.g. `h-[0.85em] w-auto`).
 */
export default function LogoMark({ className }: { className?: string }) {
  const clipId = useId();

  return (
    <svg
      viewBox="8 -234 268 238"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <path
            d="M -20,-260 H 300 V 40 H -20 Z M 164,-122 h 112 v 134 h -112 Z"
            clipRule="evenodd"
          />
        </clipPath>
      </defs>
      {/* Poppins' ampersand leans right and its bowl bulges further left than
          its loop, which reads as tilted and unevenly spaced once the arrow
          pulls the top-right further out. A small counter-rotation about the
          glyph's center straightens the lean and rebalances the side-bearing
          in one move (feedback from GYM-25 review). */}
      <g transform="rotate(-7, 142, -115)">
        <g clipPath={`url(#${clipId})`}>
          <path d="M260.48 0L189.76 0L171.52-17.28Q141.12 3.52 98.88 3.52Q72.32 3.52 52.64-5.12Q32.96-13.76 22.24-29.44Q11.52-45.12 11.52-65.60Q11.52-86.08 22.24-102.88Q32.96-119.68 54.40-130.24Q46.40-140.48 42.88-149.76Q39.36-159.04 39.36-169.60Q39.36-186.24 48-200Q56.64-213.76 73.44-221.92Q90.24-230.08 113.28-230.08Q136.64-230.08 152.96-221.60Q169.28-213.12 177.44-199.20Q185.60-185.28 185.28-168.96L127.36-168.96Q127.36-176.32 123.20-180.16Q119.04-184 112.96-184Q106.56-184 102.24-180.32Q97.92-176.64 97.92-170.24Q97.92-159.04 113.92-143.04L166.72-91.52Q169.60-97.28 172.80-105.28L179.20-116.80L241.28-116.80L232-98.88Q220.48-71.36 206.72-52.48L260.48 0M103.04-46.72Q120-46.72 133.12-54.08L88.64-96.64Q80.32-91.52 76.16-84.80Q72-78.08 72-71.04Q72-60.80 80.32-53.76Q88.64-46.72 103.04-46.72" />
        </g>
        <path
          d="M 150,-100 L 227.8,-177.8"
          stroke="currentColor"
          strokeWidth="40"
          strokeLinecap="round"
          fill="none"
        />
        <polygon points="263.1,-213.1 258.9,-146.7 239.1,-189.1 196.7,-208.9" />
      </g>
    </svg>
  );
}
