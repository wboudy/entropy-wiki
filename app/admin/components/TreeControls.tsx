'use client'

import { Button } from '@/components/ui/button'

interface TreeControlsProps {
  selectedCount: number
  onPublish: () => void
  onUnpublish: () => void
  onDelete: () => void
  onClearSelection: () => void
  isLoading?: boolean
}

export function TreeControls({
  selectedCount,
  onPublish,
  onUnpublish,
  onDelete,
  onClearSelection,
  isLoading = false,
}: TreeControlsProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-cyan-400">
          {selectedCount} {selectedCount === 1 ? 'page' : 'pages'} selected
        </span>
        <button
          onClick={onClearSelection}
          className="text-xs text-cyan-500/70 hover:text-cyan-400 transition-colors underline"
        >
          Clear
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPublish}
          disabled={isLoading}
          className="border-green-500/30 text-green-400 hover:bg-green-500/10"
        >
          Publish
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onUnpublish}
          disabled={isLoading}
          className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
        >
          Unpublish
        </Button>
        <div className="w-px h-6 bg-cyan-500/30" />
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={isLoading}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}
