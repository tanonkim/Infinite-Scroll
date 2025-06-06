/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function createInViewGenerator(options = {}) {
    let resolveNextEntry;
    let lastTrigger = 0;
    const observedElements = new Set();
    let debounceTimeout = null;
    const generator = (function () {
        return __asyncGenerator(this, arguments, function* () {
            while (true) {
                const result = yield __await(new Promise((res) => {
                    resolveNextEntry = res;
                }));
                yield yield __await(result);
            }
        });
    })();
    const observer = new IntersectionObserver((entries) => {
        const now = Date.now();
        entries.forEach((entry) => {
            const inView = entry.isIntersecting;
            if (options.once && inView) {
                observer.unobserve(entry.target);
                observedElements.delete(entry.target);
            }
            if (options.throttleMs) {
                if (now - lastTrigger < options.throttleMs)
                    return;
                lastTrigger = now;
            }
            if (options.debounceMs) {
                if (debounceTimeout)
                    clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    resolveNextEntry === null || resolveNextEntry === void 0 ? void 0 : resolveNextEntry({ entry, inView });
                }, options.debounceMs);
            }
            else {
                resolveNextEntry === null || resolveNextEntry === void 0 ? void 0 : resolveNextEntry({ entry, inView });
            }
        });
    }, {
        root: options.root,
        rootMargin: options.rootMargin,
        threshold: options.threshold,
    });
    function observe(element) {
        observer.observe(element);
        observedElements.add(element);
    }
    function unobserve(element) {
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

export { createInViewGenerator };
//# sourceMappingURL=inview-observer.js.map
