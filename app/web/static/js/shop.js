let OpacityBth = document.querySelector("#shopBthMore")
let DivOpacityBth = document.querySelector("#shopDivBthMore")
let DivFilter = document.querySelector("#Divfiltr");
let BockMenu = document.querySelector("#BockMenu");
let CloseBth = document.querySelector("#BockMenuTitleImg")
let SbrosBth = document.querySelector("#BockMenuBthSbros")
let Darker = document.querySelector("#Darker")

let allProducts = [];

window.addEventListener('DOMContentLoaded', loadProducts);

async function loadProducts() {
  const response = await fetch('/api/products');
  allProducts = await response.json();

  FuncFilters(true);
  
  updateIconsByTheme()
}


function FuncFilters(bool){
  
  setTimeout(() => {
    AOS.refreshHard();  // жесткий ресет — пересчитывает всё
  }, 100);
  
  BockMenu.style.transform = "translateX(-1000px)";
  BockMenu.style.opacity = "0";
  Darker.style.background = "rgba(0, 0, 0, 0)";
  
  const selectedFilters = {};
  
  document.querySelectorAll(".ShopFiltersRadio:checked").forEach((checkbox) => {
    const category = checkbox.dataset.category;
    const value = checkbox.dataset.value;
    
    if (!selectedFilters[category]) {
      selectedFilters[category] = [];
    }
    selectedFilters[category].push(value);
  });
  
  filterProducts(selectedFilters, bool);
};

function filterProducts(filters, bool) {
  let filteredProducts = allProducts;
  
  if (filters["Концепция"]) {
    filteredProducts = filteredProducts.filter(product =>
      filters["Концепция"].includes(product.concept)
    );
  }
  if (filters["Категория"]) {
    filteredProducts = filteredProducts.filter(product =>
      filters["Категория"].includes(product.category)
    );
  }
  if (filters["Цена"]){
    if (filters["Цена"] == "Больше 64000₸") {
      filteredProducts = filteredProducts.filter(product => product.price >= 64000);
    } 
    else if (filters["Цена"] == "40000₸ - 64000₸") {
      filteredProducts = filteredProducts.filter(product => product.price >= 40000 && product.price <= 64000);
    } 
    else if (filters["Цена"] == "10000₸ - 40000₸") {
      filteredProducts = filteredProducts.filter(product => product.price >= 10000 && product.price <= 40000);
    } 
    else if (filters["Цена"].includes("10000₸ - 40000₸") && filters["Цена"].includes("40000₸ - 64000₸") && filters["Цена"].includes("Больше 64000₸")) {
      filteredProducts = filteredProducts.filter(product => product.price >= 10000);
    }     
    else if (filters["Цена"].includes("10000₸ - 40000₸") && filters["Цена"].includes("40000₸ - 64000₸")) {
      filteredProducts = filteredProducts.filter(product => product.price >= 10000 && product.price <= 64000);
    } 
    else if (filters["Цена"].includes("10000₸ - 40000₸") && filters["Цена"].includes("Больше 64000₸")) {
      filteredProducts = filteredProducts.filter(product => product.price >= 10000 && product.price <= 40000 || product.price >= 64000);
    } 
    else if (filters["Цена"].includes("40000₸ - 64000₸") && filters["Цена"].includes("Больше 64000₸")) {
      filteredProducts = filteredProducts.filter(product => product.price >= 40000);
    }
  }
  if (filteredProducts.length <= 12){
    renderProducts(filteredProducts, bool);
    bthOpacity(false);
  }
  else{
    renderProducts(filteredProducts, bool);
    bthOpacity(true);
  }
}

function renderProducts(products, bool) {
  const productContainer = document.querySelector("#productGrid");
  productContainer.innerHTML = ""; // Очистка контейнера перед рендерингом
  if (bool == true){
    for (let i = 0; i < products.length && i < 12; i++){
      
      const productCard = `
      <article class="product-card" data-aos="fade-up" data-aos-delay="100">
      <a href="/product/${products[i].slug}" style="color: var(--black); text-decoration: none;">
      <img src="${products[i].image}" alt="${products[i].name}" class="product-image">
      <h2 class="product-title">${products[i].name}</h2>
      <div class="test">
      <h2 class="product-price">${products[i].price}&#8376;</h2>
      <div class="DivInfo">
      <img src = "/static/icon/black/sumka.png" data-icon="sumka.png" class = "Con2Icon" alt = "Сумка">
      <p class="BthInfo"><ins style="text-decoration: line"><span>Подробнее</span></ins></p>
      </div>
      </div>
      </a>
      </article>
      `;
      productContainer.innerHTML += productCard;
    }
  }
  else{
    for (let i = 0; i < products.length; i++){
      
      const productCard = `
      <article class="product-card" data-aos="fade-up" data-aos-delay="100">
      <a href="/product/${products[i].slug}" style="color: var(--black); text-decoration: none;">
      <img src="${products[i].image}" alt="${products[i].name}" class="product-image">
      <h2 class="product-title">${products[i].name}</h2>
      <div class="test">
      <h2 class="product-price">${products[i].price}&#8376;</h2>
      <div class="DivInfo">
      <img src = "/static/icon/black/sumka.png" data-icon="sumka.png" class = "Con2Icon" alt = "Сумка">
      <p class="BthInfo"><ins><span>Подробнее</span></ins></p>
      </div>
      </a>
      </div>
      </a>
      </article>
      `;
      productContainer.innerHTML += productCard;
    }
  }
}

let KnopkaShow = document.querySelector("#BockMenuDivBthShow");
KnopkaShow.addEventListener("click", () => {
  FuncFilters(true);       
});

class BockMenuTabs {
  constructor(MainTabsName, PodTabsName, Fid) {
    this.MainTabsName = MainTabsName;
    this.PodTabsName = PodTabsName;
    this.Fid = Fid;
  }
  
  MenuHtml() {
    let html = `
    <div class="ShopDivFilters">
    <div id="ShopDivId${this.MainTabsName}">
    <p class="ShopFiltersTitle">${this.MainTabsName}</p>
    </div>
    <ul class="ShopFiltersDivSpisok" id="ShopPodId${this.MainTabsName}">`;
    
    this.PodTabsName.forEach((PodName, index) => {
      const PodId = this.Fid[index] || index;
      html += `
      <li class="ShopFiltersPodSpisok">
      <label class="customCheckbox">
      <input class="ShopFiltersRadio" type="checkbox" data-category="${this.MainTabsName}" data-value="${PodName}" id="FiltersCheckBox${PodId}">
      <span></span>
      </label>
      <label for="FiltersCheckBox${PodId}" class="ShopFiltersItems">${PodName}</label>
      </li>`;
    });
    
    html += `</ul></div>`;
    return html;
  }
  
  renderTabs() {
    const BockMenuMain = document.querySelector("#BockMenuMain");
    if (BockMenuMain) {
      BockMenuMain.innerHTML += this.MenuHtml();
    } else {
      console.error("Элемент #BockMenuMain не найден на странице.");
    }
  }
}

// Пример использования
const myMenus = [
  new BockMenuTabs("Концепция", ["Путешествия и приключения", "Любовь и романтика", "Мир и свобода", "Сила и успех",  "Жизнь и процветание", "Духовность и вера", "Знаки зодиака", "Любовь и семья", "Спорт", "Любовь к животным", "Природа", "Музыка и искусство", "Минимализм и красота"], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]),
  new BockMenuTabs("Категория", ["Кулон", "Колье", "Бегунок", "Монеточка"], [14, 15, 16, 17]),
  new BockMenuTabs("Цена", ["10000&#8376; - 40000&#8376;", "40000&#8376; - 64000&#8376;", "Больше 64000&#8376;"], [18, 19, 20]),
];

// Рендеринг вкладок
myMenus.forEach((menu) => {
  menu.renderTabs();
});


let MainKon = document.querySelector("#ShopDivIdКонцепция")
let PodKon = document.querySelector("#ShopPodIdКонцепция")
let ChetKon = false;

MainKon.addEventListener('click', ()=>{
  ChetKon = !ChetKon;
  
  OpenDoors(PodKon, ChetKon);
});

let MainKat = document.querySelector("#ShopDivIdКатегория")
let PodKat = document.querySelector("#ShopPodIdКатегория")
let ChetKat = false;

MainKat.addEventListener('click', () => {
  ChetKat = !ChetKat;
  OpenDoors(PodKat, ChetKat);
})

let MainCena = document.querySelector("#ShopDivIdЦена")
let PodCena = document.querySelector("#ShopPodIdЦена")
let ChetCena = false;

MainCena.addEventListener('click', () => {
  ChetCena = !ChetCena;
  OpenDoors(PodCena, ChetCena);
})


function OpenDoors(PodName, Chet){
  PodName.style.height = Chet? PodName.scrollHeight + "px" : "0";
}


DivFilter.addEventListener('click', () => {
  BockMenu.style.transform = "translateX(0px)";
  BockMenu.style.opacity = "1";
  Darker.style.background = "rgba(0, 0, 0, 0.5)";
});

CloseBth.addEventListener('click', () => {
  BockMenu.style.transform = "translateX(-1000px)";
  BockMenu.style.opacity = "0";
  Darker.style.background = "rgba(0, 0, 0, 0)";
})

SbrosBth.addEventListener('click', () => {
  BockMenu.style.transform = "translateX(-1000px)";
  BockMenu.style.opacity = "0";
  Darker.style.background = "rgba(0, 0, 0, 0)";
  
  document.querySelectorAll(".ShopFiltersRadio:checked").forEach((checkbox) => {
    checkbox.checked = false;
  });
  
  FuncFilters(true);
})

let FiltersHeight = document.querySelector('#FilterHeight');
FiltersHeight.addEventListener('resize', ReHeight);

function ReHeight() {
  if(window.innerHeight <= 1000){
    let Height = window.innerHeight;
    FiltersHeight.style.height = `${Height}px`;
  }
}

OpacityBth.addEventListener('click', () => {
  FuncFilters(false);
  bthOpacity(false)
})

function bthOpacity(bool) {
  filteredProducts = allProducts
  if (bool == true){
    OpacityBth.style.opacity = "1";
    OpacityBth.style.display = "flex";
    DivOpacityBth.style.opacity = "1";
    DivOpacityBth.style.display = "flex";
    
  }
  else{
    if (filteredProducts.length >= 12){
      OpacityBth.style.opacity = "0";
      OpacityBth.style.display = "none";
      DivOpacityBth.style.opacity = "0";
      DivOpacityBth.style.display = "none";
      updateIconsByTheme()
    }
    else{
      OpacityBth.style.opacity = "1";
      OpacityBth.style.display = "flex";
      DivOpacityBth.style.opacity = "1";
      DivOpacityBth.style.display = "flex";
    }
  }
}

const params = new URLSearchParams(window.location.search);
const filter = params.get("filter");

if (filter) {
  const filters = filter.split(',');
  filters.forEach(f => {
    const cb = document.querySelector(`input[type="checkbox"][data-value="${f}"]`);
    if (cb) {
      cb.checked = true;
      cb.dispatchEvent(new Event('change'));
    }
  });
}

ReHeight()



window.addEventListener('resize', ReHeight);