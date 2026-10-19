export const BrainLogoIcon = ({ className = "w-6 h-6 text-blue-600" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A4.5 4.5 0 0 0 5 6.5a4.48 4.48 0 0 0 .5 2A4.5 4.5 0 0 0 3 12a4.5 4.5 0 0 0 2.5 4 4.5 4.5 0 0 0 4 4.5v-1.5" />
    <path d="M14.5 2A4.5 4.5 0 0 1 19 6.5a4.48 4.48 0 0 1-.5 2A4.5 4.5 0 0 1 21 12a4.5 4.5 0 0 1-2.5 4 4.5 4.5 0 0 1-4 4.5v-1.5" />
    <path d="M12 4v16" />
    <path d="M9.5 7.5A2.5 2.5 0 0 1 12 10" />
    <path d="M14.5 7.5A2.5 2.5 0 0 0 12 10" />
    <path d="M9.5 15a2.5 2.5 0 0 0 2.5-2" />
    <path d="M14.5 15a2.5 2.5 0 0 1-2.5-2" />
    <path d="M5.5 12h2" />
    <path d="M16.5 12h2" />
  </svg>
);

// Brain Watermark in top-right of inner view headers
export const BrainWatermark = ({ className = "w-14 h-14 text-blue-200/60" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 5A9 9 0 0 0 10 14a8.9 8.9 0 0 0 1 4 9 9 0 0 0-5 8 9 9 0 0 0 5 8 9 9 0 0 0 8 9v-3" />
    <path d="M29 5A9 9 0 0 1 38 14a8.9 8.9 0 0 1-1 4 9 9 0 0 1 5 8 9 9 0 0 1-5 8 9 9 0 0 1-8 9v-3" />
    <path d="M24 8v32" />
    <path d="M19 15a5 5 0 0 1 5 5" />
    <path d="M29 15a5 5 0 0 0-5 5" />
    <path d="M19 30a5 5 0 0 0 5-4" />
    <path d="M29 30a5 5 0 0 1-5-4" />
    <path d="M11 24h4" />
    <path d="M33 24h4" />
    <circle cx="15" cy="18" r="1.5" fill="currentColor" />
    <circle cx="33" cy="18" r="1.5" fill="currentColor" />
    <circle cx="17" cy="30" r="1.5" fill="currentColor" />
    <circle cx="31" cy="30" r="1.5" fill="currentColor" />
  </svg>
);

// Brain Hero Illustration: Rich blue neuroscience graphic with glowing nodes & neural network
export const BrainHeroGraphic = () => (
  <div className="relative w-full max-w-md lg:max-w-lg aspect-square flex items-center justify-center select-none">
    {/* Ambient Glows */}
    <div className="absolute w-72 h-72 rounded-full bg-blue-400/20 blur-3xl -top-6 -right-6 pointer-events-none animate-pulse" />
    <div className="absolute w-60 h-60 rounded-full bg-cyan-400/20 blur-2xl bottom-4 left-6 pointer-events-none" />

    {/* Decorative Circular Waves */}
    <div className="absolute w-80 h-80 rounded-full border border-blue-200/40 pointer-events-none" />
    <div className="absolute w-96 h-96 rounded-full border border-dashed border-blue-200/30 pointer-events-none animate-[spin_60s_linear_infinite]" />

    {/* SVG Brain Neural Graphic */}
    <svg className="w-full h-full drop-shadow-2xl z-10" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brainGrad" x1="50" y1="50" x2="350" y2="350" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="40%" stopColor="#2563eb" />
          <stop offset="85%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <radialGradient id="coreGlow" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="25%" stopColor="#93c5fd" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="synapseLine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Internal glow sphere */}
      <circle cx="200" cy="190" r="130" fill="url(#coreGlow)" />

      {/* Main Brain Lobes Outline & Ridges (Left & Right Hemispheres) */}
      <g stroke="url(#brainGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        {/* Left Hemisphere Outer Lobes */}
        <path d="M195 90 C165 75, 125 85, 95 115 C65 145, 60 185, 68 215 C75 245, 95 265, 115 285 C135 305, 160 315, 185 320 C190 321, 195 320, 195 310 Z" />
        {/* Right Hemisphere Outer Lobes */}
        <path d="M205 90 C235 75, 275 85, 305 115 C335 145, 340 185, 332 215 C325 245, 305 265, 285 285 C265 305, 240 315, 215 320 C210 321, 205 320, 205 310 Z" />
        {/* Longitudinal Fissure (Center Divider) */}
        <path d="M200 88 C198 120, 202 160, 200 200 C198 240, 202 280, 200 320" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.6" />
      </g>

      {/* Sulci and Gyri Curves (Brain Wrinkles) */}
      <g stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" opacity="0.75">
        {/* Left Side Wrinkles */}
        <path d="M110 135 C135 130, 155 145, 175 140" />
        <path d="M85 180 C110 170, 130 190, 170 175" />
        <path d="M90 225 C120 220, 140 235, 180 220" />
        <path d="M115 265 C135 255, 160 270, 185 260" />
        <path d="M140 105 C155 118, 170 110, 185 118" />

        {/* Right Side Wrinkles */}
        <path d="M290 135 C265 130, 245 145, 225 140" />
        <path d="M315 180 C290 170, 270 190, 230 175" />
        <path d="M310 225 C280 220, 260 235, 220 220" />
        <path d="M285 265 C265 255, 240 270, 215 260" />
        <path d="M260 105 C245 118, 230 110, 215 118" />
      </g>

      {/* Neural Synapses & Network Nodes (AI / Deep Learning Motif) */}
      <g stroke="url(#synapseLine)" strokeWidth="1.2">
        <line x1="140" y1="120" x2="190" y2="150" />
        <line x1="190" y1="150" x2="210" y2="150" />
        <line x1="210" y1="150" x2="260" y2="120" />
        <line x1="120" y1="180" x2="165" y2="195" />
        <line x1="165" y1="195" x2="200" y2="175" />
        <line x1="200" y1="175" x2="235" y2="195" />
        <line x1="235" y1="195" x2="280" y2="180" />
        <line x1="135" y1="240" x2="170" y2="230" />
        <line x1="170" y1="230" x2="200" y2="250" />
        <line x1="200" y1="250" x2="230" y2="230" />
        <line x1="230" y1="230" x2="265" y2="240" />
        <line x1="160" y1="285" x2="200" y2="270" />
        <line x1="200" y1="270" x2="240" y2="285" />

        {/* Cross connections */}
        <line x1="190" y1="150" x2="200" y2="175" />
        <line x1="210" y1="150" x2="200" y2="175" />
        <line x1="165" y1="195" x2="170" y2="230" />
        <line x1="235" y1="195" x2="230" y2="230" />
      </g>

      {/* Synaptic Nodes Glowing */}
      <g fill="#ffffff" filter="url(#glow)">
        <circle cx="140" cy="120" r="3.5" />
        <circle cx="260" cy="120" r="3.5" />
        <circle cx="190" cy="150" r="4" fill="#38bdf8" />
        <circle cx="210" cy="150" r="4" fill="#38bdf8" />
        <circle cx="200" cy="175" r="5" fill="#60a5fa" />
        <circle cx="120" cy="180" r="3" />
        <circle cx="280" cy="180" r="3" />
        <circle cx="165" cy="195" r="4" fill="#38bdf8" />
        <circle cx="235" cy="195" r="4" fill="#38bdf8" />
        <circle cx="170" cy="230" r="3.5" />
        <circle cx="230" cy="230" r="3.5" />
        <circle cx="200" cy="250" r="4.5" fill="#60a5fa" />
        <circle cx="135" cy="240" r="3" />
        <circle cx="265" cy="240" r="3" />
        <circle cx="160" cy="285" r="3" />
        <circle cx="240" cy="285" r="3" />
        <circle cx="200" cy="270" r="3.5" />
      </g>

      {/* Core Glowing Heart of the Model */}
      <circle cx="200" cy="175" r="2.5" fill="#ffffff" />
    </svg>
  </div>
);

// Brain outline icon for prediction AD badge
export const BrainOutlineBadge = ({ className = "w-10 h-10 text-rose-500" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A4.5 4.5 0 0 0 5 6.5a4.48 4.48 0 0 0 .5 2A4.5 4.5 0 0 0 3 12a4.5 4.5 0 0 0 2.5 4 4.5 4.5 0 0 0 4 4.5v-1.5" />
    <path d="M14.5 2A4.5 4.5 0 0 1 19 6.5a4.48 4.48 0 0 1-.5 2A4.5 4.5 0 0 1 21 12a4.5 4.5 0 0 1-2.5 4 4.5 4.5 0 0 1-4 4.5v-1.5" />
    <path d="M12 4v16" />
    <path d="M9.5 7.5A2.5 2.5 0 0 1 12 10" />
    <path d="M14.5 7.5A2.5 2.5 0 0 0 12 10" />
    <path d="M9.5 15a2.5 2.5 0 0 0 2.5-2" />
    <path d="M14.5 15a2.5 2.5 0 0 1-2.5-2" />
  </svg>
);
