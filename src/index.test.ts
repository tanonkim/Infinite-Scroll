import { createInViewGenerator } from './index';

// IntersectionObserver Mock 정의
class IntersectionObserverMock {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  root: Element | Document | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
    if (options) {
      this.root = options.root ?? null;
      this.rootMargin = options.rootMargin ?? '';
      this.thresholds = Array.isArray(options.threshold)
        ? options.threshold
        : typeof options.threshold === 'number'
          ? [options.threshold]
          : [];
    }
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  observe = jest.fn((element: Element) => {
    // simulate intersection
    const entry = {
      target: element,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: {} as any,
      intersectionRect: {} as any,
      rootBounds: {} as any,
      time: Date.now(),
    };
    this.callback([entry] as any, this);
  });

  unobserve = jest.fn();
  disconnect = jest.fn();
}

// 글로벌 Mock 대체
(global as any).IntersectionObserver = IntersectionObserverMock as any;

describe('createInViewGenerator', () => {
  test('should observe elements and trigger generator', async () => {
    const { observe, generator } = createInViewGenerator();
    const div = document.createElement('div');
    document.body.appendChild(div);

    // 1. 먼저 generator.next() 실행 => resolveNextEntry 대기 상태
    const generatorPromise = generator.next();

    // 2. observe 시 바로 callback 호출 : IntersectionObserverMock.callback() 호출 => resolveNextEntry 호출
    observe(div);

    // 3. generator에서 값 수신 대기
    const result = await generatorPromise;
    const value = result.value as { inView: boolean; entry: { target: Element } };
    expect(value.inView).toBe(true);
    expect(value.entry.target).toBe(div);
  });
});
