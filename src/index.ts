export interface InViewEntry {
  entry: IntersectionObserverEntry;
  inView: boolean;
}

export interface ObserverOptions {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  throttleMs?: number;
  debounceMs?: number;
  once?: boolean;
}

export function createInViewGenerator(options: ObserverOptions = {}) {
  let resolveNextEntry: ((value: InViewEntry) => void) | undefined;
  let lastTrigger = 0;
  const observedElements = new Set<Element>();
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  const generator = (async function* () {
    while (true) {
      const result = await new Promise((res) => {
        resolveNextEntry = res;
      });
      yield result;
    }
  })();

  const observer = new IntersectionObserver(
    (entries) => {
      const now = Date.now();

      entries.forEach((entry) => {
        const inView = entry.isIntersecting;

        if (options.once && inView) {
          observer.unobserve(entry.target);
          observedElements.delete(entry.target);
        }

        if (options.throttleMs) {
          if (now - lastTrigger < options.throttleMs) return;
          lastTrigger = now;
        }

        if (options.debounceMs) {
          if (debounceTimeout) clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => {
            resolveNextEntry?.({ entry, inView });
          }, options.debounceMs);
        } else {
          resolveNextEntry?.({ entry, inView });
        }
      });
    },
    {
      root: options.root,
      rootMargin: options.rootMargin,
      threshold: options.threshold,
    },
  );

  function observe(element: HTMLElement) {
    observer.observe(element);
    observedElements.add(element);
  }

  function unobserve(element: Element) {
    observer.unobserve(element);
    observedElements.delete(element);
  }

  function disconnect() {
    observer.disconnect();
    observedElements.clear();
  }

  return {
    observe,
    unobserve,
    disconnect,
    generator,
  };
}
