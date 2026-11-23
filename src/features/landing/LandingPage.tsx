import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FolderKanban,
  LayoutDashboard,
  Lock,
  Package,
  ReceiptText,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { TrellisLogo } from '@/components/ui/TrellisLogo'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: LayoutDashboard,
    title: 'Executive Dashboard',
    description:
      'Data-driven KPI sparklines, monthly revenue trends, quick action shortcuts, and real-time audit activity feed.',
  },
  {
    icon: Users,
    title: 'User Management',
    description:
      'Searchable, sortable, paginated directory with role-based badges, account creation, editing, and confirmation dialogs.',
  },
  {
    icon: Package,
    title: 'Product Catalog',
    description:
      'Inventory control, category categorization, automated SKU generation, price formatting, and availability tracking.',
  },
  {
    icon: FolderKanban,
    title: 'Project Tracking',
    description:
      'Multi-status initiative management with client tracking, progress percentages, milestone dates, and validation.',
  },
  {
    icon: ReceiptText,
    title: 'Invoices & Billing',
    description:
      'Customer billing records with amount calculations, due dates, modal detail inspection, and status lifecycle transitions.',
  },
  {
    icon: BarChart3,
    title: 'Data-Driven Analytics',
    description:
      'Configurable 7-day, 30-day, and 90-day time horizons with responsive SVG area, bar, and donut charts.',
  },
]

const ARCHITECTURE_STEPS = [
  { step: '1', title: 'Component Layer', desc: 'UI views and dialogs' },
  { step: '2', title: 'Query Hooks', desc: 'TanStack Query cache & mutations' },
  { step: '3', title: 'Feature Service', desc: 'Strict HTTP interface boundary' },
  { step: '4', title: 'API Client', desc: 'Centralized fetch & error handling' },
  { step: '5', title: 'MSW Mock Server', desc: 'In-process request interception' },
  { step: '6', title: 'Browser Storage', desc: 'Persistent local storage state' },
]

const FAQ_ITEMS = [
  {
    question: 'What is Trellis?',
    answer:
      'Trellis is a frontend-only SaaS administration platform built with React 19, TypeScript, Vite, and TanStack Query. It demonstrates a complete, professional administrative experience that runs statically without requiring a backend server.',
  },
  {
    question: 'Does Trellis require a database or backend server to run?',
    answer:
      'No. Trellis includes an in-process mock API built on MSW (Mock Service Worker) with deterministic seed data and browser localStorage persistence. Every CRUD action, search, filter, and status update works out of the box.',
  },
  {
    question: 'Are user changes saved when I refresh the page?',
    answer:
      'Yes. Trellis persists data mutations (new users, edited products, updated orders and projects) directly into browser storage. You can restore the original sample data at any time via Settings.',
  },
  {
    question: 'Can Trellis be connected to a production backend later?',
    answer:
      'Yes. Trellis is architected with strict layering (Component → Hook → Service → API Client). To connect a real backend, you configure the API base URL and disable mock handlers; the UI and business logic remain untouched.',
  },
]

function LandingHeader() {
  return (
    <header className="landing__header">
      <div className="landing__container landing__header-inner">
        <TrellisLogo size={32} subtitle="Platform" />
        <nav aria-label="Landing Navigation" className="landing__nav">
          <a href="#features">Features</a>
          <a href="#architecture">Architecture</a>
          <a href="#demo">Interactive Demo</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/login" className="btn btn--secondary btn--sm">
            Sign In
          </Link>
          <Link to="/dashboard" className="btn btn--primary btn--sm">
            Open Demo Dashboard
          </Link>
        </div>
      </div>
    </header>
  )
}

export function LandingPage() {
  return (
    <div className="landing">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <LandingHeader />

      <main id="main">
        {/* Hero Section */}
        <section className="landing__hero">
          <div className="landing__container">
            <p className="landing__eyebrow">
              <Sparkles
                size={14}
                aria-hidden="true"
                style={{ color: 'var(--primary)' }}
              />
              Modern SaaS Administration Platform
            </p>
            <h1 className="landing__title">
              Enterprise administration, engineered for the web.
            </h1>
            <p className="landing__lede">
              Trellis delivers a production-grade admin dashboard with full user
              management, product catalog, orders, projects, invoices, and analytics —
              backed by an in-process mock server with persistent browser storage.
            </p>
            <div className="landing__actions">
              <Link to="/dashboard" className="btn btn--primary btn--lg">
                Open Demo Dashboard
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link to="/login" className="btn btn--secondary btn--lg">
                <Lock size={15} aria-hidden="true" />
                Sign In to Workspace
              </Link>
            </div>

            {/* Product Preview UI Frame */}
            <div className="landing__preview-container" style={{ marginTop: 40 }}>
              <div
                style={{
                  background: 'var(--card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-lg)',
                  overflow: 'hidden',
                }}
              >
                {/* Browser-like window top bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 18px',
                    borderBottom: '1px solid var(--border)',
                    backgroundColor: 'var(--subtle)',
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                    }}
                  />
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#f59e0b',
                    }}
                  />
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                    }}
                  />
                  <span
                    style={{
                      marginLeft: 12,
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--muted-foreground)',
                      backgroundColor: 'var(--card)',
                      padding: '2px 12px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    https://trellis.demo/dashboard
                  </span>
                </div>
                <img
                  src="/preview.png"
                  alt="Trellis responsive SaaS administration platform interface preview"
                  width={1920}
                  height={935}
                  loading="eager"
                  className="landing__preview"
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="landing__section"
          aria-labelledby="features-title"
        >
          <div className="landing__container">
            <h2 id="features-title">Core Administration Modules</h2>
            <p className="landing__section-lede">
              Every workflow necessary for day-to-day operations, crafted with strict
              TypeScript and accessible UI primitives.
            </p>
            <ul className="landing__features">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <li key={title} className="landing__feature">
                  <Icon size={20} aria-hidden="true" className="landing__feature-icon" />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Architecture Section */}
        <section
          id="architecture"
          className="landing__section landing__section--alt"
          aria-labelledby="architecture-title"
        >
          <div className="landing__container">
            <h2 id="architecture-title">Frontend-Only Architecture</h2>
            <p className="landing__section-lede">
              Clean separation of concerns with unidirectional data flow and zero external
              dependencies.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 16,
                margin: '32px 0',
              }}
            >
              {ARCHITECTURE_STEPS.map((step) => (
                <div
                  key={step.step}
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px 16px',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-subtle)',
                      color: 'var(--primary-subtle-foreground)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      marginBottom: 10,
                    }}
                  >
                    {step.step}
                  </span>
                  <h4
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      margin: '0 0 4px',
                      color: 'var(--foreground)',
                    }}
                  >
                    {step.title}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--muted-foreground)',
                      margin: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
            <p
              className="landing__narrow landing__flow-note"
              style={{ textAlign: 'center', margin: '0 auto' }}
            >
              Because feature modules communicate only through services, components remain
              completely decoupled from the data provider.
            </p>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo" className="landing__section" aria-labelledby="demo-title">
          <div className="landing__container landing__narrow">
            <h2 id="demo-title">Interactive Demonstration</h2>
            <p
              style={{
                lineHeight: 1.6,
                color: 'var(--muted-foreground)',
                fontSize: '1.02rem',
                marginBottom: 24,
              }}
            >
              Trellis functions out-of-the-box in any standard web browser or static
              hosting environment. Experience real-time search, multi-column sorting,
              pagination, record creation, updates, and deletion.
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                backgroundColor: 'var(--subtle)',
                padding: '20px 24px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                marginBottom: 28,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                  Pre-configured demo account: <code>admin@trellis.demo</code> /{' '}
                  <code>TrellisDemo123</code>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                  Deterministic initial seed dataset with 44 users, 33 products, 72
                  orders, and 30 projects
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                  State persistence across page reloads with one-click data reset in
                  Settings
                </span>
              </div>
            </div>
            <div className="landing__actions landing__actions--start">
              <Link to="/dashboard" className="btn btn--primary btn--lg">
                Launch Trellis Dashboard
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link to="/login" className="btn btn--secondary btn--lg">
                Sign In Screen
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="landing__section landing__section--alt"
          aria-labelledby="faq-title"
        >
          <div className="landing__container landing__narrow">
            <h2 id="faq-title">Frequently Asked Questions</h2>
            {FAQ_ITEMS.map(({ question, answer }) => (
              <div key={question} className="landing__faq-item">
                <h3>{question}</h3>
                <p>{answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="landing__container landing__footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrellisLogo size={24} subtitle="Admin" />
            <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
              &copy; {new Date().getFullYear()} Trellis. Released under the MIT License.
            </span>
          </div>
          <nav aria-label="Footer" className="landing__footer-nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/login">Sign In</Link>
            <a href="#features">Features</a>
            <a href="#architecture">Architecture</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
