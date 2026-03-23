import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "tertiary-fixed-dim": "#e2c19b",
                "primary": "#03192e",
                "tertiary-container": "#3d290e",
                "on-primary-fixed-variant": "#35485f",
                "on-tertiary-fixed": "#291801",
                "on-secondary-fixed": "#1b1c1c",
                "outline-variant": "#c4c6cd",
                "secondary": "#5f5e5e",
                "primary-container": "#1a2e44",
                "inverse-primary": "#b4c8e4",
                "primary-fixed-dim": "#b4c8e4",
                "on-tertiary-fixed-variant": "#594325",
                "on-secondary": "#ffffff",
                "secondary-fixed-dim": "#c8c6c6",
                "on-error-container": "#93000a",
                "on-background": "#1b1c19",
                "tertiary-fixed": "#ffddb6",
                "surface-variant": "#e4e2dd",
                "on-tertiary-container": "#ad8f6c",
                "on-primary-fixed": "#061d32",
                "outline": "#74777d",
                "on-surface-variant": "#43474d",
                "on-secondary-fixed-variant": "#474747",
                "surface-container-highest": "#e4e2dd",
                "on-primary": "#ffffff",
                "background": "#fbf9f4",
                "surface-container-low": "#f5f3ee",
                "secondary-container": "#e4e2e1",
                "primary-fixed": "#d1e4ff",
                "surface-bright": "#fbf9f4",
                "surface-container": "#f0eee9",
                "on-tertiary": "#ffffff",
                "on-surface": "#1b1c19",
                "on-secondary-container": "#656464",
                "surface-dim": "#dbdad5",
                "on-error": "#ffffff",
                "error-container": "#ffdad6",
                "surface-container-high": "#eae8e3",
                "surface": "#fbf9f4",
                "inverse-on-surface": "#f2f1ec",
                "tertiary": "#251500",
                "error": "#ba1a1a",
                "surface-container-lowest": "#ffffff",
                "on-primary-container": "#8296b0",
                "surface-tint": "#4c6078",
                "secondary-fixed": "#e4e2e1",
                "inverse-surface": "#30312e"
            },
            fontFamily: {
                "headline": ["var(--font-noto-serif)"],
                "body": ["var(--font-manrope)"],
                "label": ["var(--font-manrope)"],
                "serif": ["var(--font-noto-serif)"],
                "sans": ["var(--font-manrope)"],
            },
            boxShadow: {
                'glass-premium': '0 20px 50px -10px rgba(28, 25, 23, 0.1), 0 10px 20px -5px rgba(28, 25, 23, 0.04)',
                'glass-button': '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                'glass-hover': '0 30px 40px -10px rgba(0, 0, 0, 0.12)',
                'glass-inset': 'inset 0 0 0 1px rgba(255, 255, 255, 0.6), inset 0 0 30px 0 rgba(255, 255, 255, 0.4)',
                'glass-glow': 'inset 10px 10px 20px -10px rgba(255, 255, 255, 0.8)',
                'ambient': '0 20px 50px rgba(27, 28, 25, 0.05)',
            },
            backgroundColor: {
                'white-glass': 'rgba(255, 255, 255, 0.35)',
                'white-glass-material': 'rgba(255, 255, 255, 0.88)',
                'dark-glass': 'rgba(28, 25, 23, 0.4)',
            },
            backgroundImage: {
                'glass-noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
                'ink-gradient': 'linear-gradient(135deg, #03192e 0%, #1a2e44 100%)',
            },
            borderRadius: {
                "none": "0",
                "sm": "0.125rem", // 2px
                "DEFAULT": "0.125rem", // 2px
                "md": "0.375rem", // 6px
                "lg": "0.5rem", // 8px
                "full": "9999px"
            },
        },
    },
    plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
export default config;