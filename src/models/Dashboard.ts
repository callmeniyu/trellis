import type { Order } from './Order'

/**
 * Dashboard data models. All metrics are computed server-side from
 * actual database records.
 */

export interface Kpi {
  id:
    | 'users'
    | 'products'
    | 'orders'
    | 'revenue'
    | 'projects'
    | 'invoices'
    | 'conversion'
    | 'customers'
    | 'students'
    | 'teachers'
    | 'programs'
  label: string
  value: number
  format: 'currency' | 'number' | 'percent'
  /** Percentage change versus the previous period. Negative = decline. */
  changePct: number
  /** Sparkline series for mini trend chart */
  series: SeriesPoint[]
}

export interface SeriesPoint {
  /** X axis label, e.g. a month abbreviation or day of month. */
  label: string
  value: number
}

export interface TrafficSource {
  source: string
  visits: number
  /** Share of total visits, percentage 0–100. */
  share: number
}

export interface DashboardOverview {
  kpis: Kpi[]
  revenueByMonth: SeriesPoint[]
  ordersByDay: SeriesPoint[]
  trafficSources: TrafficSource[]
  productCategories: SeriesPoint[]
  recentOrders: Order[]
  // Additional aggregates
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  activeProjects: number
  pendingInvoices: number
}

export type ActivityVerb =
  'created' | 'updated' | 'deleted' | 'signed_in' | 'placed_order'

export interface ActivityEvent {
  id: string
  actorName: string
  action: ActivityVerb
  target: string
  createdAt: string
  /** Optional rich display title */
  title?: string
  /** Optional description shown below the title */
  description?: string
}
