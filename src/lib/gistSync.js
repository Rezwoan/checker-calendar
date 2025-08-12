// Optional cross-device sync via GitHub Gist.
// Token is stored in localStorage by the Settings page.
const API = 'https://api.github.com'

export async function upsertGist({ token, gistId, filename = 'checker-data.json', content }) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `token ${token}`
    }
    if (gistId) {
        const res = await fetch(`${API}/gists/${gistId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ files: { [filename]: { content } } })
        })
        if (!res.ok) throw new Error('Failed to update gist')
        const data = await res.json()
        return { gistId: data.id, url: data.html_url }
    } else {
        const res = await fetch(`${API}/gists`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ description: 'Checker Calendar Sync', public: false, files: { [filename]: { content } } })
        })
        if (!res.ok) throw new Error('Failed to create gist')
        const data = await res.json()
        return { gistId: data.id, url: data.html_url }
    }
}

export async function downloadGist({ token, gistId, filename = 'checker-data.json' }) {
    const res = await fetch(`${API}/gists/${gistId}`, {
        headers: { 'Authorization': `token ${token}` }
    })
    if (!res.ok) throw new Error('Failed to fetch gist')
    const data = await res.json()
    const file = data.files[filename]
    if (!file) throw new Error('File not found in gist')
    return file.content
}
