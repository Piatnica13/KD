(() => {
    let con1div = document.querySelector("#Con1Img");
    let con1imgs = document.querySelectorAll(".Con1imgs");
    let con1chet = 0

    function Con1(){
        const count = con1imgs.length;
        const widthcon1div = con1div.offsetWidth;

        if (con1chet == count - 1){
            con1div.style.transition= "transform 0s ease-in-out";
            con1div.style.transform = `translateX(0)`;
            con1chet = 0;
            setTimeout(() => {
                con1div.style.transition= "transform 0.4s ease-in-out";
                con1div.style.transform = `translateX(-${widthcon1div}px)`;
            }, 1);
            setTimeout(() => {
                con1chet++;
            }, 1);
        }
        else{
            con1div.style.transition= "transform 0.4s ease-in-out";
            con1chet++;
        }
        con1div.style.transform = `translateX(-${widthcon1div * con1chet}px)`;
    }
    setInterval(() => {
        Con1();
    }, 5000);

    let back = document.querySelector("#con4galochkaBack"); 
    let lets = document.querySelector("#con4galochkaLet");

    let con4part = document.querySelector("#Con4Part1");

    lets.addEventListener("click", () => {
        let con4Width = con4part.offsetWidth;
        con4part.scrollLeft += con4Width - 14.45;
        back.style.pointerEvents= `none`;
        lets.style.pointerEvents= `none`;
        setTimeout(() => {
            back.style.pointerEvents= `all`;
            lets.style.pointerEvents= `all`;
        }, 400);
    })
    back.addEventListener("click", () => {
        let con4Width = con4part.offsetWidth;
        con4part.scrollLeft -= con4Width - 14.45;
        back.style.pointerEvents= `none`;
        lets.style.pointerEvents= `none`;
        setTimeout(() => {
            back.style.pointerEvents= `all`;
            lets.style.pointerEvents= `all`;
        }, 400);
    })

    let masFromCon4 = [
        {title: "Комфорт", info: "Лёгкий и удобный, он не ощущается на запястье"},
        {title: "Долговеч&shy;ность", info: "Мы используем качественные материалы"},
        {title: "Минимализм", info: "Лаконичный дизайн, который подходит к любому образу"},
        {title: "Символика", info: "Браслет — это больше, чем украшение"},
        {title: "Надежность", info: "Каждый браслет создан с заботой"},
    ];

    function con4func(mas){
        con4part.innerHTML += 
        `
        <div class="Con4Divs" data-aos="fade-up" data-aos-delay="0">
          <h3 class="Con4Text Con4TextGl">${mas.title}</h3>
          <h4 class="Con4Text Con4TextVt">
            ${mas.info}
          </h4>
        </div>
        `;
    };

    masFromCon4.forEach((e)=>{
        con4func(e);
    })

    let masFromCon5 = [
        {title: "Кулоны", a_filter: "/shop?filter=Кулон", a_img: "/static/image/con5/img4.webp"},
        {title: "Монетки", a_filter: "/shop?filter=Монеточка", a_img: "/static/image/con5/img3.webp"},
        {title: "Бегунки", a_filter: "/shop?filter=Бегунок", a_img: "/static/image/con5/img1.webp"},
        {title: "Колье", a_filter: "/shop?filter=Колье", a_img: "/static/image/con5/img2.webp"}
        // {title: "Спортивных", a_filter: "/shop?filter=Спорт,Сила и успех,Минимализм и красота", a_img: "/static/image/productImgs/raketka/img2.webp"},
        // {title: "Пушистых", a_filter: "/shop?filter=Любовь к животным,Природа,Мир и свобода", a_img: "/static/image/productImgs/lapka/img1.webp"}
    ]

    function con5func(mas){
        let con5 = document.querySelector("#con5grid");
        con5.innerHTML += `
        <div class="con5Divs" data-aos="fade-up" data-aos-delay="100">
          <a href="${mas.a_filter}" class="con5divImgs">
            <p class="con5Text">${mas.title}</p>
            <img src="${mas.a_img}" class="con5Imgs">
          </a>
        </div>
        `
    }

    masFromCon5.forEach((e)=>{
        con5func(e);
    })

    let con6 = document.querySelector("#con6wrapper");

    let masFromCon6 = [
        { name: "Оксана", text: "Супер браслетик внутри ещё пакетик со сменными верёвочками, а как шикарно оформлен на подарок если вообще шикарно."},
        { name: "Эльнура", text: "Заказываю не первый раз и знаю что не последний, доверяю полностью. Красота." },
        { name: "Елена", text: "Очень красиво и утонченно! Спасибо за такие качественные изделия, не первый раз беру - все на высшем уровне." },
        { name: "Мария", text: "Пришло на день раньше, очень красиво упаковано, сам браслет уникальный, спасибо!" },
        { name: "Екатерина", text: "Прекрасное изделие и упаковка и вообще сплошной кайф) И себе и на подарок, очень рекомендую!" },
        { name: "Инна", text: "Все понравилось - как упаковано, как преподнесено, описание. Если честно, понравилось описание - и решила именно солнце взять родному человеку. Очень разумный посыл." },
        { name: "Алёна", text: "Брала для себя, но и в подарок отличный вариант. Красиво упаковано в конверт, добавлена открытка. Само изделие как на фото. Также дополнительно были положены ниточки для браслета белого и красного цвета." },
        { name: "Александр", text: "Брал на подарок жене, очень понравилось." },
        { name: "Наталия", text: "Большое спасибо! Товар доставлен в срок. Очень красиво упаковано, все продуманно творчески. Приятный подарок, очень красиво."},
        { name: "Ольга", text: "Браслет просто волшебный, это то о чём я мечтала. Спасибо! Рекомендую, всё быстро и с особым вниманием к клиенту."}
    ];

    function con6func(mas){
        con6.innerHTML += `
        <div class="con6Divs">
            <div class="con6head">
                <p class="con6name">${mas.name}</p>
                <ins style="color: yellow">★★★★★</ins>
            </div>
            <div class="con6main">
                <p class="con6text">${mas.text}</p>
            </div>
        </div>
        `
    }

    masFromCon6.forEach((e)=>{
        con6func(e);
    })
    masFromCon6.forEach((e)=>{
        con6func(e);
    })

    masFromCon6.forEach((e)=>{
        con6func(e);
    })

    // Контейнер 3, логика кнопки ещё
    function con3(){
        if (window.innerWidth > 500){
            const moreBth = document.querySelector("#con3more");
            const moreCard = document.querySelectorAll(".con3invis");
            const moreCatalog = document.querySelector("#con3catalog");
            const moreCatalogDiv = document.querySelector("#con3catalogDiv");
        
            moreCard.forEach(e => {
                e.style.display = "none";
            });
            moreCatalog.style.display = "none";
            moreCatalogDiv.style.display = "none";

            moreBth.style.display = "flex";
        
            moreBth.addEventListener("click", ()=>{
                moreBth.style.display = "none";
            
                moreCard.forEach(e => {
                    e.style.display = "flex";
                })
                moreCatalog.style.display = "flex";
                moreCatalogDiv.style.display = "flex";
            })
        }
        else{
            const moreBth = document.querySelector("#con3more");
            const moreCard = document.querySelectorAll(".con3invis");
            const moreCatalog = document.querySelector("#con3catalog");
            const moreCatalogDiv = document.querySelector("#con3catalogDiv");
            moreBth.style.display = "none";
            moreCard.forEach(e => {
                if (e.nodeName != "A"){
                    e.style.display = "flex";
                }
            });
            moreCatalog.style.display = "flex";
            moreCatalogDiv.style.display = "flex";
        }
    }
    con3()

    window.addEventListener("resize", con3);
})();
