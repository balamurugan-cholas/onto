export function getPaddleConfig(mode: string, sandboxWorker = '') {
  const sandbox = mode === 'sandbox'
  const liveWorker = 'https://vplay-download.balamuruganofficial3.workers.dev'
  const worker = sandboxWorker.trim().replace(/\/$/, '')
  if (sandbox && worker && (!worker.startsWith('https://') || worker === liveWorker)) {
    throw new Error('Sandbox must use a separate HTTPS Worker, never the live Worker.')
  }
  return {
    sandbox,
    environment: sandbox ? 'sandbox' as const : 'live' as const,
    token: sandbox ? 'test_5b12816b8b46c3cb81bff67785c' : 'live_54ff1764490ca5baad198bbae59',
    priceId: sandbox ? 'pri_01m14cd2ca834jewqsqt75w1sz' : 'pri_01m15mhh168qw8gxjs6fcb6mxw',
    workerUrl: sandbox ? worker : liveWorker,
    activationStorageKey: sandbox ? 'vplayActivationKey:sandbox' : 'vplayActivationKey',
  }
}
