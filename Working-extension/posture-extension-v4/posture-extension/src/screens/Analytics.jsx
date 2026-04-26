const todayData = [
  { h:'10a', pct:88, l:'good' }, { h:'11a', pct:92, l:'good' },
  { h:'12p', pct:85, l:'good' }, { h:'1p',  pct:80, l:'good' },
  { h:'2p',  pct:72, l:'warn' }, { h:'3p',  pct:55, l:'warn' },
  { h:'4p',  pct:38, l:'bad'  }, { h:'5p',  pct:42, l:'bad'  },
  { h:'6p',  pct:65, l:'warn' }, { h:'7p',  pct:78, l:'good' },
  { h:'8p',  pct:84, l:'good' }, { h:'9p',  pct:87, l:'good' },
]
const weekData = [
  { d:'Mon', score:75, l:'good' }, { d:'Tue', score:68, l:'warn' },
  { d:'Wed', score:82, l:'good' }, { d:'Thu', score:55, l:'warn' },
  { d:'Fri', score:90, l:'good' }, { d:'Sat', score:84, l:'good' },
  { d:'Sun', score:0,  l:'none' },
]
const barColor = { good:'bg-blue-600', warn:'bg-blue-200', bad:'bg-gray-200', none:'bg-gray-100' }
const scoreColor = { good:'text-blue-800', warn:'text-blue-500', none:'text-gray-300' }

export default function Analytics() {
  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full">
      <div>
        <h1 className="text-[15px] font-medium text-gray-900">Analytics</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">Postural fatigue patterns — last 7 days</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label:'Avg score', value:'81', badge:'+6 vs last week' },
          { label:'Worst hour', value:'2 PM', badge:'Every day' },
          { label:'Total alerts', value:'18', badge:'Down from 27' },
        ].map(m => (
          <div key={m.label} className="bg-blue-50 rounded-xl p-3">
            <div className="text-[10px] text-blue-600 mb-0.5">{m.label}</div>
            <div className="text-[18px] font-medium text-blue-800 leading-tight">{m.value}</div>
            <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">{m.badge}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-3">
        <div className="text-[12px] font-medium text-gray-900 mb-2">Today's fatigue curve</div>
        <div className="flex items-end gap-0.5 h-20">
          {todayData.map((d, i) => (
            <div key={i} className="flex-1 h-full flex flex-col justify-end">
              <div className={`w-full rounded-sm ${barColor[d.l]}`} style={{ height: `${d.pct}%` }} />
            </div>
          ))}
        </div>
        <div className="flex gap-0.5 mt-1">
          {todayData.map((d, i) => (
            <div key={i} className="flex-1 text-[9px] text-gray-400 text-center">{d.h}</div>
          ))}
        </div>
        <div className="mt-2 p-2 bg-blue-50 rounded-lg">
          <div className="text-[11px] font-medium text-blue-800">Pattern: 2–4 PM fatigue window</div>
          <div className="text-[10px] text-blue-600 mt-0.5">Try a 5-min walk break at 1:45 PM.</div>
        </div>
      </div>

      <div className="bg-white border border-blue-100 rounded-xl p-3">
        <div className="text-[12px] font-medium text-gray-900 mb-2">Weekly overview</div>
        <div className="grid grid-cols-7 gap-1">
          {weekData.map(d => (
            <div key={d.d} className="flex flex-col items-center gap-0.5">
              <div className="text-[9px] text-gray-400">{d.d}</div>
              <div className="h-10 w-full flex items-end">
                <div className={`w-full rounded-sm ${barColor[d.l]}`} style={{ height: d.score ? `${d.score}%` : '15%' }} />
              </div>
              <div className={`text-[10px] font-medium ${scoreColor[d.l]}`}>{d.score || '—'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { val:'Friday', sub:'Best day' },
          { val:'3.2h', sub:'Avg blue zone' },
          { val:'12 min', sub:'Avg slouch' },
        ].map(c => (
          <div key={c.sub} className="bg-blue-50 rounded-xl p-3">
            <div className="text-[15px] font-medium text-blue-800">{c.val}</div>
            <div className="text-[10px] text-blue-500 mt-0.5">{c.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
