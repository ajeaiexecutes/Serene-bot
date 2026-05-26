import cat from '../assets/cat.png'
import bubble from '../assets/bubble.png'

function Mascot() {
  return (
    <div className="relative flex items-end justify-center w-full h-[380px] overflow-hidden">

      {/* Cat - centered, large */}
      <img
        src={cat}
        alt="Lumid AI Pet"
        className="absolute bottom-[-135px] w-[234px] h-[351px] object-contain"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Speech Bubble - top right of cat
      <img
        src={bubble}
        alt="Coming Soon"
        className="absolute bottom-[84px] left-[calc(50%+15px)] w-[206px] h-[137px] object-contain"
        style={{ transform: 'rotate(-0.68deg)', mixBlendMode: 'multiply' }}
      /> */}

    </div>
  )
}

export default Mascot