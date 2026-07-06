import { FadeIn } from './FadeIn'
import { COMPANIES } from './landing-data'

export function TrustedCompanies() {
  return (
    <section className="border-y border-[#E5E7EB] bg-[#F8FAFC] py-12">
      <div className="landing-container">
        <FadeIn>
          <p className="text-center text-sm font-medium text-[#6B7280] mb-8">
            Trusted by students and teams at leading companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14">
            {COMPANIES.map((company) => (
              <span
                key={company}
                className="text-base sm:text-lg font-semibold text-[#9CA3AF] select-none"
                aria-hidden
              >
                {company}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
