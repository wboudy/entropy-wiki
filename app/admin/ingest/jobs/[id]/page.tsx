'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useAdminContext } from '../../../context'
import { Button } from '@/components/ui/button'

interface IngestJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  mode: 'manual' | 'scheduled' | 'api'
  total_items: number
  processed_items: number
  failed_items: number
  created_at: string
  started_at: string | null
  completed_at: string | null
  error_message: string | null
}

interface IngestItem {
  id: string
  job_id: string
  source_type: 'url' | 'text' | 'file' | 'api'
  source_url: string | null
  source_content: string | null
  status: 'pending' | 'extracting' | 'routing' | 'integrating' | 'completed' | 'failed' | 'skipped'
  extracted_title: string | null
  extracted_summary: string | null
  routing_decision: 'new_page' | 'update_page' | 'append_section' | 'merge' | 'skip' | null
  target_page_id: string | null
  routing_reasoning: string | null
  routing_confidence: number | null
  created_at: string
  processed_at: string | null
  error_message: string | null
  metadata: Record<string, unknown>
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  extracting: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  routing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  integrating: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  skipped: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
}

const routingLabels: Record<string, string> = {
  new_page: 'Create New Page',
  update_page: 'Update Existing',
  append_section: 'Append Section',
  merge: 'Merge Content',
  skip: 'Skip',
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: jobId } = use(params)
  const { password } = useAdminContext()
  const [job, setJob] = useState<IngestJob | null>(null)
  const [items, setItems] = useState<IngestItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  useEffect(() => {
    fetchJob()
    // Poll for updates every 3 seconds while processing
    const interval = setInterval(() => {
      if (job?.status === 'pending' || job?.status === 'processing') {
        fetchJob()
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [jobId, password, job?.status])

  async function fetchJob() {
    try {
      const response = await fetch(`${apiUrl}/admin/ingest/jobs/${jobId}`, {
        headers: {
          'X-Admin-Password': password,
        },
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch job')
      }

      const data = await response.json()
      setJob(data.job)
      setItems(data.items || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRetry() {
    setActionError('')
    setActionSuccess('')

    try {
      const response = await fetch(`${apiUrl}/admin/ingest/jobs/${jobId}/retry`, {
        method: 'POST',
        headers: {
          'X-Admin-Password': password,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to retry job')
      }

      const data = await response.json()
      setActionSuccess(data.message)
      fetchJob()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to retry job')
    }
  }

  async function handleApprove(itemId: string) {
    setActionError('')
    setActionSuccess('')

    try {
      const response = await fetch(`${apiUrl}/admin/ingest/jobs/${jobId}/items/${itemId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': password,
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to approve item')
      }

      setActionSuccess('Item approved for integration')
      fetchJob()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to approve item')
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this job? This cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`${apiUrl}/admin/ingest/jobs/${jobId}?force=true`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Password': password,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to delete job')
      }

      window.location.href = '/admin/ingest'
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete job')
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString()
  }

  function getProgress() {
    if (!job || job.total_items === 0) return 0
    return Math.round((job.processed_items / job.total_items) * 100)
  }

  function truncate(str: string | null | undefined, length: number = 100) {
    if (!str) return '-'
    if (str.length <= length) return str
    return str.slice(0, length) + '...'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading job...</div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="space-y-4">
        <Link href="/admin/ingest" className="text-sm text-muted-foreground hover:underline">
          Back to Ingest
        </Link>
        <div className="flex items-center justify-center py-12">
          <div className="text-destructive">{error || 'Job not found'}</div>
        </div>
      </div>
    )
  }

  const failedItems = items.filter(i => i.status === 'failed')
  const reviewItems = items.filter(i => i.status === 'routing')

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link href="/admin/ingest" className="text-sm text-muted-foreground hover:underline">
        Back to Ingest
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Job Details</h2>
          <p className="text-muted-foreground font-mono text-sm">{job.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${statusColors[job.status]}`}>
            {job.status}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border rounded-lg p-6 bg-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">
            {job.processed_items}/{job.total_items} items
            {job.failed_items > 0 && (
              <span className="text-destructive ml-1">
                ({job.failed_items} failed)
              </span>
            )}
          </span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
        </div>

        {/* Job Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
          <div>
            <span className="text-muted-foreground">Mode</span>
            <p className="font-medium">{job.mode}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Created</span>
            <p className="font-medium">{formatDate(job.created_at)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Started</span>
            <p className="font-medium">{formatDate(job.started_at)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Completed</span>
            <p className="font-medium">{formatDate(job.completed_at)}</p>
          </div>
        </div>

        {job.error_message && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            <strong>Error:</strong> {job.error_message}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {failedItems.length > 0 && (
          <Button onClick={handleRetry}>
            Retry Failed ({failedItems.length})
          </Button>
        )}
        <Button variant="outline" onClick={fetchJob}>
          Refresh
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete Job
        </Button>
      </div>

      {/* Messages */}
      {actionError && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {actionError}
        </div>
      )}
      {actionSuccess && (
        <div className="p-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg text-sm">
          {actionSuccess}
        </div>
      )}

      {/* Items Awaiting Review */}
      {reviewItems.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Awaiting Review ({reviewItems.length})</h3>
          <div className="space-y-3">
            {reviewItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{item.extracted_title || 'Untitled'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {truncate(item.source_url || item.source_content, 60)}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[item.status]}`}>
                    {item.status}
                  </span>
                </div>
                {item.extracted_summary && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {truncate(item.extracted_summary, 200)}
                  </p>
                )}
                {item.routing_decision && (
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <span>
                      <strong>Decision:</strong> {routingLabels[item.routing_decision] || item.routing_decision}
                    </span>
                    {item.routing_confidence && (
                      <span className="text-muted-foreground">
                        Confidence: {Math.round(item.routing_confidence * 100)}%
                      </span>
                    )}
                  </div>
                )}
                {item.routing_reasoning && (
                  <p className="text-sm text-muted-foreground mb-3 italic">
                    "{item.routing_reasoning}"
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => handleApprove(item.id)}>
                    Approve & Continue
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Items Table */}
      <div>
        <h3 className="text-lg font-semibold mb-3">All Items ({items.length})</h3>
        {items.length === 0 ? (
          <div className="text-muted-foreground text-center py-8 border rounded-lg">
            No items in this job.
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Source</th>
                  <th className="text-left px-4 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Routing</th>
                  <th className="text-left px-4 py-3 font-medium">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item) => {
                  const resultPageId = (item.metadata as Record<string, string>)?.result_page_id || item.target_page_id
                  const resultSlug = (item.metadata as Record<string, string>)?.result_slug

                  return (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="max-w-[200px]">
                          <span className="text-xs text-muted-foreground uppercase">
                            {item.source_type}
                          </span>
                          <p className="text-sm truncate font-mono">
                            {truncate(item.source_url || item.source_content?.slice(0, 50), 40)}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium truncate max-w-[200px]">
                          {item.extracted_title || '-'}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[item.status]}`}>
                          {item.status}
                        </span>
                        {item.error_message && (
                          <p className="text-xs text-destructive mt-1 max-w-[150px] truncate" title={item.error_message}>
                            {item.error_message}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {item.routing_decision ? (
                          <span className="text-sm">
                            {routingLabels[item.routing_decision] || item.routing_decision}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {resultSlug ? (
                          <Link
                            href={`/${resultSlug}`}
                            className="text-sm text-primary hover:underline"
                          >
                            /{resultSlug}
                          </Link>
                        ) : resultPageId ? (
                          <Link
                            href={`/admin/edit/${resultPageId}`}
                            className="text-sm text-primary hover:underline"
                          >
                            Edit Page
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
