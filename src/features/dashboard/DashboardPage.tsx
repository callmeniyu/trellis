import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { queryKeys } from '@/lib/query-keys'
import { formatCurrency, formatDate, formatNumber } from '@/lib/format'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/Feedback'
import { Tabs } from '@/components/ui/Tabs'
import { AreaChart, BarChart, DonutChart, type DonutSegment } from '@/components/charts'
import { TableRoot, THead, Td, Th, Tr } from '@/components/ui/Table'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/display/status-badges'
import { dashboardService } from './dashboard.service'
import { KpiCard, KpiCardSkeleton } from './components/KpiCard'
import { ActivityFeed } from './components/ActivityFeed'
import { QuickActions } from './components/QuickActions'

const METRIC_TABS = [
  { value: 'revenue', label: 'Monthly Revenue' },
  { value: 'orders', label: 'Daily Orders' },
]

const DONUT_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--muted-foreground)',
]

export function DashboardPage() {
  const [metricTab, setMetricTab] = useState<'revenue' | 'orders'>('revenue')

  const overview = useQuery({
    queryKey: queryKeys.dashboard.overview,
    queryFn: dashboardService.getOverview,
  })

  const activity = useQuery({
    queryKey: queryKeys.dashboard.activity,
    queryFn: () => dashboardService.getActivity(8),
  })

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Workspace overview, revenue performance and catalog health."
      />

      <div
        className="page-section"
        style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
      >
        {/* Top KPI Cards Grid */}
        <section aria-label="Key Performance Indicators">
          {overview.isPending ? (
            <div className="kpi-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <KpiCardSkeleton key={i} />
              ))}
            </div>
          ) : overview.isError ? (
            <ErrorState
              message="Could not load dashboard metrics."
              onRetry={() => overview.refetch()}
            />
          ) : (
            <div className="kpi-grid">
              {overview.data.kpis.map((kpi) => (
                <KpiCard key={kpi.id} kpi={kpi} />
              ))}
            </div>
          )}
        </section>

        {/* Main 2-Column Responsive Layout */}
        <div
          className="dashboard-grid-2col"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: 24,
          }}
        >
          {/* Main Area: Charts & Recent Orders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
            {/* Performance Trend Chart */}
            <Card>
              <CardHeader
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>
                    {metricTab === 'revenue'
                      ? 'Historical revenue volume across the last 6 months'
                      : 'Order volume velocity over the last 14 days'}
                  </CardDescription>
                </div>
                <Tabs
                  items={METRIC_TABS}
                  value={metricTab}
                  onChange={(v) => setMetricTab(v as 'revenue' | 'orders')}
                  label="Trend metric selector"
                />
              </CardHeader>
              <CardContent style={{ paddingTop: 8 }}>
                {overview.isPending ? (
                  <div
                    style={{
                      height: 280,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span className="text-sm text-muted">Loading chart data…</span>
                  </div>
                ) : overview.isError ? (
                  <ErrorState
                    message="Could not load performance chart."
                    onRetry={() => overview.refetch()}
                  />
                ) : metricTab === 'revenue' ? (
                  <AreaChart
                    data={overview.data.revenueByMonth}
                    height={280}
                    formatValue={(v) => formatCurrency(v)}
                    ariaLabel="Monthly revenue chart"
                  />
                ) : (
                  <BarChart
                    data={overview.data.ordersByDay}
                    height={280}
                    formatValue={(v) => formatNumber(v)}
                    ariaLabel="Daily orders chart"
                  />
                )}
              </CardContent>
            </Card>

            {/* Recent Orders Table */}
            <Card>
              <CardHeader
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Latest customer transactions and fulfillment status
                  </CardDescription>
                </div>
                <Link to="/dashboard/orders" className="btn btn--ghost btn--sm">
                  View all orders
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </CardHeader>
              <CardContent style={{ padding: 0 }}>
                {overview.isPending ? (
                  <p className="text-sm text-muted" style={{ padding: 20 }}>
                    Loading orders…
                  </p>
                ) : overview.isError ? (
                  <div style={{ padding: 20 }}>
                    <ErrorState message="Could not load recent orders." />
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <TableRoot caption="Recent customer transactions">
                      <THead>
                        <tr>
                          <Th>Order</Th>
                          <Th>Customer</Th>
                          <Th style={{ textAlign: 'right' }}>Total</Th>
                          <Th>Status</Th>
                          <Th>Payment</Th>
                          <Th>Date</Th>
                          <Th style={{ textAlign: 'right' }}>Action</Th>
                        </tr>
                      </THead>
                      <tbody>
                        {overview.data.recentOrders.map((order) => (
                          <Tr key={order.id}>
                            <Td>
                              <span className="table__cell-primary">{order.number}</span>
                            </Td>
                            <Td>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 500 }}>
                                  {order.customerName}
                                </span>
                                <span
                                  className="text-xs text-muted truncate"
                                  style={{ maxWidth: 160 }}
                                >
                                  {order.customerEmail}
                                </span>
                              </div>
                            </Td>
                            <Td
                              style={{
                                textAlign: 'right',
                                fontVariantNumeric: 'tabular-nums',
                                fontWeight: 600,
                              }}
                            >
                              {formatCurrency(order.total)}
                            </Td>
                            <Td>
                              <OrderStatusBadge status={order.status} />
                            </Td>
                            <Td>
                              <PaymentStatusBadge status={order.paymentStatus} />
                            </Td>
                            <Td className="table__cell-muted">
                              {formatDate(order.placedAt)}
                            </Td>
                            <Td style={{ textAlign: 'right' }}>
                              <Link
                                to={`/dashboard/orders/${order.id}`}
                                className="btn btn--secondary btn--sm"
                                aria-label={`View order ${order.number}`}
                              >
                                View
                              </Link>
                            </Td>
                          </Tr>
                        ))}
                      </tbody>
                    </TableRoot>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Secondary Column: Quick Actions, Catalog Breakdown, Activity Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common admin workflows</CardDescription>
                </div>
              </CardHeader>
              <CardContent style={{ paddingTop: 4 }}>
                <QuickActions />
              </CardContent>
            </Card>

            {/* Product Catalog Breakdown */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Catalog Distribution</CardTitle>
                  <CardDescription>Active inventory by category</CardDescription>
                </div>
              </CardHeader>
              <CardContent style={{ paddingTop: 8 }}>
                {overview.isPending ? (
                  <p className="text-sm text-muted">Loading breakdown…</p>
                ) : overview.isError ? (
                  <p className="text-sm text-muted">Unavailable</p>
                ) : (
                  <CategoryDonutSection categories={overview.data.productCategories} />
                )}
              </CardContent>
            </Card>

            {/* Recent Workspace Activity */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Workspace Activity</CardTitle>
                  <CardDescription>Real-time audit log of admin actions</CardDescription>
                </div>
              </CardHeader>
              <CardContent style={{ padding: 0 }}>
                <ActivityFeed events={activity.data} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

function CategoryDonutSection({
  categories,
}: {
  categories: Array<{ label: string; value: number }>
}) {
  const total = categories.reduce((sum, c) => sum + c.value, 0)
  const segments: DonutSegment[] = categories.map((cat, idx) => ({
    label: cat.label,
    value: cat.value,
    color: DONUT_COLORS[idx % DONUT_COLORS.length],
  }))

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
    >
      <DonutChart
        segments={segments}
        size={170}
        thickness={24}
        ariaLabel="Product catalog category distribution"
      />
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {categories.map((cat, idx) => {
          const color = DONUT_COLORS[idx % DONUT_COLORS.length]
          const pct = total > 0 ? Math.round((cat.value / total) * 100) : 0
          return (
            <div
              key={cat.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.82rem',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    backgroundColor: color,
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                <span style={{ color: 'var(--foreground)' }}>{cat.label}</span>
              </span>
              <span
                style={{
                  color: 'var(--muted-foreground)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {cat.value} ({pct}%)
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
