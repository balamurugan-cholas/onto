import test from 'node:test'
import assert from 'node:assert/strict'
import { waitForDownload } from '../src/lib/downloadClaim.ts'

function clock(fetcher) {
  let elapsed = 0
  const progress = []
  return { now: () => elapsed, sleep: async ms => { elapsed += ms }, fetcher,
    onProgress: message => progress.push(message), progress }
}
const pending = () => Response.json({ ok: false, pending: true }, { status: 404 })
const success = () => Response.json({ ok: true, downloadUrl: 'https://sandbox.example/download/test' })

test('automatic download waits past 60 seconds for webhook/KV visibility', async () => {
  let calls = 0
  const options = clock(async () => { calls++; return options.now() < 65000 ? pending() : success() })
  const result = await waitForDownload('https://sandbox.example', 'txn_test', true, options)
  assert.match(result.downloadUrl, /download/)
  assert.ok(options.now() >= 65000)
  assert.ok(calls < 15)
  assert.match(options.progress[0], /automatically/)
})
test('pending timeout explains verification and never asks for another payment', async () => {
  const options = clock(async () => pending())
  await assert.rejects(waitForDownload('https://sandbox.example', 'txn_test', true, options), /still being verified/)
  assert.equal(options.now(), 180000)
})
test('connection errors and server errors retry before success', async () => {
  let calls = 0
  const options = clock(async () => {
    calls++
    if (calls === 1) throw new TypeError('Network error')
    return calls === 2 ? Response.json({}, { status: 503 }) : success()
  })
  assert.ok((await waitForDownload('https://sandbox.example', 'txn_test', true, options)).downloadUrl)
  assert.equal(calls, 3)
})
test('revoked purchases stop immediately without issuing a download', async () => {
  const options = clock(async () => Response.json({ error: 'Purchase revoked' }, { status: 403 }))
  await assert.rejects(waitForDownload('https://sandbox.example', 'txn_test', true, options), /revoked/)
  assert.equal(options.now(), 0)
})
test('Download Again also tolerates delayed verification', async () => {
  const options = clock(async () => options.now() < 65000 ? pending() : success())
  assert.ok((await waitForDownload('https://sandbox.example', 'txn_test', false, options)).downloadUrl)
})
