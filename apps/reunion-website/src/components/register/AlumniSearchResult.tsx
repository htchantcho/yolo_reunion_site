interface AlumniResult {
  id: string
  fullName: string
  formerName?: string | null
  yearAdmission: number
  yearGraduation?: number | null
  className?: string | null
  batch?: string | null
  house?: string | null
  country?: string | null
}

interface Props {
  record: AlumniResult
  onSelect: (id: string) => void
}

export function AlumniSearchResult({ record, onSelect }: Props) {
  return (
    <div
      className="border rounded-xl p-4 transition-all"
      style={{ borderColor: '#e5e7eb' }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = '#2D6A4F'
        el.style.background = '#f0f7f4'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = '#e5e7eb'
        el.style.background = ''
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-neutral-900">{record.fullName}</p>
          {record.formerName && (
            <p className="text-xs text-neutral-500">Also known as: {record.formerName}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
            {record.batch && <span className="text-xs text-neutral-600">Batch {record.batch}</span>}
            {record.className && <span className="text-xs text-neutral-600">{record.className}</span>}
            {record.house && <span className="text-xs text-neutral-600">House: {record.house}</span>}
            {record.yearGraduation && (
              <span className="text-xs text-neutral-600">Graduated: {record.yearGraduation}</span>
            )}
            {record.country && <span className="text-xs text-neutral-600">📍 {record.country}</span>}
          </div>
        </div>
        <button
          onClick={() => onSelect(record.id)}
          className="flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all"
          style={{ background: '#2D6A4F' }}
        >
          This is me
        </button>
      </div>
    </div>
  )
}
