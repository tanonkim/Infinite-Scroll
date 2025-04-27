import { worker } from './mocks/browser';
import ImageGrid from './ImageGrid';
import './style.css';

async function init() {
  // MSW 워커 시작
  await worker.start({
    onUnhandledRequest: 'bypass', // 정의되지 않은 요청은 무시
  });

  console.log('MSW initialized 확인');

  // 이미지 그리드 초기화
  const grid = new ImageGrid({ batchSize: 4 });
  await grid.loadImages();
}

init().catch(console.error);
