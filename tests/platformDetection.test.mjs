import test from 'node:test'
import assert from 'node:assert/strict'
import { detectDownloadPlatform } from '../src/lib/platformDetection.ts'

test('detects Windows browsers', () => {
  assert.equal(detectDownloadPlatform({ platform: 'Win32', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }), 'windows')
})

test('detects macOS without guessing CPU architecture', () => {
  assert.equal(detectDownloadPlatform({ platform: 'MacIntel', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }), 'mac')
  assert.equal(detectDownloadPlatform({ platform: '', userAgent: '', userAgentData: { platform: 'macOS' } }), 'mac')
})

test('keeps an explicit fallback for unknown operating systems', () => {
  assert.equal(detectDownloadPlatform({ platform: 'Linux x86_64', userAgent: 'Mozilla/5.0 (X11; Linux x86_64)' }), null)
})
