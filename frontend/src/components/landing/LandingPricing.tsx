import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { FadeIn } from './FadeIn'
import { PRICING_PLANS } from './landing-data'

export function LandingPricing() {
  return (
    <section id="pricing" className="landing-section">
      <div className="landing-container">
        <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <p className="landing-label mb-3">Pricing</p>
          <h2 className="landing-heading-lg mb-4">
            Simple, transparent pricing
          </h2>
          <p className="landing-body">
            Start free as a student. Upgrade when you need advanced analytics and support.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PRICING_PLANS.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.06} className="h-full">
              <article
                className={`landing-card h-full p-6 flex flex-col relative ${
                  plan.popular ? 'landing-pricing-popular' : ''
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2563EB] px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#111827] mb-1">{plan.name}</h3>
                  <p className="landing-body-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-[#111827]">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-[#6B7280]">{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-[#374151]">
                      <Check className="h-4 w-4 shrink-0 text-[#2563EB] mt-0.5" strokeWidth={2.5} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.name === 'Enterprise' ? '#contact' : '/signup'}
                  className={plan.popular ? 'landing-btn-primary w-full h-11' : 'landing-btn-secondary w-full h-11'}
                >
                  {plan.cta}
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
