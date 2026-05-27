import { useEffect, useState, useRef } from 'react'
import { Plus, MessageSquare, LogOut, X, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ isOpen, onClose, onSelectSession, refreshTrigger }) {
    const { user, token, logout } = useAuth()
    const [sessions, setSessions] = useState([])
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const userMenuRef = useRef(null)

    useEffect(() => {
        if (user && token) {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
            fetch(`${API_URL}/api/chat/sessions/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => setSessions(data))
                .catch(err => console.error(err))
        }
    }, [user, token, refreshTrigger])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleNewChat = () => {
        onSelectSession(null)
        if (window.innerWidth < 768) onClose()
    }

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full bg-[#f9f9f9] border-r border-[#E5E5E5] w-[260px] z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                
                {/* Header with Logo */}
                <div className="p-4 flex items-center justify-between border-b border-[#E5E5E5]/50">
                    <div className="flex items-center gap-2 px-2">
                        <div className="w-8 h-8 rounded-full bg-[#8DDBBD] flex items-center justify-center text-[#1B4B36]">
                            <Sparkles size={16} strokeWidth={2.5} />
                        </div>
                        <span className="font-sf font-semibold text-[18px] text-[#333] tracking-tight">Serene</span>
                    </div>
                    <button onClick={onClose} className="md:hidden p-2 text-gray-500 hover:bg-gray-200 rounded-full cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="p-4 pb-2">
                    <button 
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-[#E5E5E5] rounded-full px-4 py-2.5 text-[14px] text-[#333] hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                    >
                        <Plus size={18} className="text-[#666]" />
                        <span className="font-medium">New chat</span>
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                    <div className="text-[12px] font-medium text-gray-400 px-3 py-2">History</div>
                    {sessions.length === 0 && (
                        <div className="text-[13px] text-gray-400 px-3 py-2 italic">No previous chats</div>
                    )}
                    {sessions.map(session => (
                        <button 
                            key={session._id}
                            onClick={() => {
                                onSelectSession(session._id)
                                if (window.innerWidth < 768) onClose()
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#EAEAEA] text-left transition-colors cursor-pointer group"
                        >
                            <MessageSquare size={16} className="text-[#888]" />
                            <span className="text-[14px] text-[#444] truncate">{session.title}</span>
                        </button>
                    ))}
                </div>

                {/* Bottom User Area */}
                {user && (
                    <div className="p-3 border-t border-[#E5E5E5]" ref={userMenuRef}>
                        <div className="relative">
                            <button 
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#EAEAEA] transition-colors cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#8DDBBD] flex items-center justify-center text-[#1B4B36] font-semibold text-sm">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[14px] text-[#333] font-medium truncate">{user.name}</span>
                            </button>

                            {/* Dropdown/Logout on click */}
                            <div className={`absolute bottom-full left-0 w-full mb-2 transition-all ${isUserMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-1'}`}>
                                <button 
                                    onClick={logout}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E5E5] rounded-lg shadow-lg text-[14px] text-red-500 hover:bg-red-50 cursor-pointer"
                                >
                                    <LogOut size={16} />
                                    <span className="font-medium">Log out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
