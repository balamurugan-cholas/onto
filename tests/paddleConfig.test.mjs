import test from 'node:test'
import assert from 'node:assert/strict'
import { getPaddleConfig } from '../src/lib/paddleConfig.ts'
import { loadPurchase, savePurchase } from '../src/lib/purchaseStorage.ts'

test('production remains live and ignores sandbox Worker settings', () => {
  const config = getPaddleConfig('production', 'https://sandbox.example')
  assert.match(config.token, /^live_/)
  assert.equal(config.workerUrl, 'https://vplay-download.balamuruganofficial3.workers.dev')
})
test('sandbox uses supplied test credentials and has no live Worker fallback', () => {
  const config = getPaddleConfig('sandbox')
  assert.equal(config.token, 'test_5b12816b8b46c3cb81bff67785c')
  assert.equal(config.priceId, 'pri_01m14cd2ca834jewqsqt75w1sz')
  assert.equal(config.workerUrl, '')
  assert.throws(() => getPaddleConfig('sandbox', getPaddleConfig('production').workerUrl))
})
test('sandbox purchase references never replace live purchase references', () => {
  const values = new Map()
  const storage = () => ({ getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) })
  savePurchase('txn_live', storage)
  savePurchase('txn_test', storage, 'sandbox')
  assert.equal(loadPurchase(storage), 'txn_live')
  assert.equal(loadPurchase(storage, 'sandbox'), 'txn_test')
})
