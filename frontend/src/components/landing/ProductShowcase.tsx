import { Check } from 'lucide-react'
import { FadeIn } from './FadeIn'
import { DashboardMockup } from './DashboardMockup'
import { SHOWCASE_HIGHLIGHTS } from './landing-data'

export function ProductShowcase() {
  return (
    <section id="showcase" className="landing-section bg-[#F8FAFC]">
      <div className="landing-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeIn>
            <p className="landing-label mb-3">Product</p>
            <h2 className="landing-heading-lg mb-4">
              One dashboard for your entire placement workflow
            </h2>
            <p className="landing-body mb-8">
              From drive discovery to offer letters, PlaceTrack Pro gives every stakeholder
              a clear view of progress — without switching between tools.
            </p>

            <ul className="space-y-3">
              {SHOWCASE_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#374151]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.1}>
            <DashboardMockup compact />
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
