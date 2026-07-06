import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FadeIn } from './FadeIn'
import { FAQS } from './landing-data'
import { cn } from '@/lib/utils'

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="landing-section bg-[#F8FAFC]">
      <div className="landing-container max-w-3xl">
        <FadeIn className="text-center mb-12">
          <p className="landing-label mb-3">FAQ</p>
          <h2 className="landing-heading-lg">Frequently asked questions</h2>
        </FadeIn>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <FadeIn key={faq.question} delay={i * 0.04}>
                <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-[15px] font-semibold text-[#111827]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 shrink-0 text-[#6B7280] transition-transform duration-200',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-200 ease-out',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm leading-relaxed text-[#6B7280]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
