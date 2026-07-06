import { cn } from '@/lib/utils'

interface DashboardMockupProps {
  className?: string
  compact?: boolean
}

export function DashboardMockup({ className, compact }: DashboardMockupProps) {
  return (
    <div className={cn('landing-mockup', className)}>
      <div className="landing-mockup-bar">
        <span className="landing-mockup-dot" />
        <span className="landing-mockup-dot" />
        <span className="landing-mockup-dot" />
        <span className="ml-3 text-xs text-[#6B7280] font-medium">placetrack.pro/student</span>
      </div>

      <div className={cn('p-4 sm:p-5', compact ? 'space-y-3' : 'space-y-4')}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#111827]">Good morning, Rahul</p>
            <p className="text-xs text-[#6B7280]">BTech CSE · Placement Season 2026</p>
          </div>
          <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-medium text-[#2563EB]">
            5 active applications
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Applications', value: '24' },
            { label: 'Interviews', value: '8' },
            { label: 'Offers', value: '3' },
            { label: 'LC Solved', value: '342' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3"
            >
              <p className="text-lg font-bold text-[#111827]">{stat.value}</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-5 gap-3">
          <div className="sm:col-span-3 rounded-xl border border-[#E5E7EB] p-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#111827]">Weekly activity</p>
              <span className="text-[10px] text-[#6B7280]">Last 7 days</span>
            </div>
            <div className="flex items-end gap-1.5 h-20">
              {[32, 48, 40, 64, 58, 72, 68].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-md bg-[#2563EB]/80"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[9px] text-[#9CA3AF]">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 rounded-xl border border-[#E5E7EB] p-3 space-y-2">
            <p className="text-xs font-semibold text-[#111827]">Upcoming</p>
            {[
              { company: 'Stripe', round: 'Technical · Tomorrow' },
              { company: 'Razorpay', round: 'HR · Friday' },
            ].map((item) => (
              <div
                key={item.company}
                className="rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-2"
              >
                <p className="text-xs font-medium text-[#111827]">{item.company}</p>
                <p className="text-[10px] text-[#6B7280]">{item.round}</p>
              </div>
            ))}
          </div>
        </div>

        {!compact && (
          <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="grid grid-cols-4 gap-px bg-[#E5E7EB] text-[10px] font-medium text-[#6B7280]">
              {['Company', 'Role', 'Status', 'Updated'].map((h) => (
                <div key={h} className="bg-[#F8FAFC] px-3 py-2">
                  {h}
                </div>
              ))}
            </div>
            {[
              ['Google', 'SDE Intern', 'Interview', '2h ago'],
              ['Microsoft', 'SWE', 'Shortlisted', '1d ago'],
              ['Amazon', 'SDE-1', 'Applied', '3d ago'],
            ].map((row) => (
              <div
                key={row[0]}
                className="grid grid-cols-4 gap-px bg-[#E5E7EB] text-[11px]"
              >
                {row.map((cell, i) => (
                  <div key={i} className="bg-white px-3 py-2.5 text-[#374151]">
                    {i === 2 ? (
                      <span className="inline-flex rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-medium text-[#2563EB]">
                        {cell}
                      </span>
                    ) : (
                      cell
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
