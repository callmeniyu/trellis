import type { ActivityEvent, DashboardOverview } from '@/models/Dashboard'
import { apiClient } from '@/services/api/client'

/** Dashboard feature service — aggregates are computed server-side. */
export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    const response = await apiClient.get<{ data: DashboardOverview }>(
      '/dashboard/overview',
    )
    return response.data
  },

  async getActivity(limit = 8): Promise<ActivityEvent[]> {
    const response = await apiClient.get<{ data: ActivityEvent[] }>(
      '/dashboard/activity',
      { query: { limit } },
    )
    return response.data
  },

  async resetDemo(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{
      data: { success: boolean; message: string }
    }>('/demo/reset')
    return response.data
  },
}
