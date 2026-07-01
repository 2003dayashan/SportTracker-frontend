/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ඔයාගේ සියලුම TSX files check කරන්න මේක අනිවාර්යයි
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          darkBg: '#121212',    // ප්‍රධාන Dark Background එක
          navBg: '#161616',     // TopNav සහ Sidebar පසුබිම් වර්ණය
          cardBg: '#1C1C1C',    // Cards සහ Modals සඳහා ගන්නා වර්ණය
          border: '#262626',    // Gaming layout එකේ සියලුම සිහින් borders සඳහා
          accent: '#FF4655',    // ප්‍රධාන Crimson Red (Valorant/Cyberpunk style)
          textMuted: '#A3A3A3', // නිවේදන සහ කුඩා අකුරු සඳහා Muted Gray
        },
      },
      fontFamily: {
        // Gaming UI එකකට ගැලපෙන විදිහට system sans සහ mono fonts configure කර ඇත
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      letterSpacing: {
        'cyber': '0.25em',      // DESIGN එකේ තියෙන "UNDERGROUND PRO" වගේ ඒවට tracking වැඩි කරන්න
      }
    },
  },
  plugins: [],
}