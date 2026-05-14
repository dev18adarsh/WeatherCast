import React from 'react'

interface Props {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
  accent?: string
  action?: React.ReactNode
}

export default function AnalyticsCard({ title, icon, children, className = '', accent = 'blue', action }: Props) {
  const accentBorder = {
    blue: 'border-blue-500/20',
    purple: 'border-purple-500/20',
    green: 'border-green-500/20',
    orange: 'border-orange-500/20',
    pink: 'border-pink-500/20',
    cyan: 'border-cyan-500/20',
  }[accent] || 'border-blue-500/20'

  const accentDot = {
    blue: 'bg-blue-400',
    purple: 'bg-purple-400',
    green: 'bg-green-400',
    orange: 'bg-orange-400',
    pink: 'bg-pink-400',
    cyan: 'bg-cyan-400',
  }[accent] || 'bg-blue-400'

  return (
    <div className={`glass rounded-2xl p-5 border-t ${accentBorder} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${accentDot} animate-glow-pulse`} />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">{title}</h3>
        </div>
        <div className="text-slate-400">{icon}</div>
        {action}
      </div>
      {children}
    </div>
  )
}
