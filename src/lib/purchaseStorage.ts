const PURCHASE_KEY = 'onto:vplay:purchase:v1'
type StorageProvider = () => Pick<Storage, 'getItem' | 'setItem'>
const browserStorage: StorageProvider = () => window.localStorage

export function validTransactionId(value: unknown): value is string {
  return typeof value === 'string' && /^txn_[a-zA-Z0-9]{1,100}$/.test(value)
}

// This is a recovery reference, never proof of entitlement. The Worker checks it.
export function loadPurchase(storage: StorageProvider = browserStorage, environment: 'live' | 'sandbox' = 'live'): string {
  try {
    const value = storage().getItem(environment === 'sandbox' ? `${PURCHASE_KEY}:sandbox` : PURCHASE_KEY)
    return validTransactionId(value) ? value : ''
  } catch { return '' }
}

export function savePurchase(transactionId: string, storage: StorageProvider = browserStorage, environment: 'live' | 'sandbox' = 'live'): boolean {
  if (!validTransactionId(transactionId)) return false
  try { storage().setItem(environment === 'sandbox' ? `${PURCHASE_KEY}:sandbox` : PURCHASE_KEY, transactionId); return true }
  catch { return false }
}
