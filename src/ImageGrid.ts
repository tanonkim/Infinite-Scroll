interface ImageData {
  backgrounds: {
    images: string[];
  };
}

export default class ImageGrid {
  batchSize: number;
  imageGenerator!: Generator<string[], void, unknown>;
  container: HTMLDivElement;
  observer: IntersectionObserver;
  images: string[] = [];
  loading: boolean = false;

  constructor({ batchSize = 4 }) {
    this.batchSize = batchSize;
    this.container = this.createContainer();
    this.observer = this.createObserver();
  }

  async loadImages() {
    if (this.loading) return;

    this.loading = true;
    try {
      const response = await fetch('https://api.example.com/images');
      const data: ImageData = await response.json();
      console.log('Fetched data:', data);

      this.images = data.backgrounds.images;
      this.imageGenerator = this.createImageGenerator(this.images);
      this.loadNextBatch();
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      this.loading = false;
    }
  }

  *createImageGenerator(images: string[]): Generator<string[], void, unknown> {
    for (let index = 0; index < images.length; index += this.batchSize) {
      yield images.slice(index, index + this.batchSize);
    }
  }

  createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('image-grid');
    document.body.appendChild(container);
    return container;
  }

  createObserver(): IntersectionObserver {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.observer.unobserve(entry.target);
            this.loadNextBatch();
          }
        });
      },
      {
        rootMargin: '200px',
      },
    );
  }

  loadNextBatch(): void {
    const next = this.imageGenerator?.next();
    if (next?.done) {
      console.log('All images loaded');
      return;
    }

    if (next?.value) {
      console.log('Loading next batch:', next.value);
      next.value.forEach((src: string) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `avatar-${src.split('img=')[1]}`;
        img.className = 'avatar';
        img.loading = 'lazy';

        img.onerror = () => {
          console.error(`Image Loading Fail : ${src}`);
          img.src = 'https://picsum.photos/200'; // 대체 이미지
        };

        this.container.appendChild(img);
      });

      const lastImg = this.container.lastElementChild;
      if (lastImg) {
        this.observer.observe(lastImg);
      }
    }
  }
}
