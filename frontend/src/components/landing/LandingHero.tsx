import { Link } from 'react-router-dom'
import { ArrowRight, Play } from 'lucide-react'
import { FadeIn } from './FadeIn'
import { DashboardMockup } from './DashboardMockup'

export function LandingHero() {
  return (
    <section className="pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24">
      <div className="landing-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeIn>
            <div className="landing-badge mb-6">
              <span className="landing-badge-dot" aria-hidden />
              Trusted by 500+ placement teams across India
            </div>

            <h1 className="landing-heading-xl mb-6 text-balance">
              The modern platform for campus recruitment
            </h1>

            <p className="landing-body max-w-xl mb-8">
              PlaceTrack Pro helps students track applications, coordinators manage drives,
              and institutions run placement season with clarity — all in one workspace.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link to="/signup" className="landing-btn-primary h-12 px-6 text-[15px]">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#showcase" className="landing-btn-secondary h-12 px-6 text-[15px]">
                <Play className="h-4 w-4" />
                View product tour
              </a>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6B7280]">
              <span>✓ No credit card required</span>
              <span>✓ 14-day Pro trial</span>
              <span>✓ SOC 2 ready infrastructure</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-[#F8FAFC]" aria-hidden />
            <DashboardMockup />
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
