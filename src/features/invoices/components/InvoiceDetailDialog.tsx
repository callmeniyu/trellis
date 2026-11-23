import type { Invoice, InvoiceStatus } from '@/models/Invoice'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { InvoiceStatusBadge } from '@/components/display/status-badges'
import { formatCurrency, formatDate } from '@/lib/format'

interface InvoiceDetailDialogProps {
  invoice: Invoice | null
  open: boolean
  onClose: () => void
  onTransition: (invoice: Invoice, to: InvoiceStatus) => Promise<void>
  isUpdating: boolean
}

export function InvoiceDetailDialog({
  invoice,
  open,
  onClose,
  onTransition,
  isUpdating,
}: InvoiceDetailDialogProps) {
  if (!invoice) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Invoice ${invoice.number}`}
      description={`Billing record details for ${invoice.customerName}`}
      size="md"
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            {invoice.status === 'draft' && (
              <Button
                variant="secondary"
                size="sm"
                disabled={isUpdating}
                onClick={() => void onTransition(invoice, 'sent')}
              >
                Mark as sent
              </Button>
            )}
            {(invoice.status === 'sent' || invoice.status === 'overdue') && (
              <Button
                variant="primary"
                size="sm"
                disabled={isUpdating}
                onClick={() => void onTransition(invoice, 'paid')}
              >
                Mark as paid
              </Button>
            )}
            {(invoice.status === 'draft' || invoice.status === 'sent') && (
              <Button
                variant="danger-ghost"
                size="sm"
                disabled={isUpdating}
                onClick={() => void onTransition(invoice, 'cancelled')}
              >
                Cancel invoice
              </Button>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: 'var(--subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
          }}
        >
          <div>
            <span className="text-xs text-muted" style={{ display: 'block' }}>
              Invoice Total
            </span>
            <span
              style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--foreground)' }}
            >
              {formatCurrency(invoice.amount)}
            </span>
          </div>
          <InvoiceStatusBadge status={invoice.status} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <span
              className="text-xs text-muted"
              style={{ display: 'block', marginBottom: 2 }}
            >
              Customer Name
            </span>
            <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>
              {invoice.customerName}
            </span>
          </div>
          <div>
            <span
              className="text-xs text-muted"
              style={{ display: 'block', marginBottom: 2 }}
            >
              Customer Email
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
              {invoice.customerEmail}
            </span>
          </div>
          <div>
            <span
              className="text-xs text-muted"
              style={{ display: 'block', marginBottom: 2 }}
            >
              Issued Date
            </span>
            <span style={{ fontSize: '0.9rem' }}>{formatDate(invoice.issuedAt)}</span>
          </div>
          <div>
            <span
              className="text-xs text-muted"
              style={{ display: 'block', marginBottom: 2 }}
            >
              Due Date
            </span>
            <span style={{ fontSize: '0.9rem' }}>
              {invoice.dueAt ? formatDate(invoice.dueAt) : 'Immediate'}
            </span>
          </div>
          {invoice.paidAt && (
            <div>
              <span
                className="text-xs text-muted"
                style={{ display: 'block', marginBottom: 2 }}
              >
                Paid Date
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--success)' }}>
                {formatDate(invoice.paidAt)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}
