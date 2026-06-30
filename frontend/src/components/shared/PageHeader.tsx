interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{title}</h1>
        {description && <p className="text-text-secondary mt-1">{description}</p>}
      </div>
      {action && <div className="mt-4 sm:mt-0">{action}</div>}
    </div>
  )
}
