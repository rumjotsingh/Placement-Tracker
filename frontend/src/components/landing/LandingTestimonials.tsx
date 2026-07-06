import { Star } from 'lucide-react'
import { FadeIn } from './FadeIn'
import { TESTIMONIALS } from './landing-data'

export function LandingTestimonials() {
  return (
    <section id="testimonials" className="landing-section bg-[#F8FAFC]">
      <div className="landing-container">
        <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <p className="landing-label mb-3">Testimonials</p>
          <h2 className="landing-heading-lg mb-4">
            Loved by students and placement teams
          </h2>
          <p className="landing-body">
            See why thousands rely on PlaceTrack Pro during placement season.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, i) => (
            <FadeIn key={item.name} delay={i * 0.06}>
              <article className="landing-card h-full p-6 flex flex-col">
                <div className="flex items-center gap-0.5 mb-4" aria-label={`${item.rating} out of 5 stars`}>
                  {Array.from({ length: item.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]" />
                  ))}
                </div>

                <blockquote className="landing-body-sm flex-1 mb-6">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF] text-sm font-semibold text-[#2563EB]">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{item.name}</p>
                    <p className="text-xs text-[#6B7280]">
                      {item.role} · {item.company}
                    </p>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
