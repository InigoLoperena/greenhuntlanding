import decoPizza from "@/assets/deco-pizza.png";
import decoDumpster from "@/assets/deco-dumpster.png";
import decoFishbone from "@/assets/deco-fishbone.png";
import decoBanana from "@/assets/deco-banana.png";
import decoFrog from "@/assets/deco-frog.png";
import decoApple from "@/assets/deco-apple.png";

const decoIcons = [
  decoPizza,
  decoDumpster,
  decoFishbone,
  decoBanana,
  decoFrog,
  decoApple,
];

interface FloatingDecoIconsProps {
  count?: number;
  seed?: number;
}

// Simple seeded random for consistent positioning
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const FloatingDecoIcons = ({ count = 4, seed = 1 }: FloatingDecoIconsProps) => {
  const icons = [];
  
  for (let i = 0; i < count; i++) {
    const iconIndex = Math.floor(seededRandom(seed + i * 7) * decoIcons.length);
    const left = seededRandom(seed + i * 13) * 80 + 5; // 5-85%
    const top = seededRandom(seed + i * 17) * 60 + 20; // 20-80%
    const rotation = seededRandom(seed + i * 23) * 40 - 20; // -20 to 20 degrees
    const size = seededRandom(seed + i * 29) * 20 + 40; // 40-60px
    
    icons.push(
      <img
        key={i}
        src={decoIcons[iconIndex]}
        alt=""
        className="absolute opacity-40 pointer-events-none"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          transform: `rotate(${rotation}deg)`,
          width: `${size}px`,
          height: 'auto',
        }}
        loading="lazy"
      />
    );
  }
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons}
    </div>
  );
};
