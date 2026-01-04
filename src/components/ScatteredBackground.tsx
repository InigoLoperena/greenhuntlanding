import bgTrashCan from "@/assets/bg-trash-can.png";
import bgFishSkeleton from "@/assets/bg-fish-skeleton.png";
import bgBananaPeel from "@/assets/bg-banana-peel.png";
import bgFrog from "@/assets/bg-frog.png";
import bgAppleCore from "@/assets/bg-apple-core.png";
import bgPizza from "@/assets/bg-pizza.png";
import bgWatermelon from "@/assets/bg-watermelon.png";
import bgMeat from "@/assets/bg-meat.png";

const images = [
  bgTrashCan,
  bgFishSkeleton,
  bgBananaPeel,
  bgFrog,
  bgAppleCore,
  bgPizza,
  bgWatermelon,
  bgMeat,
];

// Pre-generated random positions distributed across viewport
const positions = [
  { top: '5%', left: '8%', rotate: 15 },
  { top: '12%', left: '85%', rotate: -20 },
  { top: '25%', left: '3%', rotate: 45 },
  { top: '22%', left: '92%', rotate: -35 },
  { top: '38%', left: '6%', rotate: 10 },
  { top: '35%', left: '88%', rotate: -15 },
  { top: '48%', left: '2%', rotate: -25 },
  { top: '52%', left: '94%', rotate: 30 },
  { top: '62%', left: '7%', rotate: 20 },
  { top: '58%', left: '90%', rotate: -40 },
  { top: '72%', left: '4%', rotate: -10 },
  { top: '75%', left: '86%', rotate: 25 },
  { top: '85%', left: '9%', rotate: 35 },
  { top: '82%', left: '92%', rotate: -30 },
];

export default function ScatteredBackground() {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        backgroundColor: 'black',
      }}
    >
      {positions.map((pos, index) => (
        <img
          key={index}
          src={images[index % images.length]}
          alt=""
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            transform: `rotate(${pos.rotate}deg)`,
            width: '80px',
            height: '80px',
            objectFit: 'contain',
          }}
        />
      ))}
    </div>
  );
}
