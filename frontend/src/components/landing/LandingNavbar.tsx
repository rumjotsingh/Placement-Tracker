import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import { NAV_LINKS } from './landing-data'

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'border-b border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
          : 'bg-white'
      }`}
    >
      <div className="landing-container h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="landing-logo-mark">P</span>
          <span className="text-[15px] font-bold tracking-tight text-[#111827]">
            PlaceTrack<span className="text-[#2563EB]">Pro</span>
          </span>
        </Link>

        {/* <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="landing-nav-link">
              {link.label}
            </a>
          ))}
        </nav> */}

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/login" className="landing-btn-ghost">
            Login
          </Link>
          <Link to="/signup" className="landing-btn-primary">
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#111827]"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E5E7EB] bg-white">
          <nav className="landing-container py-4 flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#F8FAFC]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex flex-col gap-2">
              <Link to="/login" className="landing-btn-secondary w-full" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="landing-btn-primary w-full" onClick={() => setMobileOpen(false)}>
                Get started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
