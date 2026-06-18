interface Props { time: string; title: string; description?: string|null; speaker?: string|null; location?: string|null; isLast?: boolean }
export function ScheduleItem({ time, title, description, speaker, location, isLast }: Props) {
  return (
    <div className="flex gap-4 sm:gap-6">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full text-white flex items-center justify-center flex-shrink-0 shadow" style={{background:'#8B1A1A'}}>
          <span className="w-3 h-3 rounded-full bg-white"/>
        </div>
        {!isLast && <div className="w-0.5 flex-1 my-2" style={{background:'rgba(139,26,26,0.2)'}}/>}
      </div>
      <div className="pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{color:'#8B1A1A'}}>{time}</p>
        <h3 className="font-playfair text-lg font-bold text-neutral-900 mb-1">{title}</h3>
        {description && <p className="text-neutral-600 text-sm mb-1">{description}</p>}
        {speaker && <p className="text-xs text-neutral-500">🎤 {speaker}</p>}
        {location && <p className="text-xs text-neutral-500">📍 {location}</p>}
      </div>
    </div>
  )
}
