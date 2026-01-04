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

// Positions scattered throughout the page (percentage based, relative to parent)
const positions = [
  { top: '5%', left: '8%', rotate: -15 },
  { top: '12%', left: '75%', rotate: 12 },
  { top: '22%', left: '15%', rotate: -8 },
  { top: '30%', left: '82%', rotate: 20 },
  { top: '42%', left: '5%', rotate: 5 },
  { top: '52%', left: '88%', rotate: -12 },
  { top: '62%', left: '20%', rotate: 18 },
  { top: '72%', left: '78%', rotate: -5 },
];

const ScatteredStickers = () => {
  return (
    <>
      {stickers.map((sticker, index) => {
        const pos = positions[index];
        return (
          <img
            key={index}
            src={sticker.src}
            alt={sticker.alt}
            className="absolute w-16 h-16 object-contain opacity-80 pointer-events-none z-20"
            style={{
              top: pos.top,
              left: pos.left,
              transform: `rotate(${pos.rotate}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

export default ScatteredStickers;
