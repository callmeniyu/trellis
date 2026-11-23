import { formatRelativeTime, initials } from '@/lib/format'
import type { ActivityEvent } from '@/models/Dashboard'
import { Skeleton } from '@/components/ui/Skeleton'

const ACTION_PAST_TENSE: Record<ActivityEvent['action'], string> = {
  created: 'created',
  updated: 'updated',
  deleted: 'deleted',
  signed_in: 'signed in to',
  placed_order: 'placed',
}

function getDotColor(event: ActivityEvent): string {
  switch (event.action) {
    case 'created':
    case 'placed_order':
      return 'var(--primary)'
    case 'updated':
      return 'var(--info)'
    case 'deleted':
      return 'var(--destructive)'
    case 'signed_in':
    default:
      return 'var(--primary)'
  }
}

export function ActivityFeed({ events }: { events: ActivityEvent[] | undefined }) {
  if (!events) {
    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '8px 20px' }}
      >
        {[0, 1, 2, 3].map((index) => (
          <div key={index} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Skeleton style={{ width: 31, height: 31, borderRadius: '50%' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <Skeleton style={{ width: '80%' }} />
              <Skeleton style={{ width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <p className="text-sm text-muted" style={{ padding: '16px 20px' }}>
        No recent activity recorded.
      </p>
    )
  }

  return (
    <ol className="activity-feed">
      {events.map((event) => {
        const displayTitle =
          event.title ??
          `${event.actorName} ${ACTION_PAST_TENSE[event.action]} ${event.target}`
        const dotBg = getDotColor(event)

        return (
          <li key={event.id} className="activity-feed__item">
            <span
              className="activity-feed__dot"
              aria-hidden="true"
              style={{ background: dotBg, color: '#ffffff' }}
            >
              {initials(event.actorName || 'User')}
            </span>
            <div className="activity-feed__text">
              <span className="activity-feed__action">{displayTitle}</span>
              {event.description && (
                <span className="activity-feed__description">{event.description}</span>
              )}
              <time className="activity-feed__time" dateTime={event.createdAt}>
                {formatRelativeTime(event.createdAt)}
              </time>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
