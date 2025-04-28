# InView Observer

**Generator 기반 Intersection Observer 라이브러리**  
여러 요소를 동시에 관찰할 수 있고, `throttle`, `debounce`, `once` 옵션을 지원합니다.

---

## Features

- Generator 기반 `for await...of` 사용
- 여러 개 Element 동시에 관리
- 자동 clean-up (unobserve, disconnect)
- `throttle`, `debounce`, `once` 옵션 제공
- Lightweight & Fast

---

## Install

```bash
npm install inview-observer
# or
yarn add inview-observer
```


## Usage
```typescript
import { createInViewGenerator } from 'inview-observer';

const { observe, unobserve, disconnect, generator } = createInViewGenerator({
  rootMargin: '100px',
  throttleMs: 200,
  once: false,
});

// 여러 요소 감시 가능
document.querySelectorAll('.observe-me').forEach((el) => observe(el));

(async () => {
  for await (const { inView, entry } of generator) {
    console.log('Element:', entry.target, 'In View:', inView);
  }
})();
```