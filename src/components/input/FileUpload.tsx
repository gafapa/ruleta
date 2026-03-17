import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'
import type { WheelItem } from '../../types'
import { generatePalette } from '../../services/colors'
import { buildItems } from '../../services/wheel'

interface FileUploadProps {
  onItems: (items: WheelItem[]) => void
}

export function FileUpload({ onItems }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    async (file: File) => {
      setError(null)
      if (!file.name.endsWith('.txt')) {
        setError('Solo se admiten archivos .txt')
        return
      }
      const text = await file.text()
      const lines = text
        .replace(/\r/g, '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
      if (lines.length < 2) {
        setError('El archivo debe tener al menos 2 elementos')
        return
      }
      const palette = generatePalette(lines.length)
      onItems(buildItems(lines, palette))
      setFileName(file.name)
    },
    [onItems],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) void processFile(file)
    },
    [processFile],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) void processFile(file)
    },
    [processFile],
  )

  return (
    <div className="space-y-3">
      <div
        className={clsx(
          'relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-violet-400 bg-violet-50'
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50',
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".txt"
          className="hidden"
          onChange={handleChange}
        />
        {fileName ? (
          <div className="flex flex-col items-center gap-2">
            <FileText className="w-8 h-8 text-violet-500" />
            <p className="text-sm font-medium text-violet-600">{fileName}</p>
            <p className="text-xs text-slate-400">Clic para cambiar archivo</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className={clsx('w-8 h-8 transition-colors', isDragging ? 'text-violet-500' : 'text-slate-400')} />
            <p className="text-sm font-medium text-slate-600">
              Arrastra un archivo .txt aquí
            </p>
            <p className="text-xs text-slate-400">o haz clic para seleccionar</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <p className="text-xs text-slate-400">
        Formato: un elemento por línea en texto plano (.txt)
      </p>
    </div>
  )
}
