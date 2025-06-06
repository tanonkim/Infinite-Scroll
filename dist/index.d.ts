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
export declare function createInViewGenerator(options?: ObserverOptions): {
    observe: (element: HTMLElement) => void;
    unobserve: (element: Element) => void;
    disconnect: () => void;
    generator: {};
};
//# sourceMappingURL=index.d.ts.map