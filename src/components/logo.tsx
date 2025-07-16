import * as React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 128 128"
    width="32"
    height="32"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      d="M64 0L78.28 24.5L106.86 28.14L85.43 48.25L90.57 76.28L64 63.5L37.43 76.28L42.57 48.25L21.14 28.14L49.72 24.5L64 0Z"
      fill="url(#grad1)"
      transform="translate(0, 5)"
    />
    <path
      d="M21.1,84.15l22.4-11.45a1,1,0,0,0,.51-1.33L35.8,52.2a1,1,0,0,0-1.33-.51L12.08,59.9a1,1,0,0,0-.51,1.33l8.22,19.17A1,1,0,0,0,21.1,84.15Z"
      fill="hsl(var(--primary))"
      opacity="0.7"
    />
     <path
      d="M106.9,84.15l-22.4-11.45a1,1,0,0,1-.51-1.33L92.2,52.2a1,1,0,0,1,1.33-.51l22.4,11.45a1,1,0,0,1,.51,1.33l-8.22,19.17A1,1,0,0,1,106.9,84.15Z"
      fill="hsl(var(--primary))"
      opacity="0.7"
    />
     <path
      d="M64,128l-14.2-24.5-28.58-3.64L42.57,79.75,37.43,51.72,64,64.5l26.57-12.78,5.14,28-21.35,20.11-28.58,3.64Z"
      fill="hsl(var(--accent))"
      opacity="0.8"
    />
  </svg>
);
