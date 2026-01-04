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

// Pre-generated random positions to avoid re-rendering issues
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
  { top: '92%', left: '5%', rotate: 5 },
  { top: '95%', left: '89%', rotate: -45 },
  { top: '15%', left: '45%', rotate: 12 },
  { top: '32%', left: '52%', rotate: -18 },
  { top: '45%', left: '48%', rotate: 28 },
  { top: '68%', left: '50%', rotate: -22 },
  { top: '88%', left: '46%', rotate: 8 },
  { top: '8%', left: '25%', rotate: -12 },
  { top: '28%', left: '72%', rotate: 22 },
  { top: '55%', left: '30%', rotate: -8 },
  { top: '78%', left: '68%', rotate: 38 },
  { top: '18%', left: '65%', rotate: -28 },
  { top: '42%', left: '22%', rotate: 18 },
  { top: '65%', left: '78%', rotate: -5 },
  { top: '90%', left: '35%', rotate: 32 },
  { top: '3%', left: '58%', rotate: -15 },
  { top: '35%', left: '38%', rotate: 42 },
  { top: '70%', left: '15%', rotate: -38 },
];

export default function ScatteredBackground() {
  return (
    <div className="fixed inset-0 bg-black overflow-hidden pointer-events-none z-0">
      {positions.map((pos, index) => (
        <img
          key={index}
          src={images[index % images.length]}
          alt=""
          className="absolute w-12 h-12 object-contain opacity-40"
          style={{
            top: pos.top,
            left: pos.left,
            transform: `rotate(${pos.rotate}deg)`,
          }}
          loading="lazy"
        />
      ))}
    </div>
  );
}
