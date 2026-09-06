import test from 'node:test'
import assert from 'node:assert/strict'
import { loadPurchase, savePurchase } from '../src/lib/purchaseStorage.ts'

test('purchase reference survives a fresh read after reload', () => {
  const values = new Map()
  const storage = () => ({ getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) })
  assert.equal(loadPurchase(storage), '')
  assert.equal(savePurchase('txn_purchased123', storage), true)
  assert.equal(loadPurchase(storage), 'txn_purchased123')
})
test('invalid saved data is ignored', () => {
  assert.equal(loadPurchase(() => ({ getItem: () => 'purchased=true', setItem() {} })), '')
})
test('disabled storage does not crash checkout or page initialization', () => {
  const blocked = () => { throw new Error('Storage denied') }
  assert.equal(loadPurchase(blocked), '')
  assert.equal(savePurchase('txn_purchased123', blocked), false)
})
