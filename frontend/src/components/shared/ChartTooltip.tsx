import type { ComponentProps } from 'react'
import { Tooltip } from 'recharts'

export const CHART_TOOLTIP_STYLE = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.06)',
}

type TooltipComponentProps = ComponentProps<typeof Tooltip>

type ChartTooltipProps = Omit<
  TooltipComponentProps,
  'cursor' | 'contentStyle' | 'labelStyle' | 'itemStyle'
> & {
  variant?: 'bar' | 'line' | 'pie' | 'area'
  cursor?: TooltipComponentProps['cursor']
}

export function ChartTooltip({ variant = 'bar', cursor, ...props }: ChartTooltipProps) {
  const defaultCursor =
    variant === 'bar' || variant === 'pie'
      ? false
      : { stroke: '#E5E7EB', strokeWidth: 1, strokeDasharray: '4 4' }

  return (
    <Tooltip
      {...props}
      cursor={cursor ?? defaultCursor}
      contentStyle={CHART_TOOLTIP_STYLE}
      labelStyle={{ color: '#111827' }}
      itemStyle={{ color: '#6B7280' }}
    />
  )
}
