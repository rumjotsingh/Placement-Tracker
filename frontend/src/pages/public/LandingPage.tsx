import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, BarChart3, Briefcase, Code2, FileText, Users,
  CheckCircle, Star, Zap, Shield, Globe, TrendingUp, 
  Award, Target, Play, Code,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  { icon: Briefcase, title: 'Placement Drives', desc: 'Browse and apply to campus recruitment drives from 100+ top companies with one click.', color: 'from-green-500 to-emerald-500' },
  { icon: FileText, title: 'Application Tracker', desc: 'Track every application from Applied to Selected with real-time status updates and notifications.', color: 'from-blue-500 to-cyan-500' },
  { icon: Code2, title: 'Coding Profiles', desc: 'Sync GitHub, LeetCode, and Codeforces stats automatically. Showcase your skills to recruiters.', color: 'from-purple-500 to-pink-500' },
  { icon: BarChart3, title: 'DSA Progress', desc: 'Visualize your problem-solving growth with beautiful weekly and monthly progress charts.', color: 'from-orange-500 to-amber-500' },
  { icon: Users, title: 'Interview Management', desc: 'Never miss an interview with calendar views, meeting links, and smart reminders.', color: 'from-red-500 to-rose-500' },
  { icon: FileText, title: 'Resume Vault', desc: 'Version-controlled resume management with cloud storage and one-click downloads.', color: 'from-indigo-500 to-violet-500' },
]

const stats = [
  { value: '10,000+', label: 'Students Placed', icon: Award },
  { value: '500+', label: 'Partner Companies', icon: Briefcase },
  { value: '98%', label: 'Placement Rate', icon: TrendingUp },
  { value: '75 LPA', label: 'Highest Package', icon: Target },
]

const testimonials = [
  { name: 'Priya Sharma', role: 'SDE at Google', avatar: 'PS', text: 'PlaceTrack Pro helped me track all my applications in one place. The coding profile sync feature is amazing!' },
  { name: 'Rahul Verma', role: 'SDE at Microsoft', avatar: 'RV', text: 'The DSA tracker kept me motivated throughout my preparation. Landed my dream job!' },
  { name: 'Ananya Patel', role: 'SDE at Amazon', avatar: 'AP', text: 'As a placement coordinator, this platform transformed how we manage campus recruitment.' },
]

const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Adobe', 'Uber']

const faqs = [
  { q: 'Who can use PlaceTrack Pro?', a: 'Students, placement coordinators, and administrators at engineering colleges. Each role has specific features tailored to their needs.' },
  { q: 'How do coding profiles sync?', a: 'Simply add your GitHub, LeetCode, and Codeforces usernames in your profile. Click sync to automatically fetch your latest stats, solved problems, and ratings.' },
  { q: 'Is my data secure?', a: 'Absolutely. We use JWT authentication, bcrypt password encryption, and role-based access control. Your data is stored securely on encrypted servers.' },
  { q: 'Can our college integrate this platform?', a: 'Yes! Contact us for institutional partnerships. We offer custom branding, analytics dashboards, and dedicated support.' },
]

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold">PlaceTrack<span className="text-accent">Pro</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</a>
            <a href="#testimonials" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Testimonials</a>
            <a href="#faq" className="text-sm text-text-secondary hover:text-text-primary transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" className="hidden sm:flex">Sign In</Button></Link>
            <Link to="/signup"><Button className="gap-2">Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 hero-gradient">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent mb-8">
                <Zap className="h-4 w-4" />
                <span>Trusted by 500+ colleges across India</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 text-balance">
                Track Placements.
                <br />
                <span className="gradient-accent">Manage Applications.</span>
                <br />
                Land Your Dream Job.
              </h1>
              <p className="text-text-secondary text-lg sm:text-xl mb-10 max-w-xl leading-relaxed">
                The unified platform for placement preparation, coding profile tracking, interview management, and campus recruitment analytics.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/signup">
                  <Button size="lg" className="h-12 px-8 text-base gap-2 shadow-lg shadow-accent/20">
                    Start Free <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base gap-2">
                  <Play className="h-4 w-4" /> Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Free for students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent" />
                  <span>Secure & private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-accent" />
                  <span>Works everywhere</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-transparent to-blue-500/20 rounded-3xl blur-3xl" />
              <div className="relative rounded-2xl border border-border bg-card p-6 accent-glow animate-float">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-white font-bold">R</div>
                    <div>
                      <p className="font-semibold">Rahul Kumar</p>
                      <p className="text-xs text-text-secondary">BTech CSE · 2026</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">Pro</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Applications', value: '24', trend: '+12%' },
                    { label: 'Offers', value: '5', trend: '+3' },
                    { label: 'Interviews', value: '8', trend: 'This week' },
                    { label: 'LC Solved', value: '342', trend: '+28' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-surface p-4 border border-border">
                      <p className="text-2xl font-bold text-accent">{stat.value}</p>
                      <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
                      <p className="text-xs text-accent/80 mt-0.5">{stat.trend}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-surface p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium">Weekly Progress</p>
                    <TrendingUp className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex items-end gap-2 h-24">
                    {[35, 52, 48, 70, 65, 85, 78].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div 
                          className="w-full rounded-t-md bg-gradient-to-t from-accent to-accent/60 transition-all duration-500" 
                          style={{ height: `${h}%` }} 
                        />
                        <span className="text-[10px] text-text-secondary">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="py-12 border-y border-border/50 bg-surface/20">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-text-secondary text-sm mb-8">Trusted by students placed at top companies</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
            {companies.map((company) => (
              <span key={company} className="text-text-secondary/60 font-semibold text-lg hover:text-text-primary transition-colors cursor-default">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10 mb-4">
                  <stat.icon className="h-6 w-6 text-accent" />
                </div>
                <p className="text-4xl font-bold gradient-accent">{stat.value}</p>
                <p className="text-text-secondary text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Everything you need for
              <span className="gradient-accent"> placements</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              One platform to replace spreadsheets, WhatsApp groups, and manual tracking. Built for the modern placement process.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full card-hover group cursor-default">
                  <CardContent className="p-6">
                    <div className={`rounded-xl bg-gradient-to-br ${f.color} p-3 w-fit mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <f.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">{f.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by <span className="gradient-accent">thousands</span> of students
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-text-secondary mb-6 leading-relaxed">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-white font-bold text-sm">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t.name}</p>
                        <p className="text-text-secondary text-xs">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold">Frequently asked questions</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="card-hover">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium mb-2">{faq.q}</p>
                        <p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to land your <span className="gradient-accent">dream job</span>?
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of students who are already tracking their placement journey with PlaceTrack Pro.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="h-12 px-8 text-base gap-2 shadow-lg shadow-accent/20">
                Get Started for Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-lg font-bold">PlaceTrack<span className="text-accent">Pro</span></span>
              </Link>
              <p className="text-text-secondary text-sm">
                The modern platform for campus recruitment and placement management.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><a href="#features" className="hover:text-accent transition-colors">Features</a></li>
                <li><a href="#testimonials" className="hover:text-accent transition-colors">Testimonials</a></li>
                <li><a href="#faq" className="hover:text-accent transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link to="/signup" className="hover:text-accent transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-accent transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-3">
                <a href="https://github.com/rumjotsingh/Placement-Tracker" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-lg bg-surface border border-border flex items-center justify-center hover:border-accent/50 transition-colors">
                  <Code className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-text-secondary text-sm">© 2026 PlaceTrack Pro. All rights reserved.</p>
            <p className="text-text-secondary text-sm">Built with ❤️ for campus recruitment</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
