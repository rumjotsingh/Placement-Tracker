import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { getAuthenticatedHomePath } from '@/lib/auth'
import { LandingNavbar } from '@/components/landing/LandingNavbar'
import { LandingHero } from '@/components/landing/LandingHero'
import { TrustedCompanies } from '@/components/landing/TrustedCompanies'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { ProductShowcase } from '@/components/landing/ProductShowcase'
import { LandingStats } from '@/components/landing/LandingStats'
import { LandingTestimonials } from '@/components/landing/LandingTestimonials'
import { LandingPricing } from '@/components/landing/LandingPricing'
import { LandingFAQ } from '@/components/landing/LandingFAQ'
import { LandingCTA } from '@/components/landing/LandingCTA'
import { LandingFooter } from '@/components/landing/LandingFooter'
import '@/components/landing/landing.css'

export default function LandingPage() {
  const { user, token } = useAuthStore()
  const home = getAuthenticatedHomePath(token, user)

  if (home) {
    return <Navigate to={home} replace />
  }

  return (
    <div className="landing min-h-screen bg-background text-text-primary">
      <LandingNavbar />
      <main>
        <LandingHero />
        <TrustedCompanies />
        <LandingFeatures />
        <ProductShowcase />
        <LandingStats />
        <LandingTestimonials />
        <LandingPricing />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
