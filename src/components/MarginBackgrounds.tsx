import bgLeftMargin from "@/assets/bg-left-margin.png";
import bgRightMargin from "@/assets/bg-right-margin.png";

export const MarginBackgrounds = () => {
  return (
    <>
      {/* Left margin background - using img tag for reliable scaling */}
      <div 
        className="fixed left-0 top-0 h-full z-0 pointer-events-none w-[50px] sm:w-[70px] md:w-[100px] lg:w-[140px] xl:w-[180px]"
        style={{ opacity: 0.18 }}
        aria-hidden="true"
      >
        <img 
          src={bgLeftMargin} 
          alt="" 
          className="w-full h-auto"
        />
      </div>
      
      {/* Right margin background - using img tag for reliable scaling */}
      <div 
        className="fixed right-0 top-0 h-full z-0 pointer-events-none w-[50px] sm:w-[70px] md:w-[100px] lg:w-[140px] xl:w-[180px]"
        style={{ opacity: 0.18 }}
        aria-hidden="true"
      >
        <img 
          src={bgRightMargin} 
          alt="" 
          className="w-full h-auto"
        />
      </div>
    </>
  );
};
