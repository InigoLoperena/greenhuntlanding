import bgLeftMargin from "@/assets/bg-left-margin.png";
import bgRightMargin from "@/assets/bg-right-margin.png";

export const MarginBackgrounds = () => {
  return (
    <>
      {/* Left margin background - fixed, repeating vertically */}
      <div 
        className="margin-bg margin-bg-left"
        style={{
          backgroundImage: `url(${bgLeftMargin})`,
        }}
        aria-hidden="true" 
      />
      
      {/* Right margin background - fixed, repeating vertically */}
      <div 
        className="margin-bg margin-bg-right"
        style={{
          backgroundImage: `url(${bgRightMargin})`,
        }}
        aria-hidden="true" 
      />
    </>
  );
};
