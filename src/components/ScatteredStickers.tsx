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

// Fixed positions distributed across the page (percentage based)
const positions = [
  { top: '8%', left: '3%', rotate: -15 },
  { top: '15%', right: '5%', rotate: 12 },
  { top: '28%', left: '2%', rotate: -8 },
  { top: '35%', right: '3%', rotate: 20 },
  { top: '48%', left: '4%', rotate: 5 },
  { top: '55%', right: '2%', rotate: -12 },
  { top: '68%', left: '3%', rotate: 18 },
  { top: '75%', right: '4%', rotate: -5 },
];

const ScatteredStickers = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden hidden lg:block">
      {stickers.map((sticker, index) => {
        const pos = positions[index];
        return (
          <img
            key={index}
            src={sticker.src}
            alt={sticker.alt}
            className="absolute w-12 h-12 object-contain opacity-70 hover:opacity-100 transition-opacity"
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
