export function fixEthereumConflict(): void {
  if (typeof window === 'undefined') return

  try {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum')
    if (descriptor && !descriptor.configurable) {
      Object.defineProperty(window, 'ethereum', {
        ...descriptor,
        configurable: true,
        writable: true,
      })
    }
  } catch {
    // silent
  }

  const orig = Object.defineProperty.bind(Object)
  Object.defineProperty = function <T>(
    obj: T,
    prop: PropertyKey,
    desc: PropertyDescriptor & ThisType<unknown>
  ): T {
    if ((obj as unknown) === window && prop === 'ethereum') {
      try {
        return orig(obj, prop, desc)
      } catch {
        return obj
      }
    }
    return orig(obj, prop, desc)
  }
}