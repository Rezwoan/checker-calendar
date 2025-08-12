import React, { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import * as gist from '../lib/gistSync'

export default function Settings() {
  // Zustand state (methods come from the store slice)
  const store = useAppStore()

  // Local UI state
  const [token, setToken] = useState(localStorage.getItem('gh_token') || '')
  const [gistId, setGistId] = useState(localStorage.getItem('gh_gist') || '')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const saveLocal = () => {
    localStorage.setItem('gh_token', token.trim())
    localStorage.setItem('gh_gist', gistId.trim())
    setMsg('Saved locally (stored only in this browser).')
  }

  const doUpload = async () => {
    try {
      setBusy(true); setMsg('')
      // IMPORTANT: get a full snapshot from Zustand (not from the hook value)
      const snapshot = useAppStore.getState()
      const content = JSON.stringify(snapshot, null, 2)
      const res = await gist.upsertGist({ token, gistId, content })
      localStorage.setItem('gh_gist', res.gistId)
      setGistId(res.gistId)
      setMsg(`Uploaded to Gist • id: ${res.gistId}`)
    } catch (e) {
      setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }

  const doDownload = async () => {
    try {
      setBusy(true); setMsg('')
      const content = await gist.downloadGist({ token, gistId })
      await store.importJSON(JSON.parse(content))
      setMsg('Downloaded & applied from Gist.')
    } catch (e) {
      setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }

  const testToken = async () => {
    try {
      setBusy(true); setMsg('')
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `token ${token}` }
      })
      if (!res.ok) throw new Error('Token failed (check scope or value).')
      const u = await res.json()
      setMsg(`Token OK • @${u.login}`)
    } catch (e) {
      setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }

  const onImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    await store.importJSON(JSON.parse(text))
    setMsg('Imported from file.')
  }

  return (
    <div className="space-y-3">
      {/* Data export/import */}
      <div className="card p-4 space-y-3">
        <div className="text-lg font-semibold">Data</div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn" onClick={() => store.exportJSON()}>Export JSON</button>
          <label className="btn cursor-pointer">
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={onImport} />
          </label>
        </div>
        <p className="text-xs text-base-mut">Your data lives locally in this browser (IndexedDB). Export regularly if you want backups.</p>
      </div>

      {/* Gist sync */}
      <div className="card p-4 space-y-3">
        <div className="text-lg font-semibold">Optional GitHub Gist Sync</div>

        <div className="space-y-2">
          <input
            className="w-full bg-neutral-900 rounded-xl px-3 py-2"
            placeholder="GitHub Personal Access Token (gist scope)"
            value={token}
            onChange={(e)=>setToken(e.target.value)}
          />
          <input
            className="w-full bg-neutral-900 rounded-xl px-3 py-2"
            placeholder="Gist ID (auto-filled after first upload)"
            value={gistId}
            onChange={(e)=>setGistId(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button className="btn" onClick={saveLocal}>Save</button>
          <button className="btn" disabled={busy || !token} onClick={testToken}>Test Token</button>
          <button className="btn" disabled={busy || !token} onClick={doUpload}>Upload → Gist</button>
          <button className="btn" disabled={busy || !token || !gistId} onClick={doDownload}>Download ← Gist</button>
        </div>

        <div className="text-sm text-base-mut">{msg}</div>
        <p className="text-xs text-base-mut">Token & Gist ID are saved only in this browser (localStorage). Nothing is sent to any server except GitHub’s API when you click Upload/Download.</p>

        {/* Step-by-step instructions */}
        <div className="mt-3">
          <details className="open:bg-neutral-900/50 rounded-xl p-3 border border-base-line">
            <summary className="cursor-pointer text-sm font-medium">How to create a GitHub token (for Gist sync)</summary>
            <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-base-mut">
              <li>Sign in to your GitHub account.</li>
              <li>
                Go to <a className="underline" href="https://github.com/settings/tokens" target="_blank" rel="noreferrer">Settings → Developer settings → Personal access tokens</a>.
              </li>
              <li>
                Click <strong>“Tokens (classic)”</strong> → <strong>Generate new token (classic)</strong>.
              </li>
              <li>
                Give it a name (e.g., <em>Checker Calendar Gist</em>) and set an expiration you prefer.
              </li>
              <li>
                Under scopes, check only <strong>gist</strong>. (No other scopes needed.)
              </li>
              <li>
                Click <strong>Generate token</strong>, then copy the token string. You’ll only see it once.
              </li>
              <li>
                Paste the token above → click <strong>Save</strong> → optionally click <strong>Test Token</strong> to verify.
              </li>
              <li>
                Click <strong>Upload → Gist</strong> to create/update your private gist. The <em>Gist ID</em> field will auto-fill after the first upload.
              </li>
              <li>
                On another device/browser, paste the same token and Gist ID, then click <strong>Download ← Gist</strong> to sync.
              </li>
              <li>
                To revoke access later, delete the token at the same tokens page or delete the Gist.
              </li>
            </ol>
            <p className="text-xs mt-2">Prefer fine-grained tokens? You can create one limited to the Gists resource with read/write access; then use it here the same way.</p>
          </details>
        </div>
      </div>
    </div>
  )
}
