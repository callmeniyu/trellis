import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Database, RotateCcw, ShieldCheck } from 'lucide-react'
import type { AuthUser } from '@/models/User'
import { updateProfileSchema } from '@/models/schemas'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select, Switch } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Feedback'
import { Dialog } from '@/components/ui/Dialog'
import { useAuth } from '@/app/providers/AuthProvider'
import { authService } from '@/services/auth/auth.service'
import { dashboardService } from '@/features/dashboard/dashboard.service'
import { getUserMessage } from '@/lib/errors'
import { useToast } from '@/components/feedback/ToastProvider'
import { appConfig } from '@/config/app'
import { useForm, validate } from '@/hooks/use-form'

interface ProfileValues {
  name: string
  email: string
}

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 rows per page' },
  { value: '25', label: '25 rows per page' },
  { value: '50', label: '50 rows per page' },
]

export function SettingsPage() {
  const { user } = useAuth()

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your profile, workspace preferences and demo data."
      />

      <div className="settings-layout">
        {user ? <ProfileCard user={user} /> : null}

        <PreferencesCard />

        <DemoDataCard />

        <Card>
          <CardHeader>
            <div>
              <CardTitle>About Trellis</CardTitle>
              <CardDescription>
                Platform overview and runtime information.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent style={{ paddingTop: 8 }}>
            <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
              <strong>{appConfig.name}</strong> v{appConfig.version} — A modern,
              frontend-only SaaS administration platform built with React 19, TypeScript,
              Vite, TanStack Query and an in-process mock server. Designed for static
              deployment without backend infrastructure.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function ProfileCard({ user }: { user: AuthUser }) {
  const { setUser } = useAuth()
  const toast = useToast()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<ProfileValues, Record<string, string>>({
    name: user?.name ?? '',
    email: user?.email ?? '',
  })
  const isDirty =
    form.values.name !== (user?.name ?? '') || form.values.email !== (user?.email ?? '')

  const handleSubmit = async () => {
    setServerError(null)
    form.setErrors({})

    const result = validate(updateProfileSchema, form.values)
    if (!result.ok) {
      form.setErrors(result.fieldErrors)
      return
    }

    form.setSubmitting(true)
    try {
      const updated = await authService.updateProfile(result.data)
      setUser(updated)
      toast.success('Profile updated successfully')
    } catch (error) {
      const fields = (error as { fields?: Record<string, string> }).fields
      if (fields && Object.keys(fields).length > 0) {
        form.setErrors(fields as Partial<Record<keyof ProfileValues, string>>)
      } else {
        setServerError(getUserMessage(error))
      }
    } finally {
      form.setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            How your account appears across the workspace.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent style={{ paddingTop: 8 }}>
        {serverError && (
          <div style={{ marginBottom: 14 }}>
            <Alert tone="destructive">{serverError}</Alert>
          </div>
        )}

        <Field id="profile-name" label="Full name" required error={form.errors.name}>
          <Input
            id="profile-name"
            autoComplete="name"
            value={form.values.name}
            invalid={Boolean(form.errors.name)}
            onChange={(event) => {
              form.setField('name', event.target.value)
              form.clearError('name')
            }}
          />
        </Field>

        <Field id="profile-email" label="Email" required error={form.errors.email}>
          <Input
            id="profile-email"
            type="email"
            autoComplete="email"
            value={form.values.email}
            invalid={Boolean(form.errors.email)}
            onChange={(event) => {
              form.setField('email', event.target.value)
              form.clearError('email')
            }}
          />
        </Field>
      </CardContent>

      <CardFooter style={{ justifyContent: 'flex-end' }}>
        <Button
          variant="primary"
          onClick={handleSubmit}
          isLoading={form.submitting}
          disabled={!isDirty || form.submitting}
        >
          Save changes
        </Button>
      </CardFooter>
    </Card>
  )
}

function PreferencesCard() {
  const toast = useToast()
  const [pageSize, setPageSize] = useState(() => {
    return window.localStorage.getItem('trellis.pref.pageSize') || '10'
  })
  const [emailAlerts, setEmailAlerts] = useState(() => {
    return window.localStorage.getItem('trellis.pref.emailAlerts') !== 'false'
  })
  const [compactDensity, setCompactDensity] = useState(() => {
    return window.localStorage.getItem('trellis.pref.compactDensity') === 'true'
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    try {
      window.localStorage.setItem('trellis.pref.pageSize', pageSize)
      window.localStorage.setItem('trellis.pref.emailAlerts', String(emailAlerts))
      window.localStorage.setItem('trellis.pref.compactDensity', String(compactDensity))
      toast.success('Preferences saved')
    } catch {
      toast.error('Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Workspace Preferences</CardTitle>
          <CardDescription>
            Configure display density and notification behaviors.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent
        style={{ paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 18 }}
      >
        <Field id="pref-pagesize" label="Default table page size">
          <Select
            id="pref-pagesize"
            options={PAGE_SIZE_OPTIONS}
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
          />
        </Field>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '0.88rem', fontWeight: 500, display: 'block' }}>
              Email Notifications
            </span>
            <span className="text-xs text-muted">
              Receive email digests for order changes and invoices
            </span>
          </div>
          <Switch
            label="Email Notifications"
            checked={emailAlerts}
            onChange={setEmailAlerts}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '0.88rem', fontWeight: 500, display: 'block' }}>
              Compact Table Layout
            </span>
            <span className="text-xs text-muted">
              Reduce vertical table padding for high-density screens
            </span>
          </div>
          <Switch
            label="Compact Table Layout"
            checked={compactDensity}
            onChange={setCompactDensity}
          />
        </div>
      </CardContent>
      <CardFooter style={{ justifyContent: 'flex-end' }}>
        <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
          Save preferences
        </Button>
      </CardFooter>
    </Card>
  )
}

function DemoDataCard() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const toast = useToast()
  const queryClient = useQueryClient()

  const handleReset = async () => {
    setIsResetting(true)
    try {
      await dashboardService.resetDemo()
      // Invalidate all active queries so UI refreshes with restored seeds
      await queryClient.invalidateQueries()
      toast.success(
        'Demo data restored',
        'All records have been reset to pristine seed data.',
      )
      setDialogOpen(false)
    } catch {
      toast.error('Reset failed', 'Could not reset demonstration data.')
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Demo Data Management</CardTitle>
            <CardDescription>
              Local browser storage and sample database controls.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent style={{ paddingTop: 8 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '12px 16px',
              backgroundColor: 'var(--subtle)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 16,
            }}
          >
            <Database
              size={18}
              style={{ color: 'var(--primary)', marginTop: 2, flexShrink: 0 }}
            />
            <div
              style={{ fontSize: '0.84rem', color: 'var(--foreground)', lineHeight: 1.5 }}
            >
              All additions, edits, and deletions made across users, products, orders,
              projects, and invoices are stored locally in your browser. You can reset at
              any time to return to the initial demonstration dataset.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, display: 'block' }}>
                Reset to Initial Seeds
              </span>
              <span className="text-xs text-muted">
                Discard all local mutations and restore default demo data.
              </span>
            </div>
            <Button variant="danger-ghost" onClick={() => setDialogOpen(true)}>
              <RotateCcw size={15} aria-hidden="true" />
              Reset Demo Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => !isResetting && setDialogOpen(false)}
        title="Reset demonstration data?"
        description="This action will clear all local browser mutations and reload original seed records."
        size="md"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button
              variant="ghost"
              disabled={isResetting}
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" isLoading={isResetting} onClick={handleReset}>
              Reset Data
            </Button>
          </div>
        }
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            fontSize: '0.88rem',
            lineHeight: 1.5,
          }}
        >
          <p>
            You are about to discard all user-created changes, including newly added
            users, modified product catalog items, and status transitions on orders and
            invoices.
          </p>
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--warning-subtle)',
              color: 'var(--warning-foreground)',
              border: '1px solid var(--warning)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.82rem',
            }}
          >
            <ShieldCheck size={16} style={{ flexShrink: 0 }} />
            <span>Your current login session will remain active.</span>
          </div>
        </div>
      </Dialog>
    </>
  )
}
