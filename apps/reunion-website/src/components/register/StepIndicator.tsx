const steps = ['Verify Identity', 'Your Details', 'Confirm']

export function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => {
        const step = i + 1
        const done = step < current
        const active = step === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  background: done || active ? '#2D6A4F' : '#e5e7eb',
                  color: done || active ? '#fff' : '#6b7280',
                }}
              >
                {done ? '✓' : step}
              </div>
              <span
                className="text-xs mt-1 font-medium"
                style={{ color: active ? '#2D6A4F' : '#6b7280' }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-16 sm:w-24 h-0.5 mb-5 mx-1"
                style={{ background: done ? '#2D6A4F' : '#e5e7eb' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
