import { Tooltip, type TooltipProps } from 'recharts'

export const CHART_TOOLTIP_STYLE = {
  background: '#1C2128',
  border: '1px solid #30363D',
  borderRadius: 8,
}

type ChartTooltipProps = TooltipProps<number, string> & {
  variant?: 'bar' | 'line' | 'pie' | 'area'
}

export function ChartTooltip({ variant = 'bar', cursor, ...props }: ChartTooltipProps) {
  const defaultCursor =
    variant === 'bar' || variant === 'pie'
      ? false
      : { stroke: '#30363D', strokeWidth: 1, strokeDasharray: '4 4' }

  return (
    <Tooltip
      cursor={cursor ?? defaultCursor}
      contentStyle={CHART_TOOLTIP_STYLE}
      labelStyle={{ color: '#F0F6FC' }}
      itemStyle={{ color: '#C9D1D9' }}
      {...props}
    />
  )
}
