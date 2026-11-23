import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/data/mock-server/db'
import { STORAGE_KEYS } from '@/config/app'

describe('mock database persistence and recovery', () => {
  beforeEach(() => {
    db.reset()
    window.localStorage.clear()
  })

  it('initializes with seed records', () => {
    expect(db.users.length).toBeGreaterThan(0)
    expect(db.products.length).toBeGreaterThan(0)
    expect(db.orders.length).toBeGreaterThan(0)
  })

  it('persists changes to localStorage when db.save() is called', () => {
    const initialUserCount = db.users.length
    db.users.unshift({
      id: 'usr_test_999',
      name: 'Test Persistence User',
      email: 'test.persist@trellis.demo',
      role: 'member',
      status: 'active',
      avatarUrl: null,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    db.save()

    const raw = window.localStorage.getItem(STORAGE_KEYS.mockDb)
    expect(raw).not.toBeNull()

    const parsed = JSON.parse(raw!) as { users: Array<{ id: string }> }
    expect(parsed.users).toHaveLength(initialUserCount + 1)
    expect(parsed.users[0].id).toBe('usr_test_999')
  })

  it('resets demo data cleanly and removes persisted storage', () => {
    db.users.unshift({
      id: 'usr_temp_123',
      name: 'Temporary User',
      email: 'temp@trellis.demo',
      role: 'viewer',
      status: 'invited',
      avatarUrl: null,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    db.save()
    expect(window.localStorage.getItem(STORAGE_KEYS.mockDb)).not.toBeNull()

    db.reset()
    expect(window.localStorage.getItem(STORAGE_KEYS.mockDb)).toBeNull()
    expect(db.users.find((u) => u.id === 'usr_temp_123')).toBeUndefined()
  })
})
