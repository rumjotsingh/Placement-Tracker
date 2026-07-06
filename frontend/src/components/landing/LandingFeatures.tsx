import { FadeIn } from './FadeIn'
import { FEATURES } from './landing-data'

export function LandingFeatures() {
  return (
    <section id="features" className="landing-section">
      <div className="landing-container">
        <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <p className="landing-label mb-3">Features</p>
          <h2 className="landing-heading-lg mb-4">
            Everything you need for placement season
          </h2>
          <p className="landing-body">
            Replace spreadsheets and scattered tools with one platform built for students,
            coordinators, and admins.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.05}>
              <article className="landing-card h-full p-6">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#2563EB]">
                  <feature.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="landing-heading-md mb-2">{feature.title}</h3>
                <p className="landing-body-sm">{feature.description}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
