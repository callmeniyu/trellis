import type { AppNotification } from '@/models/Notification'
import type { ActivityEvent } from '@/models/Dashboard'
import type { Invoice } from '@/models/Invoice'
import type { Order } from '@/models/Order'
import type { Product } from '@/models/Product'
import type { Project } from '@/models/Project'
import type { User } from '@/models/User'
import { STORAGE_KEYS } from '@/config/app'

import usersSeed from '@/data/db/users.json'
import productsSeed from '@/data/db/products.json'
import ordersSeed from '@/data/db/orders.json'
import projectsSeed from '@/data/db/projects.json'
import invoicesSeed from '@/data/db/invoices.json'
import notificationsSeed from '@/data/db/notifications.json'
import activitySeed from '@/data/db/activity.json'

/** The account behind the pinned demo login `admin@trellis.demo`. */
export const ADMIN_ID = 'usr_0001'

interface PersistedState {
  users: User[]
  products: Product[]
  orders: Order[]
  projects: Project[]
  invoices: Invoice[]
  notifications: AppNotification[]
  activity: ActivityEvent[]
  seq: number
}

function cloneSeeds(): PersistedState {
  return {
    users: JSON.parse(JSON.stringify(usersSeed)) as User[],
    products: JSON.parse(JSON.stringify(productsSeed)) as Product[],
    orders: JSON.parse(JSON.stringify(ordersSeed)) as Order[],
    projects: JSON.parse(JSON.stringify(projectsSeed)) as Project[],
    invoices: JSON.parse(JSON.stringify(invoicesSeed)) as Invoice[],
    notifications: JSON.parse(JSON.stringify(notificationsSeed)) as AppNotification[],
    activity: JSON.parse(JSON.stringify(activitySeed)) as ActivityEvent[],
    seq: 10_000,
  }
}

function loadInitialState(): PersistedState {
  if (typeof window === 'undefined' || !window.localStorage) {
    return cloneSeeds()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.mockDb)
    if (!raw) return cloneSeeds()

    const parsed = JSON.parse(raw) as Partial<PersistedState>
    // Validate structural integrity of each collection
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray(parsed.users) &&
      Array.isArray(parsed.products) &&
      Array.isArray(parsed.orders) &&
      Array.isArray(parsed.projects) &&
      Array.isArray(parsed.invoices) &&
      Array.isArray(parsed.notifications) &&
      Array.isArray(parsed.activity)
    ) {
      return {
        users: parsed.users,
        products: parsed.products,
        orders: parsed.orders,
        projects: parsed.projects,
        invoices: parsed.invoices,
        notifications: parsed.notifications,
        activity: parsed.activity,
        seq: typeof parsed.seq === 'number' ? parsed.seq : 10_000,
      }
    }

    // Corrupted state shape — recover by falling back to seeds
    console.warn('[Trellis DB] Corrupted stored data detected; restoring seeds.')
    window.localStorage.removeItem(STORAGE_KEYS.mockDb)
    return cloneSeeds()
  } catch {
    // Unparseable JSON or storage error — recover gracefully
    try {
      window.localStorage.removeItem(STORAGE_KEYS.mockDb)
    } catch {
      // Storage unavailable
    }
    return cloneSeeds()
  }
}

const initial = loadInitialState()
let seq = initial.seq

export const db = {
  users: initial.users,
  products: initial.products,
  orders: initial.orders,
  projects: initial.projects,
  invoices: initial.invoices,
  notifications: initial.notifications,
  activity: initial.activity,

  /** Monotonic id generator for created records. */
  nextId(prefix: string): string {
    seq += 1
    db.save()
    return `${prefix}_${seq}`
  },

  /** Persist the current in-memory collections to localStorage. */
  save(): void {
    if (typeof window === 'undefined' || !window.localStorage) return
    try {
      const payload: PersistedState = {
        users: db.users,
        products: db.products,
        orders: db.orders,
        projects: db.projects,
        invoices: db.invoices,
        notifications: db.notifications,
        activity: db.activity,
        seq,
      }
      window.localStorage.setItem(STORAGE_KEYS.mockDb, JSON.stringify(payload))
    } catch {
      // Graceful degradation when browser quota is exceeded or storage is disabled
    }
  },

  /** Restore pristine seed data and clear only Trellis mock DB storage. */
  reset(): void {
    const fresh = cloneSeeds()
    db.users = fresh.users
    db.products = fresh.products
    db.orders = fresh.orders
    db.projects = fresh.projects
    db.invoices = fresh.invoices
    db.notifications = fresh.notifications
    db.activity = fresh.activity
    seq = fresh.seq

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(STORAGE_KEYS.mockDb)
      } catch {
        // no-op
      }
    }
  },

  /** Indicates if demo mutations currently differ from default seed length */
  hasMutations(): boolean {
    return (
      typeof window !== 'undefined' &&
      window.localStorage &&
      window.localStorage.getItem(STORAGE_KEYS.mockDb) !== null
    )
  },
}

/** Issued bearer tokens for the current session (`token -> userId`). */
export const tokenStore = new Map<string, string>()
