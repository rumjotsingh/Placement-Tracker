import { FadeIn } from './FadeIn'
import { STATS } from './landing-data'

export function LandingStats() {
  return (
    <section className="landing-section border-y border-[#E5E7EB]">
      <div className="landing-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.05} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-[#6B7280]">{stat.label}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
