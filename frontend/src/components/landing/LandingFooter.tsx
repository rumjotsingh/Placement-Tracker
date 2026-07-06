import { Link } from 'react-router-dom'
import { GitFork, Link2, Share2 } from 'lucide-react'

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Product tour', href: '#showcase' },
    { label: 'Changelog', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Help Center', href: '#faq' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#contact' },
    { label: 'Privacy', href: '#' },
  ],
} as const

export function LandingFooter() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white pt-16 pb-8">
      <div className="landing-container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <span className="landing-logo-mark">P</span>
              <span className="text-[15px] font-bold text-[#111827]">
                PlaceTrack<span className="text-[#2563EB]">Pro</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#6B7280] max-w-xs">
              The modern SaaS platform for campus recruitment, application tracking,
              and placement analytics.
            </p>

            <div className="flex items-center gap-2 mt-6">
              {[
                { icon: Share2, label: 'Twitter', href: '#' },
                { icon: Link2, label: 'LinkedIn', href: '#' },
                { icon: GitFork, label: 'GitHub', href: 'https://github.com/rumjotsingh/Placement-Tracker' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#D1D5DB] transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-[#111827] mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-[#6B7280]">
            © {new Date().getFullYear()} PlaceTrack Pro. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-[#6B7280]">
            <a href="#" className="hover:text-[#111827] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#111827] transition-colors">Privacy</a>
            <Link to="/login" className="hover:text-[#111827] transition-colors">Login</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
