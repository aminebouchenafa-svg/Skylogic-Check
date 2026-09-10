/** Pictogrammes vectoriels, taille et couleur héritées du texte. */
type Props = { size?: number }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export const IconGauge = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <path d="M12 21a9 9 0 1 0-9-9" />
    <path d="M3 12h3M12 3v3M19.1 5 17 7.1" />
    <path d="m12 12 4.5-2.5" />
  </svg>
)

export const IconForms = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
)

export const IconArchive = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 13h4" />
  </svg>
)

export const IconSettings = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H1a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 2.6 7a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 7 2.6h.1A1.7 1.7 0 0 0 9 1.1V1a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 15 2.6" />
  </svg>
)

export const IconPdf = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 15h1.5a1.5 1.5 0 0 0 0-3H9v6M14.5 18v-6h1.7" />
  </svg>
)

export const IconShare = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
  </svg>
)

export const IconMail = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export const IconWhatsapp = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <path d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 20.5l1.8-5.2A8.5 8.5 0 1 1 21 11.5z" />
    <path d="M8.8 8.2c.3-.6.6-.5.9-.5h.6c.2 0 .5 0 .7.5l.8 1.8c.1.3 0 .5-.2.7l-.4.5c-.2.2-.3.4-.1.7a6.3 6.3 0 0 0 2.9 2.5c.3.1.5.1.7-.1l.6-.7c.2-.2.4-.2.6-.1l1.7.9c.3.2.4.3.4.6a2 2 0 0 1-1.9 1.7c-1 0-2.8-.5-4.6-2.2a9.4 9.4 0 0 1-2.6-4c-.3-1 .1-1.9.4-2.3z" />
  </svg>
)

export const IconSave = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <path d="M17 21v-8H7v8M7 3v5h8" />
  </svg>
)

export const IconPlus = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const IconTrash = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <path d="M4 7h16M10 11v6M14 11v6" />
    <path d="M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
)

export const IconBack = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

export const IconAlert = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.6h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
  </svg>
)

export const IconWing = ({ size = 22 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.5 13.8 21 4.2c.6-.3 1.2.4.8.9l-5.5 7.3 4 6.6c.3.5-.2 1.1-.8.9l-6.6-2.6-3.2 3.9c-.4.5-1.2.2-1.2-.4l-.1-4.6-5.8-1.4c-.6-.2-.6-1 .1-1z" />
  </svg>
)

/* ------------------------------------------------- Pictogrammes des formes */

export const IconLineCheck = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z" />
    <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
    <path d="m8.5 13.5 2.2 2.2 4.8-5" />
  </svg>
)

export const IconTraining = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <path d="m12 4 9 4.5-9 4.5-9-4.5z" />
    <path d="M7 10.6V16c0 1.4 2.2 2.6 5 2.6s5-1.2 5-2.6v-5.4" />
    <path d="M21 8.5V14" />
  </svg>
)

export const IconSimulator = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
    <path d="M9 20h6M12 16.5V20" />
    <path d="m7 12 4-1.4V8.2c0-.7.4-1.2 1-1.2s1 .5 1 1.2v2.4L17 12v1l-4-.8v1.6l1.2 1v.7L12 15l-2.2.5v-.7l1.2-1v-1.6L7 13z" />
  </svg>
)

export const IconReport = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M8.5 12.5h7M8.5 16h4.5" />
  </svg>
)

export const IconSkill = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <circle cx="12" cy="9" r="5.2" />
    <path d="m8.6 13.4-1.4 7 4.8-2.4 4.8 2.4-1.4-7" />
    <path d="m10.2 9 1.3 1.3 2.4-2.5" />
  </svg>
)

export const IconRemedial = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
    <path d="M20.7 4.4v4.8h-4.8" />
    <path d="m9.4 12.2 1.9 1.9 3.6-3.8" />
  </svg>
)

export const IconNotification = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
    <path d="M14 3v5h5" />
    <circle cx="17.5" cy="6.5" r="3.5" />
    <path d="M17.5 5v1.8M17.5 8.3v.01" />
  </svg>
)

export const IconCertificate = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <path d="M19 12V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5" />
    <path d="M8.5 7.5h7M8.5 11h5" />
    <circle cx="17" cy="16.5" r="3.2" />
    <path d="m15 19.2-.6 2.8 2.6-1.3 2.6 1.3-.6-2.8" />
  </svg>
)

export const IconCommand = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <path d="M5.5 6.5 12 3l6.5 3.5v3.3c0 4.3-2.6 8.2-6.5 9.7-3.9-1.5-6.5-5.4-6.5-9.7z" />
    <path d="M9 9h6M9 12h6M9 15h4" />
  </svg>
)

export const IconRnav = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 1 0-13 0c0 5.4 6.5 11 6.5 11z" />
    <circle cx="12" cy="10" r="2.2" />
    <path d="M3 13.5h3M18 13.5h3" />
  </svg>
)

export const IconConfidential = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
    <path d="M14 3v5h5V9M8.5 8h2M8.5 11.5h6M8.5 15h3" />
    <rect x="14" y="15" width="7" height="5.5" rx="1" />
    <path d="M15.8 15v-1.6a1.7 1.7 0 0 1 3.4 0V15" />
  </svg>
)

export const IconAirfield = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <path d="M9.5 21 12 3l2.5 18" />
    <path d="M10.4 14.5h3.2M10 17.5h4" />
    <path d="M4 9.5 2.5 21M20 9.5 21.5 21" />
  </svg>
)

export const IconSyllabus = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
    <path d="m6.6 8.5 1.4 1.4 2.4-2.6M6.6 13.5l1.4 1.4 2.4-2.6" />
    <path d="M13.5 9h4.2M13.5 14h4.2" />
  </svg>
)

export const IconProgress = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <path d="M3 20.5h18" />
    <rect x="4.5" y="13" width="3.6" height="7.5" rx="0.8" />
    <rect x="10.2" y="9.5" width="3.6" height="11" rx="0.8" />
    <rect x="15.9" y="5.5" width="3.6" height="15" rx="0.8" />
    <path d="M4 9.5 9 6l3.5 2.5L20 3" />
  </svg>
)

export const IconLowVis = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <path d="M12 3v6" />
    <path d="M8.5 6.2 12 3l3.5 3.2" />
    <path d="M4 12.5h16M3 16h13M6 19.5h15" />
  </svg>
)

export const IconEtops = ({ size = 26 }: Props) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.4 2.4 2.4 14.1 0 17M12 3.5c-2.4 2.4-2.4 14.1 0 17" />
  </svg>
)
