// Переменные для отслеживания состояния
let chetForBlockNavig = false;

let degrees = 180;
let rotate = 0;

// Элементы DOM
const blockWithNavig = document.querySelector("#FuterPodNavig");

const listWithNavig = document.querySelector("#FuterPodListBlockNavig");

const strelka = document.querySelector("#Footerimg");

function Time(){
    interval = setInterval(()=>{
        return "none";
    }, 500)
}

// Функции для управления состоянием блоков
function toggleNavig() {
    chetForBlockNavig = !chetForBlockNavig;
    listWithNavig.style.display = chetForBlockNavig ? "flex" : Time();
    // Устанавливаем высоту равной полной высоте контента
    listWithNavig.style.height = chetForBlockNavig ? listWithNavig.scrollHeight + "px" : "0";

    rotate += degrees;
    strelka.style.transform = `rotate(${rotate}deg)`;
}

// Функция для управления обработчиками событий в зависимости от ширины экрана
function manageEventListeners() {
    if (window.innerWidth <= 767) {
        
        // Меньше или равно 767px — добавляем обработчики событий
        blockWithNavig.addEventListener("click", toggleNavig);

        // Скрываем блоки в зависимости от состояния
        listWithNavig.style.display = chetForBlockNavig ? "flex" : "none";

    } else {
        // Больше 767px — удаляем обработчики событий
        blockWithNavig.removeEventListener("click", toggleNavig);

        // Всегда отображаем блоки
        listWithNavig.style.display = "flex";

        // Сбрасываем состояния
        chetForBlockNavig = false;
    }
}
// Инициализация
manageEventListeners();
window.addEventListener("resize", manageEventListeners);
