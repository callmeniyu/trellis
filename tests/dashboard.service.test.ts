import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { server } from './mocks/server'
import { authService } from '@/services/auth/auth.service'
import { dashboardService } from '@/features/dashboard/dashboard.service'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())

describe('dashboard service (against mock API)', () => {
  it('fetches real dashboard overview metrics and KPIs', async () => {
    await authService.login({ email: 'admin@trellis.demo', password: 'TrellisDemo123' })

    const overview = await dashboardService.getOverview()
    expect(overview.kpis).toBeInstanceOf(Array)
    expect(overview.kpis.length).toBeGreaterThanOrEqual(4)

    // Check key SaaS metrics
    expect(overview.totalUsers).toBeGreaterThan(0)
    expect(overview.totalProducts).toBeGreaterThan(0)
    expect(overview.totalOrders).toBeGreaterThan(0)
    expect(overview.totalRevenue).toBeGreaterThan(0)
    expect(overview.recentOrders.length).toBeGreaterThan(0)

    await authService.logout()
  })

  it('fetches real workspace activity events', async () => {
    await authService.login({ email: 'admin@trellis.demo', password: 'TrellisDemo123' })

    const activity = await dashboardService.getActivity(5)
    expect(activity).toBeInstanceOf(Array)
    expect(activity.length).toBeLessThanOrEqual(5)

    await authService.logout()
  })

  it('resets demo data successfully via the reset endpoint', async () => {
    await authService.login({ email: 'admin@trellis.demo', password: 'TrellisDemo123' })

    const res = await dashboardService.resetDemo()
    expect(res.success).toBe(true)

    await authService.logout()
  })
})
