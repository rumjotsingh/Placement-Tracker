import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeIn } from './FadeIn'

export function LandingCTA() {
  return (
    <section id="contact" className="landing-section">
      <div className="landing-container">
        <FadeIn>
          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-6 py-14 sm:px-12 sm:py-16 text-center">
            <h2 className="landing-heading-lg mb-4 max-w-2xl mx-auto">
              Ready to transform your placement season?
            </h2>
            <p className="landing-body max-w-xl mx-auto mb-8">
              Join thousands of students and placement teams who run recruitment
              with clarity, speed, and confidence.
            </p>
            <Link to="/signup" className="landing-btn-primary h-12 px-8 text-[15px]">
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
