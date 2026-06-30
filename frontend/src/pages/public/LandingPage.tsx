import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, BarChart3, Briefcase, Code2, FileText, Users,
  CheckCircle, Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  { icon: Briefcase, title: 'Placement Drives', desc: 'Browse and apply to campus recruitment drives from top companies.' },
  { icon: FileText, title: 'Application Tracker', desc: 'Track every application from Applied to Selected with real-time status updates.' },
  { icon: Code2, title: 'Coding Profiles', desc: 'Sync GitHub, LeetCode, and Codeforces stats automatically.' },
  { icon: BarChart3, title: 'DSA Progress', desc: 'Visualize your problem-solving growth with weekly and monthly charts.' },
  { icon: Users, title: 'Interview Management', desc: 'Never miss an interview with calendar views and smart reminders.' },
  { icon: FileText, title: 'Resume Vault', desc: 'Version-controlled resume management with one-click downloads.' },
]

const stats = [
  { value: '500+', label: 'Students Placed' },
  { value: '120+', label: 'Partner Companies' },
  { value: '95%', label: 'Placement Rate' },
  { value: '45 LPA', label: 'Highest Package' },
]

const faqs = [
  { q: 'Who can use PlaceTrack Pro?', a: 'Students, placement coordinators, and administrators at engineering colleges.' },
  { q: 'How do coding profiles sync?', a: 'Connect your GitHub, LeetCode, and Codeforces usernames and sync with one click.' },
  { q: 'Is my data secure?', a: 'Yes. JWT authentication, encrypted passwords, and role-based access control protect your data.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-accent">PlaceTrack Pro</span>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost">Sign In</Button></Link>
            <Link to="/signup"><Button>Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs text-accent mb-6">
              <Star className="h-3 w-3" /> Campus Recruitment Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Track Placements.<br />
              <span className="text-accent">Manage Applications.</span><br />
              Land Your Dream Job.
            </h1>
            <p className="text-text-secondary text-lg mb-8 max-w-lg">
              A unified platform for placement preparation, coding profile tracking, interview management, and campus recruitment.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/signup"><Button size="lg">Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
              <Button size="lg" variant="outline">Watch Demo</Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl border border-border bg-card p-4 accent-glow">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {['Applications', 'Offers', 'Interviews', 'Active Drives'].map((label, i) => (
                  <div key={label} className="rounded-lg bg-surface p-3 border border-border">
                    <p className="text-xs text-text-secondary">{label}</p>
                    <p className="text-xl font-bold mt-1">{[12, 2, 3, 8][i]}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-surface p-4 border border-border h-32 flex items-end gap-1">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 bg-accent/60 rounded-t" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-y border-border bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-accent">{s.value}</p>
              <p className="text-text-secondary text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Everything you need for placements</h2>
          <p className="text-text-secondary">One platform to replace spreadsheets, WhatsApp groups, and manual tracking.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
              <Card className="h-full hover:border-accent/30 transition-colors">
                <CardContent className="p-6">
                  <div className="rounded-lg bg-accent/10 p-2.5 w-fit mb-4">
                    <f.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-text-secondary text-sm">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.q}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">{faq.q}</p>
                    <p className="text-text-secondary text-sm">{faq.a}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 px-4 text-center text-text-secondary text-sm">
        <p className="font-semibold text-accent mb-1">PlaceTrack Pro</p>
        <p>© 2026 PlaceTrack Pro. Built for campus recruitment excellence.</p>
      </footer>
    </div>
  )
}
