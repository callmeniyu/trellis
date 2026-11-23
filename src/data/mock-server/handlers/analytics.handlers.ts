import { http, HttpResponse } from 'msw'
import type {
  AnalyticsDailyPoint,
  AnalyticsOverview,
  AnalyticsRange,
} from '@/models/Analytics'
import { ANALYTICS_RANGES } from '@/models/Analytics'
import { db } from '../db'
import { getAuthUserId, jsonError, latency, unauthorized } from '../utils'

const RANGE_DAYS: Record<AnalyticsRange, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
}

const TOP_PAGES = [
  { path: '/dashboard', base: 980 },
  { path: '/dashboard/products', base: 640 },
  { path: '/dashboard/orders', base: 510 },
  { path: '/dashboard/users', base: 390 },
  { path: '/dashboard/analytics', base: 260 },
]

const TOP_COUNTRIES = [
  { country: 'United States', share: 34.2 },
  { country: 'United Kingdom', share: 15.6 },
  { country: 'Germany', share: 13.4 },
  { country: 'Japan', share: 8.7 },
  { country: 'Canada', share: 7.1 },
]

/**
 * Computes analytics series for the given number of days,
 * derived directly from the active db orders and database records.
 */
function buildSeries(days: number, offsetDays = 0): AnalyticsDailyPoint[] {
  const points: AnalyticsDailyPoint[] = []
  const now = new Date()
  const activeOrders = db.orders.filter((o) => o.status !== 'cancelled')
  const avgOrderVal =
    activeOrders.length > 0
      ? activeOrders.reduce((s, o) => s + o.total, 0) / activeOrders.length
      : 85

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setHours(12, 0, 0, 0)
    d.setDate(d.getDate() - (i + offsetDays))
    const key = d.toISOString().slice(0, 10)

    const dayOrders = activeOrders.filter((o) => o.placedAt.slice(0, 10) === key)
    const orderCountFromDb = dayOrders.length
    const revenueFromDb = dayOrders.reduce((sum, o) => sum + o.total, 0)

    // Baseline calculation to provide continuous realistic activity when date falls outside seeded days
    const daySeed =
      (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) % 17
    const weekday = d.getDay()
    const weekendDip = weekday === 0 || weekday === 6 ? 0.65 : 1.0
    const baselineOrders = Math.max(1, Math.round((2 + (daySeed % 4)) * weekendDip))
    const baselineRevenue = Math.round(baselineOrders * avgOrderVal * 100) / 100

    const finalOrders = orderCountFromDb > 0 ? orderCountFromDb : baselineOrders
    const finalRevenue =
      revenueFromDb > 0 ? Math.round(revenueFromDb * 100) / 100 : baselineRevenue
    const visitors = Math.round(finalOrders * (28 + (daySeed % 15)))

    points.push({
      date: key,
      revenue: finalRevenue,
      orders: finalOrders,
      visitors,
    })
  }

  return points
}

export const analyticsHandlers = [
  http.get('*/api/analytics/overview', async ({ request }) => {
    await latency(200, 450)
    if (!getAuthUserId(request)) return unauthorized()

    const url = new URL(request.url)
    const rangeParam = url.searchParams.get('range') ?? '30d'
    if (!ANALYTICS_RANGES.includes(rangeParam as AnalyticsRange)) {
      return jsonError(
        400,
        'bad_request',
        `Invalid range. Use one of: ${ANALYTICS_RANGES.join(', ')}.`,
      )
    }
    const range = rangeParam as AnalyticsRange
    const days = RANGE_DAYS[range]

    const series = buildSeries(days, 0)
    const previousSeries = buildSeries(days, days)

    const sum = (
      points: AnalyticsDailyPoint[],
      field: keyof AnalyticsDailyPoint,
    ): number => points.reduce((total, p) => total + (p[field] as number), 0)

    const revenueCurrent = sum(series, 'revenue')
    const revenuePrevious = sum(previousSeries, 'revenue')
    const ordersCurrent = sum(series, 'orders')
    const ordersPrevious = sum(previousSeries, 'orders')
    const visitorsCurrent = sum(series, 'visitors')
    const visitorsPrevious = sum(previousSeries, 'visitors')

    const changePct = (current: number, previous: number): number =>
      previous === 0 ? 0 : Math.round(((current - previous) / previous) * 1000) / 10

    const conversionRate =
      Math.round((ordersCurrent / Math.max(visitorsCurrent, 1)) * 10000) / 100
    const conversionPrevious =
      Math.round((ordersPrevious / Math.max(visitorsPrevious, 1)) * 10000) / 100

    const overview: AnalyticsOverview = {
      range,
      totals: {
        revenue: Math.round(revenueCurrent),
        orders: Math.round(ordersCurrent),
        visitors: visitorsCurrent,
        conversionRate,
      },
      changes: {
        revenue: changePct(revenueCurrent, revenuePrevious),
        orders: changePct(ordersCurrent, ordersPrevious),
        visitors: changePct(visitorsCurrent, visitorsPrevious),
        conversionRate: Math.round((conversionRate - conversionPrevious) * 100) / 100,
      },
      series,
      topPages: TOP_PAGES.map((page, index) => ({
        path: page.path,
        views: Math.round(page.base * (days / 30) * (0.92 + ((index * 37) % 17) / 100)),
        changePct: (((index * 29) % 23) - 9) / 2,
      })),
      topCountries: TOP_COUNTRIES.map((c) => ({
        country: c.country,
        share: Math.round(c.share * (days / 30) * 10) / 10,
      })),
    }

    return HttpResponse.json({ data: overview })
  }),
]
