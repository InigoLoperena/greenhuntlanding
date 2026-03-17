export const ApocalypticBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      {/* Solid dark brown-black background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(30 10% 6%) 0%, hsl(25 15% 8%) 50%, hsl(30 10% 5%) 100%)',
        }}
      />

      {/* Subtle wood grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 12px,
            rgba(139, 90, 43, 0.3) 12px,
            rgba(139, 90, 43, 0.3) 13px
          ), repeating-linear-gradient(
            90deg,
            transparent,
            transparent 80px,
            rgba(80, 50, 20, 0.2) 80px,
            rgba(80, 50, 20, 0.2) 81px
          )`,
        }}
      />

      {/* Rust stain accents */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: `
            radial-gradient(ellipse at 15% 25%, rgba(183, 65, 14, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 85% 60%, rgba(166, 90, 48, 0.3) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 90%, rgba(107, 77, 45, 0.3) 0%, transparent 40%)
          `,
        }}
      />
    </div>
  );
};
