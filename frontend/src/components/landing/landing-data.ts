import {
  BarChart3,
  Briefcase,
  Calendar,
  Code2,
  FileText,
  Shield,
  type LucideIcon,
} from 'lucide-react'

export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
] as const

export const COMPANIES = [
  'Google',
  'Microsoft',
  'Amazon',
  'Stripe',
  'Meta',
  'Adobe',
  'Uber',
  'Notion',
] as const

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

export const FEATURES: Feature[] = [
  {
    icon: Briefcase,
    title: 'Placement Drives',
    description: 'Browse open campus drives, check eligibility instantly, and apply in one click.',
  },
  {
    icon: FileText,
    title: 'Application Tracker',
    description: 'Track every stage from applied to selected with a clear timeline and status updates.',
  },
  {
    icon: Code2,
    title: 'Coding Profiles',
    description: 'Sync GitHub, LeetCode, and Codeforces stats to showcase your skills to recruiters.',
  },
  {
    icon: BarChart3,
    title: 'DSA Analytics',
    description: 'Visualize weekly progress, topic coverage, and preparation trends over time.',
  },
  {
    icon: Calendar,
    title: 'Interview Hub',
    description: 'Schedule interviews, access meeting links, and never miss a recruitment round.',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Secure portals for students, coordinators, and admins with granular permissions.',
  },
]

export const STATS = [
  { value: '10K+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '500+', label: 'Teams' },
  { value: '4.9/5', label: 'Rating' },
] as const

export const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    company: 'Google',
    avatar: 'PS',
    rating: 5,
    quote:
      'PlaceTrack Pro replaced three spreadsheets and a WhatsApp group. I always knew where every application stood.',
  },
  {
    name: 'Rahul Verma',
    role: 'Placement Lead',
    company: 'IIT Delhi',
    avatar: 'RV',
    rating: 5,
    quote:
      'Our coordinators finally have one source of truth for drives, applicants, and interview scheduling.',
  },
  {
    name: 'Ananya Patel',
    role: 'Final Year Student',
    company: 'NIT Trichy',
    avatar: 'AP',
    rating: 5,
    quote:
      'The coding profile sync and DSA tracker kept me consistent. I landed offers from two product companies.',
  },
] as const

export interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  popular?: boolean
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'For individual students getting started with placement tracking.',
    features: [
      'Application tracker',
      'Drive browsing & apply',
      'Basic coding profile sync',
      'Resume vault (1 file)',
      'Email notifications',
    ],
    cta: 'Get started free',
  },
  {
    name: 'Pro',
    price: '₹499',
    period: '/month',
    description: 'For serious candidates who want full visibility and analytics.',
    features: [
      'Everything in Starter',
      'DSA progress analytics',
      'Multi-platform coding sync',
      'Interview calendar',
      'Priority support',
      'Unlimited resumes',
    ],
    cta: 'Start Pro trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For colleges and institutions managing campus recruitment at scale.',
    features: [
      'Everything in Pro',
      'Coordinator & admin portals',
      'Custom branding',
      'Bulk student onboarding',
      'Dedicated account manager',
      'SLA & compliance',
    ],
    cta: 'Contact sales',
  },
]

export const FAQS = [
  {
    question: 'Who can use PlaceTrack Pro?',
    answer:
      'Students, placement coordinators, and institution admins. Each role gets a tailored portal with the tools they need.',
  },
  {
    question: 'How do coding profiles sync?',
    answer:
      'Add your usernames for GitHub, LeetCode, Codeforces, and more. Click sync to pull your latest stats automatically.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. We use JWT authentication, encrypted passwords, role-based access control, and secure cloud infrastructure.',
  },
  {
    question: 'Can our college get a custom deployment?',
    answer:
      'Enterprise plans include custom branding, analytics dashboards, SSO options, and dedicated onboarding support.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer:
      'Yes. Every new student account includes a 14-day Pro trial with full access to analytics and interview tools.',
  },
] as const

export const SHOWCASE_HIGHLIGHTS = [
  'Real-time application status',
  'Coordinator applicant pipeline',
  'Coding stats at a glance',
  'Interview scheduling built-in',
] as const
