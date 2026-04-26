const navItems = [
  {
    id: 'dashboard', label: 'Dashboard',
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/></svg>,
  },
  {
    id: 'analytics', label: 'Analytics',
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 12l3-4 3 2 3-5 3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    id: 'calibrate', label: 'Calibrate',
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 2a3 3 0 100 6 3 3 0 000-6zM3 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  },
  {
    id: 'streaks', label: 'Streaks',
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M9 2L7 7h5L6 14l2-5H3L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  },
]

export default function Sidebar({ active, onNav }) {
  return (
    <aside className="w-[160px] bg-white border-r border-blue-100 flex flex-col py-4 px-2.5 shrink-0">
      <div className="flex items-center gap-2 px-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-blue-600" />
        <span className="text-[14px] font-medium text-gray-900 tracking-tight">PostureAI</span>
      </div>
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] transition-all duration-150 text-left w-full
              ${active === item.id
                ? 'bg-blue-50 text-blue-800 font-medium'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-800'
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <button
        onClick={() => onNav('settings')}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] transition-all w-full
          ${active === 'settings'
            ? 'bg-blue-50 text-blue-800 font-medium'
            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-800'
          }`}
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M11.9 3.4l-.7.7M4.1 11.9l-.7.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Settings
      </button>
    </aside>
  )
}
