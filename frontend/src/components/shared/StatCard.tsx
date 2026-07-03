import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: number
  subtitle?: string
  className?: string
}

export function StatCard({ title, value, icon: Icon, trend, subtitle, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn('card-hover overflow-hidden relative group', className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-5 relative">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-text-secondary font-medium">{title}</p>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {subtitle && <p className="text-xs text-text-secondary">{subtitle}</p>}
              {trend !== undefined && (
                <div className={cn('flex items-center gap-1 text-xs font-medium', {
                  'text-accent': trend > 0,
                  'text-danger': trend < 0,
                  'text-text-secondary': trend === 0,
                })}>
                  {trend > 0 ? <TrendingUp className="h-3 w-3" /> : trend < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                  <span>{trend > 0 ? '+' : ''}{Math.abs(trend)}% vs last month</span>
                </div>
              )}
            </div>
            <div className="rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 p-3 group-hover:scale-110 transition-transform duration-300">
              <Icon className="h-5 w-5 text-accent" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
