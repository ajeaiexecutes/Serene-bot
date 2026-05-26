import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Mascot from './components/Mascot'
import ChatInput from './components/ChatInput'
import DayCheckinCard from './components/DayCheckinCard'
import ChatMessages from './components/ChatMessages'
import { useAuth } from './context/AuthContext'
import AuthModal from './components/AuthModal'
import { Toaster } from 'sonner'

function App() {
  const { user, isLoading: authLoading } = useAuth()
  const [messages, setMessages] = useState([])
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('sereneSessionId') || null
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (sessionId && user) {
      const fetchHistory = async () => {
        try {
          const res = await fetch(`http://localhost:4000/api/chat/history/${sessionId}`)
          if (res.ok) {
            const history = await res.json()
            setMessages(history)
          }
        } catch (error) {
          console.error('Error fetching history:', error)
        }
      }
      fetchHistory()
    }
  }, [sessionId, user])

  const handleSend = async (text) => {
    if (!text.trim() || !user) return

    const newMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, newMsg])
    setIsLoading(true)

    try {
      const res = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.sessionId && data.sessionId !== sessionId) {
          setSessionId(data.sessionId)
          localStorage.setItem('sereneSessionId', data.sessionId)
        }

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toISOString()
        }])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I am sorry, something went wrong and I could not respond. Please try again.',
        timestamp: new Date().toISOString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {!authLoading && !user && <AuthModal />}

      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[1728px] h-[1276px] top-[536px] left-1/2 -translate-x-1/2 bg-[#17CA8C] opacity-35 rounded-[3505px] blur-[80px]" />
        <div className="absolute w-[1587px] h-[1037px] top-[775px] left-[50px] bg-[#63B660] opacity-25 rounded-[2846px] blur-[60px]" />
        <div className="absolute w-[1587px] h-[1037px] top-[919px] left-[69px] bg-[#06D386] opacity-30 rounded-[2846px] blur-[60px]" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Page content */}
      <div className="relative z-10 flex flex-col items-center pt-[80px] h-screen overflow-y-auto pb-8">
        <Mascot />
        <ChatMessages messages={messages} isLoading={isLoading} />
        <ChatInput onSend={handleSend} isLoading={isLoading} />
        {/* <div className="w-full max-w-[993px] flex justify-center px-4 md:px-0">
          <DayCheckinCard />
        </div> */}
      </div>
      {/* Toast Notifications */}
      <Toaster position="top-center" expand={false} richColors />

    </div>
  )
}

export default App