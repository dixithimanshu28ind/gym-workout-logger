type LogoMarkProps = {
  size?: number;
  className?: string;
  title?: string;
};

/**
 * The custom Log & Train ampersand-arrow mark.
 *
 * The ampersand is rendered with Poppins ExtraBold for its heavy, rounded
 * silhouette. Its lower-right exit is continued by a single upward-right shaft
 * that matches the glyph's stroke weight and finishes in a dart-style arrowhead
 * with a concave rear notch. All geometry lives in one view box so every
 * displayed size shares identical proportions.
 */
export default function LogoMark({ size = 120, className, title }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 140 120"
      width={size}
      height={(size * 120) / 140}
      className={className}
      role="img"
      aria-label={title ?? "Log & Train mark"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title ?? "Log & Train mark"}</title>

      {/* Ampersand — Poppins ExtraBold */}
      <text
        x="2"
        y="96"
        fill="currentColor"
        style={{
          fontFamily: "var(--font-poppins), sans-serif",
          fontWeight: 800,
          fontSize: "118px",
        }}
      >
        &amp;
      </text>

      {/* Upward-right shaft continuing the ampersand's lower-right exit */}
      <path
        d="M70 92 L112 44"
        stroke="currentColor"
        strokeWidth="18"
        strokeLinecap="round"
      />

      {/* Dart-style arrowhead with a concave rear notch */}
      <path
        d="M130 24 L123.2 60.6 L116.2 39.8 L94.6 35.6 Z"
        fill="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  );
}
