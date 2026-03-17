import woodBg from "@/assets/wood-background.jpg";

export const ApocalypticBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${woodBg})`,
        }}
      />
    </div>
  );
};
