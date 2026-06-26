import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('M360 ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">𓂀</div>
            <h1 style={{ fontFamily: "'Cinzel', serif" }} className="text-2xl md:text-3xl font-bold text-[#F3AE1C] mb-3">
              Something Went Wrong
            </h1>
            <p style={{ fontFamily: "'Poppins', sans-serif" }} className="text-sm text-[#9CA3AF] mb-6">
              The sands of Egypt have shifted. Please refresh the page to continue your journey.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full bg-[#F3AE1C] text-[#0B0B0B] font-semibold text-sm cursor-pointer hover:bg-[#EFCF9E] transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
