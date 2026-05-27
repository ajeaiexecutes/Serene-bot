import { useState } from 'react'

function ChatInput({ onSend, isLoading }) {
  const [inputText, setInputText] = useState('')

  const handleSend = () => {
    if (inputText.trim() && !isLoading) {
      onSend(inputText)
      setInputText('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-full max-w-[993px] px-4 md:px-8 lg:px-12 mb-4 z-20">

      {/* Card */}
      <div className="w-full h-auto md:h-[152px] bg-white border border-[#DDDDDD] rounded-[18px] shadow-card flex flex-col justify-between p-4 md:p-5">

        {/* Text Input */}
        <textarea
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="I have been feeling overwhelmed lately..."
          className="w-full bg-transparent outline-none resize-none font-sf text-[16px] text-gray-800 placeholder-[#B0B0B0] leading-snug"
          disabled={isLoading}
        />

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">

          {/* Understand My Emotion Button */}
          <button className="h-[34px] px-[10px] border border-[#E5E5E5] rounded-full font-hv text-[12px] text-[#5E5E5E] hover:bg-blue-50 transition-colors whitespace-nowrap bg-gradient-to-t from-[#E5F1FF] to-[#FFFFFF]">
            Understand My Emotion
          </button>

          {/* Right Actions */}
          <div className="flex items-center gap-2">

            {/* Waveform */}
            <button className="w-[34px] h-[34px] rounded-[67px] border border-[#F3F3F3] bg-white flex items-center justify-center gap-[2px] hover:border-gray-300 transition-colors">
              <div className="w-[1px] h-[6px]  bg-[#474747] rounded-full" />
              <div className="w-[1px] h-[10px] bg-[#474747] rounded-full" />
              <div className="w-[1px] h-[13px] bg-[#474747] rounded-full" />
              <div className="w-[1px] h-[10px] bg-[#474747] rounded-full" />
              <div className="w-[1px] h-[6px] bg-[#474747] rounded-full" />
            </button>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={isLoading}
              className={`w-[34px] h-[34px] rounded-[67px] flex items-center justify-center transition-shadow rotate-45 ${!isLoading ? 'hover:shadow-md cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
              style={{ background: 'linear-gradient(180deg, #00E58D 0%, #00C278 100%)' }}
            >
              {isLoading ? (
                <div className="w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full animate-spin -rotate-45" />
              ) : (
                <svg
                  width="14"
                  height="14"
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
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ChatInput