const listElement = document.querySelector('#infinite-list');
const sentinel = document.querySelector('#sentinel');

let nextItem = 1;

const loadMore = function () {
    for (let index = 0; index < 20; index++) {
        let item = document.createElement('li');
        item.innerText = `Item #${nextItem++}`;
        listElement.appendChild(item);
    }
};

// 최초 로드
loadMore();

// InsersectionObserver 콜백
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            console.log('touch');
            if (entry.isIntersecting) {
                loadMore();
                listElement.appendChild(sentinel); // load한 후 아래에 sentinel 추가
            }
        });
    },
    {
        root: null, // 뷰포트 기준
        threshold: 0.1, // sentinel이 완전히 보일 때만
    }
);

// sentinel 감시 시작
observer.observe(sentinel);
