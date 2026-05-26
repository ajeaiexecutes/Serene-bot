import { useState } from 'react'
import heart from '../assets/heart.png'

const EMOJIS = ['😢', '😔', '😐', '🙂', '😊', '😄', '😁']

const TAGS = [
  'Procrastination',
  'Social issues',
  'Relationship issues',
  'Anxiety',
  'Procrastination',
  'Anxiety',
  'Social issues',
]

function DayCheckinCard() {
  const [moodValue, setMoodValue] = useState(20)

  const getMoodEmoji = (val) => {
    const idx = Math.round((val / 100) * (EMOJIS.length - 1))
    return EMOJIS[idx]
  }

  return (
    <div
      className="relative w-full md:w-[394px] rounded-[18px] border border-[#E8E8E8] shadow-checkin p-4 mt-4 mb-8"
      style={{
        background: 'linear-gradient(96.12deg, #FFFFFF 0%, #FFFFFF 50%, #CEF6DC 100%)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <h2
          className="font-sf font-medium text-[18px] leading-[100%] tracking-[0%]"
          style={{
            background: 'linear-gradient(90deg, #555555 0%, #BBBBBB 136.01%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          How was Your Day, Today ?
        </h2>
        <img
          src={heart}
          alt="heart"
          className="absolute -top-[10px] -right-[6px] w-[76.9px] h-[101.03px] object-contain"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>

      {/* Mood Labels */}
      <div className="flex justify-between font-sf font-medium text-[12px] text-[#BBBBBB] mb-1 px-[2px]">
        <span>Sad</span>
        <span>Well</span>
        <span>Very Happy</span>
      </div>

      {/* Mood Slider Track */}
      <div className="relative w-full h-[26px] rounded-[56px] border border-dashed border-[#747474] bg-white flex items-center mb-4">

        {/* Yellow Fill */}
        <div
          className="absolute top-[1px] left-[1px] h-[22px] rounded-[124px] transition-all duration-150 z-10"
          style={{
            width: `calc(${moodValue}% - 8px)`,
            background: 'linear-gradient(90deg, #FFFFFF 0%, #DADA66 100%)',
          }}
        />

        {/* Emoji Thumb */}
        <div
          className="absolute z-10 transition-all duration-150 flex items-center justify-center"
          style={{
            left: `calc(${moodValue}% - 13px)`,
            top: '-1px',
            width: '26px',
            height: '26px',
            borderRadius: '71px',
            border: '0.6px solid #B7B7B7',
            background: '#FFFFFF',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              lineHeight: '100%',
              fontFamily: '-apple-system, SF UI Display, sans-serif',
            }}
          >
            {getMoodEmoji(moodValue)}
          </span>
        </div>

        {/* Dots */}
        <div className="absolute right-[18px] flex gap-[16px] items-center " style={{ top: '8px' }}>
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="relative flex items-center justify-center"
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '28px',
                background: '#585858',
              }}
            >
              {/* White inner dot */}
              <div
                className="absolute"
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  top: '2.5px',
                  left: '2.5px',
                }}
              />
            </div>
          ))}
        </div>

        {/* Range Input */}
        <input
          type="range"
          min="0"
          max="100"
          value={moodValue}
          onChange={(e) => setMoodValue(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 "
        />
      </div>

      {/* Reason Label */}
      <h2
          className="font-sf font-medium text-[18px] leading-[100%] tracking-[0%] mb-2 "
          style={{
            background: 'linear-gradient(90deg, #555555 0%, #BBBBBB 136.01%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          What was the Reason to be ?
        </h2>

      {/* Reason Input */}
      <div className="flex items-center border border-[#E5E5E5] rounded-full px-4 py-1 bg-white mb-3">
        <input
          type="text"
          placeholder="Ask Lovable to create a landing"
          className="flex-1 outline-none font-hv text-[12px] text-[#555] placeholder-[#BBBBBB] bg-transparent py-1"
        />
        <button
              className="w-[32px] h-[32px] rounded-[67px] flex items-center justify-center hover:shadow-send transition-shadow rotate-45 "
              style={{ background: 'linear-gradient(180deg, #00E58D 0%, #00C278 100%)' }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 2L11 13"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-[6px] opacity-[0.52]">
        {TAGS.map((tag, i) => (
          <button
            key={i}
            className="h-[34px] px-[10px] border border-brand-input-border rounded-[13px] font-hv text-[12px] text-[#5E5E5E] text-text-muted hover:bg-blue-50 transition-colors whitespace-nowrap bg-gradient-to-t from-[#E5F1FF] to-[#FFFFFF]"
          >
            {tag}
          </button>
        ))}
      </div>

    </div>
  )
}

export default DayCheckinCard