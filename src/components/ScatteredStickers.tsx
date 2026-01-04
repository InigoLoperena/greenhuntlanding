import stickerNoStooping from '@/assets/sticker-no-stooping.png';
import stickerRecycle from '@/assets/sticker-recycle.png';
import stickerDumpster from '@/assets/sticker-dumpster.png';
import stickerFishbone from '@/assets/sticker-fishbone.png';
import stickerBanana from '@/assets/sticker-banana.png';
import stickerFrog from '@/assets/sticker-frog.png';
import stickerApple from '@/assets/sticker-apple.png';
import stickerPizza from '@/assets/sticker-pizza.png';

const stickers = [
  { src: stickerNoStooping, alt: 'No Stooping Sign' },
  { src: stickerRecycle, alt: 'Recycle Symbol' },
  { src: stickerDumpster, alt: 'Dumpster Diving Warning' },
  { src: stickerFishbone, alt: 'Fish Bone' },
  { src: stickerBanana, alt: 'Banana Peel' },
  { src: stickerFrog, alt: 'Frog' },
  { src: stickerApple, alt: 'Apple Core' },
  { src: stickerPizza, alt: 'Pizza Slice' },
];

// Positions carefully placed in margins and between sections (avoiding header and content)
// Using pixel values from top to ensure they start after the hero section
const positions = [
  { top: '850px', left: '2%', rotate: -15 },
  { top: '1100px', right: '2%', rotate: 12 },
  { top: '1600px', left: '3%', rotate: -8 },
  { top: '1900px', right: '3%', rotate: 20 },
  { top: '2500px', left: '2%', rotate: 5 },
  { top: '2800px', right: '2%', rotate: -12 },
  { top: '3400px', left: '3%', rotate: 18 },
  { top: '3700px', right: '3%', rotate: -5 },
];

const ScatteredStickers = () => {
  return (
    <div className="absolute inset-0 overflow-visible pointer-events-none hidden lg:block" aria-hidden="true">
      {stickers.map((sticker, index) => {
        const pos = positions[index];
        return (
          <img
            key={index}
            src={sticker.src}
            alt=""
            className="absolute w-16 h-16 object-contain opacity-70"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              transform: `rotate(${pos.rotate}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};

export default ScatteredStickers;
