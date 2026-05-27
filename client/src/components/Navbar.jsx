import toolkitIcon from '../assets/toolkit-icon.png'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'

function Navbar({ onToggleSidebar }) {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 md:px-[55px] md:pt-[60px] pointer-events-none">

      {/* Hamburger / User - LEFT */}
      <div className="flex gap-2 pointer-events-auto md:hidden">
        <button onClick={onToggleSidebar} className="w-[40px] h-[40px] rounded-full bg-white shadow-md flex flex-col items-center justify-center gap-[6px] cursor-pointer border border-[#F0F0F0]">
          <span className="block w-[16px] h-[2px] bg-[#666] rounded-full" />
          <span className="block w-[11px] h-[2px] bg-[#666] rounded-full self-start ml-[11px]" />
        </button>
      </div>

      {/* Comfort Toolkit - RIGHT */}
      <button
        onClick={() => toast.info('Comfort Toolkit coming soon!')}
        className="flex items-center px-2 border border-[#8DDBBD] rounded-full bg-white text-[#333] text-xs font-medium cursor-pointer hover:bg-green-50 transition-colors whitespace-nowrap pointer-events-auto"
      >
        <img src={toolkitIcon} alt="icon" className="w-[30px] h-[34px] object-contain" />
        <span className='text-gray-500'>Comfort Toolkit</span>
      </button>

    </nav>
  )
}

export default Navbar