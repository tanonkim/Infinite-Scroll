import ImageGrid from './ImageGrid';
import '@testing-library/jest-dom';

describe('ImageGrid.createImageGenerator', () => {
  test('배치 사이즈에 맞춰 제너레이터가 이미지를 잘 분할/실행해야 한다', () => {
    const images = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const grid = new ImageGrid({ batchSize: 2 });
    const generator = grid.createImageGenerator(images);
    expect(generator.next().value).toEqual(['a', 'b']);
    expect(generator.next().value).toEqual(['c', 'd']);
    expect(generator.next().value).toEqual(['e', 'f']);
    expect(generator.next().value).toEqual(['g']);
    expect(generator.next().done).toEqual(true);
  });
});

describe('ImageGrid.renderImages', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('주어진 src 배열의 length만큼 <img>요소를 생성한다', () => {
    const grid = new ImageGrid({ batchSize: 4 });
    const sample = ['url1', 'url2', 'url3'];

    (grid as any).renderImages(sample); // private 메서드라서 any를 통한 우회

    const imgs = document.body.getElementsByTagName('img');
    expect(imgs).toHaveLength(3);
    expect(imgs[0]).toHaveAttribute('src', 'url1');
    expect(imgs[1]).toHaveAttribute('src', 'url2');
    expect(imgs[2]).toHaveAttribute('src', 'url3');
  });
});
