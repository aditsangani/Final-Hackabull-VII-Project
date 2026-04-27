const streakBlocks = ['done','done','miss','done','done','active','upcoming','upcoming']
const weekData = [
  { d:'Mon', score:75 }, { d:'Tue', score:68 }, { d:'Wed', score:82 },
  { d:'Thu', score:55 }, { d:'Fri', score:90 }, { d:'Sat', score:84 }, { d:'Sun', score:0 },
]
const achievements = [
  { name:'First calibration', sub:'Set baseline', unlocked:true },
  { name:'5-block day', sub:'Earned today', unlocked:true },
  { name:'10-block day', sub:'5 away', unlocked:false },
  { name:'7-day streak', sub:'Keep going', unlocked:false },
]
const leaderboard = [
  { rank:1, initials:'AS', name:'You', score:47, you:true },
  { rank:2, initials:'MK', name:'Marcus K.', score:39, you:false },
  { rank:3, initials:'JL', name:'Jasmine L.', score:31, you:false },
]

export default function Streaks() {
  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full">
      <div>
        <h1 className="text-[15px] font-medium text-gray-900">Streaks</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">50+ min blue zone per hour earns a block</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label:'Current streak', value:'5', badge:'Hours today' },
          { label:'Best streak', value:'12', badge:'Last Wednesday' },
          { label:'Total blocks', value:'47', badge:'This week' },
        ].map(m => (
          <div key={m.label} className="bg-blue-50 rounded-xl p-3">
            <div className="text-[10px] text-blue-600 mb-0.5">{m.label}</div>
            <div className="text-[18px] font-medium text-blue-800">{m.value}</div>
            <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">{m.badge}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-3">
        <div className="text-[12px] font-medium text-gray-900 mb-2">Today's spine streak</div>
        <div className="grid grid-cols-8 gap-1">
          {streakBlocks.map((s, i) => (
            <div key={i} className={`h-7 rounded-md flex items-center justify-center text-[10px] font-medium
              ${s === 'done' ? 'bg-blue-100 text-blue-800' : ''}
              ${s === 'active' ? 'bg-blue-600 text-white' : ''}
              ${s === 'miss' ? 'bg-gray-100 text-gray-400' : ''}
              ${s === 'upcoming' ? 'border border-dashed border-blue-200 text-gray-300' : ''}
            `}>
              {s === 'done' ? '✓' : s === 'miss' ? '–' : i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-3">
        <div className="text-[12px] font-medium text-gray-900 mb-2">Achievements</div>
        <div className="grid grid-cols-4 gap-1.5">
          {achievements.map(a => (
            <div key={a.name} className={`bg-page rounded-lg p-2 flex flex-col items-center gap-1 text-center ${!a.unlocked ? 'opacity-40' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${a.unlocked ? 'bg-blue-50' : 'bg-gray-100'}`}>
                {a.unlocked
                  ? <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M9 2l1.8 3.6L15 6.5l-3 2.9.7 4.1L9 11.4l-3.7 2.1.7-4.1L3 6.5l4.2-.9L9 2z" stroke="#185FA5" strokeWidth="1.2" strokeLinejoin="round" fill="#E6F1FB"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><rect x="4" y="8" width="10" height="7" rx="2" stroke="#888780" strokeWidth="1.2"/><path d="M6 8V6a3 3 0 116 0v2" stroke="#888780" strokeWidth="1.2"/></svg>
                }
              </div>
              <div className="text-[10px] font-medium text-gray-900 leading-tight">{a.name}</div>
              <div className="text-[9px] text-gray-400">{a.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-3">
        <div className="text-[12px] font-medium text-gray-900 mb-2">Leaderboard</div>
        <div className="flex flex-col gap-1">
          {leaderboard.map(p => (
            <div key={p.name} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${p.you ? 'bg-blue-50' : ''}`}>
              <span className={`text-[11px] font-medium w-4 ${p.you ? 'text-blue-600' : 'text-gray-400'}`}>{p.rank}</span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium ${p.you ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{p.initials}</div>
              <span className={`flex-1 text-[11px] ${p.you ? 'font-medium text-gray-900' : 'text-gray-700'}`}>{p.name}</span>
              <span className={`text-[11px] font-medium ${p.you ? 'text-blue-600' : 'text-gray-400'}`}>{p.score} blocks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
