const listElement = document.querySelector('#infinite-list');

let nextItem = 1;

// 20개 아이템 추가
const loadMore = function () {
    for (let index = 0; index < 20; index++) {
        let item = document.createElement('li');
        item.innerText = `Item #${nextItem++}`;
        listElement.appendChild(item);
    }
};

// ul리스트가 바닥까지 스크롤했는지 확인
listElement.addEventListener('scroll', function () {
    // 👇 여기서 scrollTop, clientHeight, scrollHeight 등은 모두 리플로우 유발 요소
    if (listElement.scrollTop + listElement.clientHeight >= listElement.scrollHeight) {
        console.log('this');
        loadMore();
    }
});

// 20개 가져오는 loadMore함수 실행
loadMore();
