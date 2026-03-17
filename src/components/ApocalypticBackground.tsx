import woodFrameBg from "@/assets/wood-frame-background.png";

export const ApocalypticBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${woodFrameBg})`,
        }}
      />
    </div>
  );
};
