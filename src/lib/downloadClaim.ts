type Claim = { ok?: boolean; pending?: boolean; downloadUrl?: string; licenseKey?: string; error?: string }
type Options = {
  fetcher?: typeof fetch
  now?: () => number
  sleep?: (ms: number) => Promise<void>
  onProgress?: (message: string) => void
  token?: string
}

// Checkout completion can precede the verified webhook and KV visibility.
// Poll with a bounded backoff, not a short fixed attempt count.
export async function waitForDownload(worker: string, transactionId: string, newPurchase: boolean, options: Options = {}): Promise<Claim> {
  const fetcher = options.fetcher || fetch
  const now = options.now || Date.now
  const sleep = options.sleep || ((ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms)))
  const deadline = now() + (newPurchase ? 180000 : 90000)
  let attempt = 0
  let pending = false
  while (now() < deadline) {
    let response: Response
    let result: Claim
    try {
      response = await fetcher(`${worker}/claim`, {
        method: 'POST', headers: { 'content-type': 'application/json', ...(options.token ? { authorization: `Bearer ${options.token}` } : {}) },
        body: JSON.stringify({ transactionId }),
        signal: AbortSignal.timeout(Math.max(1, Math.min(15000, deadline - now()))),
      })
      result = await response.json()
    } catch {
      options.onProgress?.('Connection interrupted—retrying your download automatically. No new purchase is needed.')
      await sleep(Math.min(10000, Math.max(0, deadline - now())))
      continue
    }
    if (response.ok && result.ok && result.downloadUrl) return result
    pending = result.pending === true
    if (!pending && response.status < 500 && response.status !== 429) {
      throw new Error(result.error || `Download verification failed (${response.status}). Contact support with your receipt.`)
    }
    options.onProgress?.(pending
      ? 'Payment received—waiting for purchase verification. Your download will start automatically. Please keep this page open.'
      : 'The download service is busy—retrying automatically. No new purchase is needed.')
    const delay = Math.min(10000, 2000 * 2 ** Math.min(attempt++, 3), Math.max(0, deadline - now()))
    await sleep(delay)
  }
  throw new Error(pending
    ? 'Your purchase is still being verified. It is saved in this browser. Close this message and use Download Again shortly—do not pay again.'
    : 'The download service could not be reached in time. Your purchase is saved. Close this message and try Download Again; no new payment is needed.')
}
