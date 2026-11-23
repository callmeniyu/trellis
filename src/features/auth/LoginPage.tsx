import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  FolderKanban,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react'
import { appConfig } from '@/config/app'
import { loginSchema } from '@/models/schemas'
import { useForm, validate } from '@/hooks/use-form'
import { useAuth } from '@/app/providers/AuthProvider'
import { getUserMessage } from '@/lib/errors'
import { Button } from '@/components/ui/Button'
import { Checkbox, Field, Input } from '@/components/ui/Input'
import { TrellisLogo } from '@/components/ui/TrellisLogo'

interface LoginValues {
  email: string
  password: string
}

const HIGHLIGHT_POINTS = [
  {
    icon: LayoutDashboard,
    title: 'Complete SaaS Administration',
    body: 'Data-driven overview, customer transactions, inventory and project tracking.',
  },
  {
    icon: Database,
    title: 'In-Process Mock Engine',
    body: 'Fully functional MSW mock API with seeded data and local browser persistence.',
  },
  {
    icon: FolderKanban,
    title: 'CRUD Workflows & Transitions',
    body: 'Search, filter, sort, create, update, and manage statuses across all domains.',
  },
  {
    icon: BarChart3,
    title: 'Data-Driven Analytics',
    body: '7-day, 30-day and 90-day performance trends rendered with responsive charts.',
  },
] as const

/**
 * Trellis demonstration login screen.
 */
export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [copiedDemo, setCopiedDemo] = useState(false)

  const form = useForm<LoginValues, { email?: string; password?: string }>({
    email: '',
    password: '',
  })

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)

    const result = validate(loginSchema, form.values)
    if (!result.ok) {
      form.setErrors(result.fieldErrors)
      return
    }

    form.setSubmitting(true)
    try {
      await login(result.data)
      const target = (location.state as { from?: string } | null)?.from ?? '/dashboard'
      navigate(target, { replace: true })
    } catch (error) {
      setFormError(getUserMessage(error))
    } finally {
      form.setSubmitting(false)
    }
  }

  const fillDemo = (email: string, password: string) => {
    form.setValues({ email, password })
    form.setErrors({})
    setFormError(null)
    setCopiedDemo(true)
    setTimeout(() => setCopiedDemo(false), 2000)
  }

  const demoAccount = appConfig.demoAccounts[0]

  return (
    <div className="login-page">
      <div className="login-page__left">
        <div className="login-card">
          <Link to="/" className="login-card__back">
            <ArrowLeft size={14} aria-hidden="true" />
            Back to landing
          </Link>

          <div style={{ marginBottom: 20 }}>
            <TrellisLogo size={36} subtitle="Platform" />
          </div>

          <h1 className="login-card__title">Sign in to Trellis</h1>
          <p className="login-card__subtitle">
            Welcome back. Sign in with the demo account to access your workspace.
          </p>

          {demoAccount && (
            <div
              style={{
                marginBottom: 20,
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--subtle)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--primary)',
                  }}
                >
                  Demo Credentials
                </span>
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--foreground)',
                  }}
                >
                  {demoAccount.email} &bull; {demoAccount.password}
                </span>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fillDemo(demoAccount.email, demoAccount.password)}
              >
                {copiedDemo ? (
                  <>
                    <CheckCircle2 size={13} style={{ color: 'var(--success)' }} />
                    Filled!
                  </>
                ) : (
                  <>
                    <Sparkles size={13} style={{ color: 'var(--primary)' }} />
                    Use Demo
                  </>
                )}
              </Button>
            </div>
          )}

          {formError && (
            <div role="alert" className="alert alert--destructive login-error">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="login-form">
            <Field id="email" label="Email" error={form.errors.email} required>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="admin@trellis.demo"
                value={form.values.email}
                invalid={Boolean(form.errors.email)}
                aria-describedby={form.errors.email ? 'email-error' : undefined}
                onChange={(event) => {
                  form.setField('email', event.target.value)
                  form.clearError('email')
                }}
              />
            </Field>

            <Field id="password" label="Password" error={form.errors.password} required>
              <span className="login-password">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.values.password}
                  invalid={Boolean(form.errors.password)}
                  aria-describedby={form.errors.password ? 'password-error' : undefined}
                  onChange={(event) => {
                    form.setField('password', event.target.value)
                    form.clearError('password')
                  }}
                />
                <button
                  type="button"
                  className="icon-btn login-password__toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? (
                    <EyeOff size={15} aria-hidden="true" />
                  ) : (
                    <Eye size={15} aria-hidden="true" />
                  )}
                </button>
              </span>
            </Field>

            <div className="login-form__footer">
              <Checkbox
                id="remember"
                name="remember"
                label="Remember me"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              <span className="text-xs text-muted">Local demonstration</span>
            </div>

            <Button type="submit" variant="primary" isLoading={form.submitting}>
              Sign in to Dashboard
            </Button>
          </form>

          <p className="login-card__skip" style={{ marginTop: 24 }}>
            Direct demo entry?{' '}
            <Link to="/dashboard" style={{ fontWeight: 600 }}>
              Continue to dashboard &rarr;
            </Link>
          </p>
        </div>
      </div>

      <aside className="login-page__right" aria-label="Trellis overview">
        <div className="login-page__panel">
          <p className="login-page__eyebrow">Interactive SaaS Administration</p>
          <h2 className="login-page__overlay-title">
            Enterprise administration, engineered entirely in the frontend.
          </h2>
          <p className="login-page__overlay-desc">
            Explore a cohesive admin suite built with React 19, strict TypeScript, and an
            in-process mock server with persistent browser storage.
          </p>
          <ul className="login-page__features">
            {HIGHLIGHT_POINTS.map((point) => (
              <li key={point.title} className="login-page__feature">
                <span className="login-page__feature-icon">
                  <point.icon size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>{point.title}</strong>
                  <span>{point.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
