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

// Positions in margins between sections (percentages from top, starting after hero ~15%)
const positions = [
  { top: '18%', left: '2%', rotate: -15 },
  { top: '25%', right: '2%', rotate: 12 },
  { top: '35%', left: '3%', rotate: -8 },
  { top: '42%', right: '3%', rotate: 20 },
  { top: '52%', left: '2%', rotate: 5 },
  { top: '60%', right: '2%', rotate: -12 },
  { top: '72%', left: '3%', rotate: 18 },
  { top: '80%', right: '3%', rotate: -5 },
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
            alt=""
            className="fixed w-16 h-16 object-contain opacity-70 pointer-events-none hidden lg:block z-10"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              transform: `rotate(${pos.rotate}deg)`,
            }}
            aria-hidden="true"
          />
        );
      })}
    </>
  );
};

export default ScatteredStickers;
