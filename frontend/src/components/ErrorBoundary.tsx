import { Component, type ReactNode, type ErrorInfo } from 'react'
import { CloudOff, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
          <div className="glass-strong rounded-2xl p-8 max-w-md w-full text-center space-y-4 animate-fade-in-up">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center">
              <CloudOff className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Something went wrong</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {this.state.error.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => { this.setState({ error: null }); window.location.reload() }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/20 hover:bg-blue-500/30 transition-all text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
