import data from "./data";

export default class ImageGrid {
    batchSize: number;
    imageGenerator: Generator<any, void, unknown>;
    container: HTMLDivElement;
    observer: IntersectionObserver;

    constructor({ batchSize = 4 }) {
        this.batchSize = batchSize;
        this.imageGenerator = this.createImageGenerator(data.backgrounds.images);
        this.container = this.createContainer();
        this.observer = this.createObserver();
        this.loadNextBatch(); // 초기 이미지 로딩
    }

    *createImageGenerator(images : string[]) {
        for (let index = 0; index < images.length; index += this.batchSize) {
            yield images.slice(index, index + this.batchSize);
        }
    }
    createContainer() {
        const container = document.createElement('div');
        container.classList.add('image-grid');
        document.body.appendChild(container);
        return container;
    }
    createObserver() {
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
                // root: '100px',
                // threshold: 0.1,
            }
        );
    }
    loadNextBatch() {
        const next = this.imageGenerator.next();
        if (next.done) return;

        next.value.forEach((src : string) => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'avatar';
            this.container.appendChild(img);
        });

        const lastImg = this.container.lastElementChild;
        if (lastImg) {
            this.observer.observe(lastImg);
        }
    }
}
