interface TrellisLogoProps {
  size?: number
  className?: string
  showText?: boolean
  subtitle?: string
}

/**
 * Trellis brand mark and logo.
 * Geometric structural lattice representing framework, growth and coordination.
 */
export function TrellisMark({
  size = 32,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill="var(--primary, #4F6EF7)" />
      {/* Structural vertical posts */}
      <line
        x1="11"
        y1="7"
        x2="11"
        y2="25"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="21"
        y1="7"
        x2="21"
        y2="25"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Structural horizontal beams */}
      <line
        x1="7"
        y1="11"
        x2="25"
        y2="11"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="7"
        y1="21"
        x2="25"
        y2="21"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Central intersection nodes */}
      <circle cx="11" cy="11" r="1.5" fill="#ffffff" />
      <circle cx="21" cy="11" r="1.5" fill="#ffffff" />
      <circle cx="11" cy="21" r="1.5" fill="#ffffff" />
      <circle cx="21" cy="21" r="1.5" fill="#ffffff" />
    </svg>
  )
}

export function TrellisLogo({
  size = 32,
  className = '',
  showText = true,
  subtitle = 'Admin',
}: TrellisLogoProps) {
  return (
    <div
      className={`trellis-brand ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
    >
      <TrellisMark size={size} />
      {showText && (
        <span
          className="trellis-brand__text"
          style={{ display: 'inline-flex', alignItems: 'baseline', gap: 5 }}
        >
          <span
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
            }}
          >
            Trellis
          </span>
          {subtitle && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--muted-foreground)',
              }}
            >
              {subtitle}
            </span>
          )}
        </span>
      )}
    </div>
  )
}
