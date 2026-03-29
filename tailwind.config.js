/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0a53ff"
        },
        canvas: "var(--bg)",
        surface: "var(--bg-elevated)",
        "surface-strong": "var(--bg-strong)",
        muted: "var(--text-muted)",
        soft: "var(--text-soft)",
        accent: "var(--accent)",
      },
      boxShadow: {
        panel: "var(--shadow-panel)",
        soft: "var(--shadow-soft)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at top left, rgba(159,181,255,0.14), transparent 28%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06), transparent 18%), linear-gradient(180deg, rgba(255,255,255,0.04), transparent 36%)",
        grid:
          "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
    }
  },
  plugins: []
};
