import bgLeftMargin from "@/assets/bg-left-margin.png";
import bgRightMargin from "@/assets/bg-right-margin.png";

export const MarginBackgrounds = () => {
  return (
    <>
      {/* Left margin background - fixed image width, container clips horizontally */}
      <div 
        className="fixed left-0 top-0 bottom-0 z-0 pointer-events-none overflow-hidden w-[50px] sm:w-[70px] md:w-[100px] lg:w-[140px] xl:w-[180px]"
        style={{ opacity: 0.18 }}
        aria-hidden="true"
      >
        <div
          className="h-full"
          style={{
            backgroundImage: `url(${bgLeftMargin})`,
            backgroundRepeat: 'repeat-y',
            backgroundSize: '180px auto',
            backgroundPosition: 'left top',
            width: '180px'
          }}
        />
      </div>
      
      {/* Right margin background - fixed image width, container clips horizontally */}
      <div 
        className="fixed right-0 top-0 bottom-0 z-0 pointer-events-none overflow-hidden w-[50px] sm:w-[70px] md:w-[100px] lg:w-[140px] xl:w-[180px]"
        style={{ opacity: 0.18 }}
        aria-hidden="true"
      >
        <div
          className="h-full ml-auto"
          style={{
            backgroundImage: `url(${bgRightMargin})`,
            backgroundRepeat: 'repeat-y',
            backgroundSize: '180px auto',
            backgroundPosition: 'right top',
            width: '180px'
          }}
        />
      </div>
    </>
  );
};
