import { http, HttpResponse } from 'msw'
import type {
  ActivityEvent,
  DashboardOverview,
  Kpi,
  SeriesPoint,
} from '@/models/Dashboard'
import { db } from '../db'
import { getAuthUserId, latency, unauthorized } from '../utils'

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function getMonthYearKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export const dashboardHandlers = [
  // GET /api/dashboard/overview — real metrics derived from db collections
  http.get('*/api/dashboard/overview', async ({ request }) => {
    await latency(120, 300)
    if (!getAuthUserId(request)) return unauthorized()

    const now = new Date()
    const activeOrders = db.orders.filter((o) => o.status !== 'cancelled')

    const totalUsers = db.users.length
    const totalProducts = db.products.length
    const totalOrders = db.orders.length
    const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0)
    const activeProjects = db.projects.filter((p) => p.status === 'active').length
    const pendingInvoices = db.invoices.filter(
      (i) => i.status === 'sent' || i.status === 'draft' || i.status === 'overdue',
    ).length

    // Generate 6-month monthly revenue & orders series from real orders
    const revenueByMonth: SeriesPoint[] = []
    const ordersSeries: SeriesPoint[] = []
    const usersSeries: SeriesPoint[] = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = getMonthYearKey(d)
      const label = MONTH_NAMES[d.getMonth()]

      const monthOrders = activeOrders.filter(
        (o) => getMonthYearKey(new Date(o.placedAt)) === key,
      )
      const monthRev = monthOrders.reduce((sum, o) => sum + o.total, 0)
      const monthUsers = db.users.filter(
        (u) => getMonthYearKey(new Date(u.createdAt)) === key,
      ).length

      // If sparse in this window, provide realistic derived progression based on record count
      const baselineRev = Math.round((totalRevenue / 8) * (1 + (5 - i) * 0.12))
      const baselineOrders = Math.max(
        1,
        Math.round((totalOrders / 8) * (1 + (5 - i) * 0.1)),
      )
      const baselineUsers = Math.max(
        1,
        Math.round((totalUsers / 8) * (1 + (5 - i) * 0.1)),
      )

      revenueByMonth.push({
        label,
        value: monthRev > 0 ? Math.round(monthRev) : baselineRev,
      })
      ordersSeries.push({
        label,
        value: monthOrders.length > 0 ? monthOrders.length : baselineOrders,
      })
      usersSeries.push({
        label,
        value: monthUsers > 0 ? monthUsers : baselineUsers,
      })
    }

    // Daily orders for the last 14 days
    const ordersByDay: SeriesPoint[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dayKey = d.toISOString().slice(0, 10)
      const count = db.orders.filter((o) => o.placedAt.slice(0, 10) === dayKey).length
      ordersByDay.push({
        label: String(d.getDate()),
        value: count,
      })
    }

    // Sparkline for products based on category distribution
    const categoryCountMap = new Map<string, number>()
    for (const p of db.products) {
      categoryCountMap.set(p.category, (categoryCountMap.get(p.category) ?? 0) + 1)
    }
    const productCategories: SeriesPoint[] = Array.from(categoryCountMap.entries()).map(
      ([cat, count]) => ({
        label: cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' '),
        value: count,
      }),
    )

    // Sparkline for projects
    const projectsSeries: SeriesPoint[] = [
      {
        label: 'Planning',
        value: db.projects.filter((p) => p.status === 'planning').length,
      },
      { label: 'Active', value: activeProjects },
      {
        label: 'On Hold',
        value: db.projects.filter((p) => p.status === 'on_hold').length,
      },
      {
        label: 'Done',
        value: db.projects.filter((p) => p.status === 'completed').length,
      },
    ]

    // Sparkline for invoices
    const invoicesSeries: SeriesPoint[] = [
      { label: 'Draft', value: db.invoices.filter((i) => i.status === 'draft').length },
      { label: 'Sent', value: db.invoices.filter((i) => i.status === 'sent').length },
      {
        label: 'Overdue',
        value: db.invoices.filter((i) => i.status === 'overdue').length,
      },
      { label: 'Paid', value: db.invoices.filter((i) => i.status === 'paid').length },
    ]

    const kpis: Kpi[] = [
      {
        id: 'revenue',
        label: 'Total Revenue',
        value: Math.round(totalRevenue),
        format: 'currency',
        changePct: 12.4,
        series: revenueByMonth,
      },
      {
        id: 'orders',
        label: 'Total Orders',
        value: totalOrders,
        format: 'number',
        changePct: 8.7,
        series: ordersSeries,
      },
      {
        id: 'users',
        label: 'Total Users',
        value: totalUsers,
        format: 'number',
        changePct: 14.2,
        series: usersSeries,
      },
      {
        id: 'products',
        label: 'Catalog Products',
        value: totalProducts,
        format: 'number',
        changePct: 5.3,
        series: productCategories.slice(0, 5),
      },
      {
        id: 'projects',
        label: 'Active Projects',
        value: activeProjects,
        format: 'number',
        changePct: 2.1,
        series: projectsSeries,
      },
      {
        id: 'invoices',
        label: 'Pending Invoices',
        value: pendingInvoices,
        format: 'number',
        changePct: -3.8,
        series: invoicesSeries,
      },
    ]

    const recentOrders = [...db.orders]
      .sort((a, b) => (a.placedAt < b.placedAt ? 1 : -1))
      .slice(0, 6)

    const trafficSources = [
      { source: 'Direct', share: 38, visits: Math.round(totalOrders * 32) },
      { source: 'Organic Search', share: 28, visits: Math.round(totalOrders * 24) },
      { source: 'Referral', share: 18, visits: Math.round(totalOrders * 15) },
      { source: 'Social', share: 11, visits: Math.round(totalOrders * 9) },
      { source: 'Email', share: 5, visits: Math.round(totalOrders * 4) },
    ]

    const overview: DashboardOverview = {
      kpis,
      revenueByMonth,
      ordersByDay,
      trafficSources,
      productCategories,
      recentOrders,
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: Math.round(totalRevenue),
      activeProjects,
      pendingInvoices,
    }

    return HttpResponse.json({ data: overview })
  }),

  // GET /api/dashboard/activity — feed of real actions in workspace
  http.get('*/api/dashboard/activity', async ({ request }) => {
    await latency(100, 250)
    if (!getAuthUserId(request)) return unauthorized()

    const url = new URL(request.url)
    const limit = Math.min(Number(url.searchParams.get('limit')) || 8, 30)

    const events: ActivityEvent[] = [...db.activity]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, limit)

    return HttpResponse.json({ data: events })
  }),

  // POST /api/demo/reset — restores original seeds and clears browser storage
  http.post('*/api/demo/reset', async ({ request }) => {
    await latency(200, 400)
    if (!getAuthUserId(request)) return unauthorized()

    db.reset()
    return HttpResponse.json({
      data: {
        success: true,
        message: 'Demo dataset has been restored to default seeds.',
      },
    })
  }),
]
