import { useState, useRef, useCallback } from 'react'
import { X, Download, Share2, Loader2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import type { WeatherData } from '../../types'
import type { ThemeId } from '../../utils/themePresets'
import ShareCard from './ShareCard'
import ThemeSelector from './ThemeSelector'

interface Props {
  data: WeatherData
  musicMood: string | null
  onClose: () => void
}

export default function ShareModal({ data, musicMood, onClose }: Props) {
  const [themeId, setThemeId] = useState<ThemeId>('sunny-vibes')
  const [exporting, setExporting] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleExport = useCallback(async () => {
    const el = cardRef.current
    if (!el) return
    setExporting(true)

    try {
      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: null,
        allowTaint: false,
        useCORS: true,
        logging: false,
        width: 420,
        height: el.scrollHeight,
      })

      const link = document.createElement('a')
      link.download = `weather-${data.locationName.split(',')[0]?.trim().toLowerCase() || 'card'}-${themeId}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }, [data.locationName, themeId])

  async function handleShare() {
    const el = cardRef.current
    if (!el) return
    setExporting(true)

    try {
      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: null,
        allowTaint: false,
        useCORS: true,
        logging: false,
        width: 420,
        height: el.scrollHeight,
      })

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (!blob || !navigator.share) {
        handleExport()
        return
      }

      const file = new File([blob], `weather-${data.locationName.split(',')[0]?.trim().toLowerCase() || 'card'}.png`, { type: 'image/png' })

      await navigator.share({
        title: 'Weather Card',
        text: `Check out the weather in ${data.locationName}!`,
        files: [file],
      })
    } catch (err) {
      console.error('Share failed, falling back to download:', err)
      handleExport()
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

      <div className="relative pointer-events-auto w-full max-w-[500px] max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="glass rounded-2xl p-6 shadow-2xl shadow-black/40 animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Weather
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-5 flex justify-center">
            <div ref={cardRef} className="rounded-2xl overflow-hidden shadow-2xl" style={{ maxWidth: '100%', width: 420 }}>
              <ShareCard data={data} themeId={themeId} musicMood={musicMood} />
            </div>
          </div>

          <div className="space-y-5">
            <ThemeSelector selected={themeId} onSelect={setThemeId} />

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600
                  hover:from-blue-400 hover:to-blue-500 text-white text-sm font-medium
                  transition-all duration-300 disabled:opacity-50 shadow-lg shadow-blue-500/25"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {exporting ? 'Exporting...' : 'Download'}
              </button>

              {typeof navigator.share === 'function' && (
                <button
                  onClick={handleShare}
                  disabled={exporting}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl
                    bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                    text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 disabled:opacity-50"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-600 text-center">
              Card dimensions: 420×560px · 3x retina quality
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
