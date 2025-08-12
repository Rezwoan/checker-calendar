// Simple install manager for the PWA "Add to Home Screen" prompt
let deferredPrompt = null

// detect installed (desktop/Android); iOS uses navigator.standalone
let installed =
    (typeof window !== 'undefined' &&
        (window.matchMedia?.('(display-mode: standalone)').matches ||
            window.navigator.standalone === true)) || false

const listeners = new Set()
const emit = () => listeners.forEach((cb) => cb(getState()))

export const getState = () => ({
    canInstall: !!deferredPrompt,
    installed
})

export const subscribe = (cb) => {
    listeners.add(cb)
    // push current state immediately
    cb(getState())
    return () => listeners.delete(cb)
}

export const promptInstall = async () => {
    if (!deferredPrompt) throw new Error('Install prompt not available')
    deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    // Chrome sets outcome: 'accepted' | 'dismissed'
    deferredPrompt = null
    emit()
    return choice
}

// Auto-init on import
if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
        // Stop Chrome from auto-showing mini-infobar
        e.preventDefault()
        deferredPrompt = e
        emit()
    })

    window.addEventListener('appinstalled', () => {
        installed = true
        deferredPrompt = null
        emit()
    })
}
