import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Mascot from './components/Mascot'
import ChatInput from './components/ChatInput'
import DayCheckinCard from './components/DayCheckinCard'
import ChatMessages from './components/ChatMessages'
import { useAuth } from './context/AuthContext'
import AuthModal from './components/AuthModal'
import { Toaster } from 'sonner'

function App() {
  const { user, token, isLoading: authLoading } = useAuth()
  const [messages, setMessages] = useState([])
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('sereneSessionId') || null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [refreshSidebar, setRefreshSidebar] = useState(0)

  useEffect(() => {
    if (sessionId && user) {
      const fetchHistory = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
          const res = await fetch(`${API_URL}/api/chat/history/${sessionId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
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
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: text, sessionId, userId: user.id })
      })

      if (!res.ok) throw new Error('Network response was not ok')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      
      // Turn off loading and add an empty assistant message to append to
      setIsLoading(false)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString()
      }])

      let streamSessionId = sessionId
      let isDone = false
      let buffer = ''

      while (!isDone) {
        const { value, done: readerDone } = await reader.read()
        isDone = readerDone
        if (value) {
          buffer += decoder.decode(value, { stream: true })
          const parts = buffer.split('\n\n')
          buffer = parts.pop() || '' // Keep the last incomplete part in the buffer
          
          for (const part of parts) {
            const lines = part.split('\n')
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6)
                try {
                  const data = JSON.parse(dataStr)
                  
                  if (data.type === 'session') {
                    if (data.sessionId !== streamSessionId) {
                      streamSessionId = data.sessionId
                      setSessionId(data.sessionId)
                      localStorage.setItem('sereneSessionId', data.sessionId)
                      setRefreshSidebar(prev => prev + 1)
                    }
                  } else if (data.type === 'chunk') {
                    setMessages(prev => {
                      const newMessages = [...prev]
                      const lastIndex = newMessages.length - 1
                      newMessages[lastIndex] = {
                        ...newMessages[lastIndex],
                        content: newMessages[lastIndex].content + data.text
                      }
                      return newMessages
                    })
                  } else if (data.type === 'done') {
                    // Stream finished
                  }
                } catch (e) {
                  console.error('Error parsing stream chunk', e)
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setIsLoading(false)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I am sorry, something went wrong and I could not respond. Please try again.',
        timestamp: new Date().toISOString()
      }])
    }
  }

  const handleSelectSession = (id) => {
    setSessionId(id)
    if (id) {
      localStorage.setItem('sereneSessionId', id)
    } else {
      localStorage.removeItem('sereneSessionId')
      setMessages([])
    }
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-white flex">
      {!authLoading && !user && <AuthModal />}

      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onSelectSession={handleSelectSession}
        refreshTrigger={refreshSidebar}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 relative flex flex-col min-w-0 transition-all duration-300 md:ml-[260px] h-full">
        {/* Background Blobs */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[1728px] h-[1276px] top-[536px] left-1/2 -translate-x-1/2 bg-[#17CA8C] opacity-35 rounded-[3505px] blur-[80px]" />
          <div className="absolute w-[1587px] h-[1037px] top-[775px] left-[50px] bg-[#63B660] opacity-25 rounded-[2846px] blur-[60px]" />
          <div className="absolute w-[1587px] h-[1037px] top-[919px] left-[69px] bg-[#06D386] opacity-30 rounded-[2846px] blur-[60px]" />
        </div>

        {/* Navbar */}
        <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />

        {/* Scrollable Chat Area */}
        <div className="flex-1 relative z-10 flex flex-col items-center pt-[80px] overflow-y-auto pb-4 w-full">
          <Mascot />
          <ChatMessages messages={messages} isLoading={isLoading} />
        </div>

        {/* Fixed Input Area */}
        <div className="relative z-20 flex flex-col items-center w-full pb-6 pt-2 shrink-0 bg-transparent">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
          {/* <div className="w-full max-w-[993px] flex justify-center px-4 md:px-0">
            <DayCheckinCard />
          </div> */}
        </div>
      </div>
      {/* Toast Notifications */}
      <Toaster position="top-center" expand={false} richColors />

    </div>
  )
}

export default App