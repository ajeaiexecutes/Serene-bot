import { useEffect, useRef } from 'react'

function ChatMessages({ messages, isLoading }) {
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    if (!messages || messages.length === 0) return null

    return (
        <div className="w-full max-w-[993px] px-4 md:px-8 lg:px-12 mb-6 flex flex-col gap-4 z-20">
            {messages.map((msg, index) => {
                const isUser = msg.role === 'user'

                return (
                    <div key={index} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[80%] md:max-w-[70%] p-4 rounded-[18px] border border-[#E8E8E8] shadow-sm font-sf text-[16px] leading-[1.5] ${isUser
                                    ? 'bg-white rounded-tr-sm text-gray-800'
                                    : 'bg-[#F0FDF6] rounded-tl-sm text-gray-800'
                                }`}
                        >
                            {/* Parse multi-line messages */}
                            {msg.content.split('\n').map((line, i) => (
                                <span key={i}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </div>
                    </div>
                )
            })}

            {isLoading && (
                <div className="flex w-full justify-start">
                    <div className="p-4 rounded-[18px] bg-[#F0FDF6] border border-[#E8E8E8] shadow-sm rounded-tl-sm flex items-center gap-1.5 h-[56px]">
                        <div className="w-2 h-2 rounded-full bg-[#00C278] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-[#00C278] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-[#00C278] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    )
}

export default ChatMessages
