import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as db from '../lib/db'
import { startOfToday, toISODate } from '../lib/date'

const todayISO = toISODate(startOfToday())

export const useAppStore = create(
    persist(
        (set, get) => ({
            tabs: [],                 // [{id, name, order, emoji}]
            activeTabId: null,
            // checks: { [tabId]: { [isoDate]: { checked, note, emoji } } }
            checks: {},
            history: [],
            createdAt: new Date().toISOString(),

            load: async () => {
                const payload = await db.loadAll()
                if (payload) set(payload)

                if (!get().tabs.length) {
                    // New users start with a single Calendar tab
                    const t = { id: crypto.randomUUID(), name: 'Calendar', order: 0, emoji: '📅' }
                    set({ tabs: [t], activeTabId: t.id })
                    get().save()
                } else if (!get().activeTabId) {
                    set({ activeTabId: get().tabs[0].id })
                }
            },

            setActiveTab: (id) => set({ activeTabId: id }),

            addTab: (name, emoji = '✅') => {
                const tab = { id: crypto.randomUUID(), name, order: get().tabs.length, emoji }
                set({ tabs: [...get().tabs, tab], activeTabId: tab.id })
                get().save('addTab', { tab })
            },

            removeTab: (id) => {
                const tabs = get().tabs.filter(t => t.id !== id).map((t, i) => ({ ...t, order: i }))
                const checks = { ...get().checks }
                delete checks[id]
                set({ tabs, checks, activeTabId: tabs[0]?.id || null })
                get().save('removeTab', { id })
            },

            renameTab: (id, name) => {
                set({ tabs: get().tabs.map(t => t.id === id ? { ...t, name } : t) })
                get().save('renameTab', { id, name })
            },

            setTabEmoji: (id, emoji) => {
                set({ tabs: get().tabs.map(t => t.id === id ? { ...t, emoji } : t) })
                get().save('setTabEmoji', { id, emoji })
            },

            reorderTabs: (orderedIds) => {
                const map = new Map(orderedIds.map((id, i) => [id, i]))
                set({
                    tabs: get().tabs.map(t => ({ ...t, order: map.get(t.id) })).sort((a, b) => a.order - b.order)
                })
                get().save('reorderTabs', { orderedIds })
            },

            moveTabUp: (id) => {
                const tabs = [...get().tabs].sort((a, b) => a.order - b.order)
                const idx = tabs.findIndex(t => t.id === id)
                if (idx <= 0) return
                    ;[tabs[idx - 1].order, tabs[idx].order] = [tabs[idx].order, tabs[idx - 1].order]
                set({ tabs: tabs.sort((a, b) => a.order - b.order) })
                get().save('reorderTabs', { orderedIds: tabs.map(t => t.id) })
            },

            moveTabDown: (id) => {
                const tabs = [...get().tabs].sort((a, b) => a.order - b.order)
                const idx = tabs.findIndex(t => t.id === id)
                if (idx === -1 || idx === tabs.length - 1) return
                    ;[tabs[idx + 1].order, tabs[idx].order] = [tabs[idx].order, tabs[idx + 1].order]
                set({ tabs: tabs.sort((a, b) => a.order - b.order) })
                get().save('reorderTabs', { orderedIds: tabs.map(t => t.id) })
            },

            toggleCheck: (dateISO = todayISO) => {
                const tabId = get().activeTabId
                if (!tabId) return
                const tabChecks = { ...(get().checks[tabId] || {}) }
                const existing = tabChecks[dateISO] || { checked: false, note: '', emoji: '' }
                const updated = { ...existing, checked: !existing.checked }
                tabChecks[dateISO] = updated
                set({ checks: { ...get().checks, [tabId]: tabChecks } })
                get().save(updated.checked ? 'checked' : 'unchecked', { tabId, date: dateISO })
            },

            setNote: (dateISO, note, emoji = '') => {
                const tabId = get().activeTabId
                const tabChecks = { ...(get().checks[tabId] || {}) }
                const existing = tabChecks[dateISO] || { checked: false, note: '', emoji: '' }
                tabChecks[dateISO] = { ...existing, note, emoji }
                set({ checks: { ...get().checks, [tabId]: tabChecks } })
                get().save('note', { tabId, date: dateISO, note, emoji })
            },

            save: async (action = 'save', details = {}) => {
                const state = get()
                const payload = {
                    tabs: state.tabs,
                    activeTabId: state.activeTabId,
                    checks: state.checks,
                    history: [{ id: crypto.randomUUID(), ts: Date.now(), action, ...details }, ...state.history].slice(0, 500),
                    createdAt: state.createdAt
                }
                set(payload)
                await db.saveAll(payload)
            },

            exportJSON: () => db.exportJSON(get()),
            importJSON: async (json) => {
                set(json)
                await db.saveAll(json)
            }
        }),
        { name: 'checker-calendar' }
    )
)
