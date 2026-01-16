import bgLeftMargin from "@/assets/bg-left-margin.png";
import bgRightMargin from "@/assets/bg-right-margin.png";

export const MarginBackgrounds = () => {
  // Repeat the images multiple times to cover the viewport height
  const repetitions = 10;
  
  return (
    <>
      {/* Left margin background */}
      <div 
        className="fixed left-0 top-0 bottom-0 z-0 pointer-events-none flex flex-col w-[50px] sm:w-[70px] md:w-[100px] lg:w-[140px] xl:w-[180px]"
        style={{ opacity: 0.18 }}
        aria-hidden="true"
      >
        {Array.from({ length: repetitions }).map((_, i) => (
          <img 
            key={i}
            src={bgLeftMargin} 
            alt="" 
            className="w-full h-auto"
            style={{ objectFit: 'contain' }}
          />
        ))}
      </div>
      
      {/* Right margin background */}
      <div 
        className="fixed right-0 top-0 bottom-0 z-0 pointer-events-none flex flex-col w-[50px] sm:w-[70px] md:w-[100px] lg:w-[140px] xl:w-[180px]"
        style={{ opacity: 0.18 }}
        aria-hidden="true"
      >
        {Array.from({ length: repetitions }).map((_, i) => (
          <img 
            key={i}
            src={bgRightMargin} 
            alt="" 
            className="w-full h-auto"
            style={{ objectFit: 'contain' }}
          />
        ))}
      </div>
    </>
  );
};
