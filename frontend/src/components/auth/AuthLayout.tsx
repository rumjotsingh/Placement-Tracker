import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  sideTitle: string
  sideDescription: string
  sideFooter?: ReactNode
}

function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'h-8 w-8 rounded-[10px] text-sm' : 'h-10 w-10 rounded-xl text-lg'
  const text = size === 'sm' ? 'text-xl' : 'text-2xl'

  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className={`${box} bg-accent flex items-center justify-center text-white font-bold`}>P</span>
      <span className={`${text} font-bold text-text-primary`}>
        PlaceTrack<span className="text-accent">Pro</span>
      </span>
    </Link>
  )
}

export function AuthLayout({
  children,
  title,
  subtitle,
  sideTitle,
  sideDescription,
  sideFooter,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-surface border-r border-border">
        <div className="flex flex-col justify-between p-12 w-full">
          <Logo />

          <div className="space-y-5 max-w-md">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-text-primary">
              {sideTitle}
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">{sideDescription}</p>
            {sideFooter}
          </div>

          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} PlaceTrack Pro. All rights reserved.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo size="sm" />
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary mb-2">{title}</h2>
            <p className="text-text-secondary">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
