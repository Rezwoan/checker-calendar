import localforage from 'localforage'

localforage.config({ name: 'checker-calendar', storeName: 'state' })

export async function loadAll() {
    return await localforage.getItem('app-state')
}

export async function saveAll(payload) {
    return await localforage.setItem('app-state', payload)
}

export function exportJSON(state) {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `checker-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
}
