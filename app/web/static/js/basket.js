document.addEventListener("DOMContentLoaded", () => {
    loadProducts()
    let checkboxs = document.querySelectorAll(".basketcheckboxItem");
    let selected = JSON.parse(localStorage.getItem("selectedItems"));
    
    if(!selected){
        selected = Array.from(checkboxs).map(box => box.dataset.id);
        localStorage.setItem("selectedItems", JSON.stringify(selected));
    }
    
    checkboxs.forEach(box => {
        const id = box.dataset.id;
        box.checked = selected.includes(id);
        
        box.addEventListener("click", () => {
            let update = JSON.parse(localStorage.getItem("selectedItems")) || [];
            
            if (box.checked){
                update.push(id);
                rightProduct();
            }
            else{
                update = update.filter(item => item !== id);
                rightProduct();
            }
            localStorage.setItem("selectedItems", JSON.stringify(update));
        })
    })
})

allProducts = [];

async function loadProducts() {
    const response = await fetch("/api/products")
    allProducts = await response.json()

    rightProduct()
}


let like = document.querySelectorAll(".basketLike")
let nolike = document.querySelectorAll(".basketNoLike")


function LikeorNo(){
    let favorites = document.querySelector("#basketFavoriteProduct");
    if(favorites){
        favorites = favorites.value.slice(1).slice(0, -1).split(', ')
    }
    
    for(let i = 0; i < like.length; i++){
        id = like[i].dataset.id;
        
        if(favorites.includes(id)){
            Red(id)
        }
        else{
            noRed(id);
        }
    }
}
function Red(element){
    let Id = document.querySelector(`#basketLike${element}`)
    let noId = document.querySelector(`#basketNoLike${element}`)
    noId.style.opacity = "0";
    Id.style.opacity = "1";
    Id.style.display = `flex`;
    noId.style.display = `none`;
}
function noRed(element){
    
    let Id = document.querySelector(`#basketLike${element}`)    
    let noId = document.querySelector(`#basketNoLike${element}`)
    Id.style.opacity = "0";
    noId.style.opacity = "1";
    Id.style.display = `none`;
    noId.style.display = `flex`;
}
LikeorNo()
function Like(event){
    let element = event.currentTarget;
    let Id = element.dataset.id; 
    let productLike = document.querySelector(`#basketLike${Id}`)
    let productNoLike = document.querySelector(`#basketNoLike${Id}`)
    

    if (productLike.style.display == 'flex') {
        productLike.style.opacity = '0';
        productNoLike.style.display = 'flex';
        productNoLike.style.opacity = '1';
        productLike.style.display = 'none';
    }
    else{
        productNoLike.style.opacity = '0';
        productLike.style.display = 'flex';
        productLike.style.opacity = '1';
        productNoLike.style.display = 'none';
    } 

    let token = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
    
    fetch('/add_favorite', {
        method: "POST",
        credentials: "include",
        headers: { 
            'Content-Type': 'application/json',
            "X-CSRFToken": token
        },
        body: JSON.stringify({product_id: parseInt(Id)})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            showToast(data.message)
        }
        else{
            showToast(data.error)
        }
    })
}

like.forEach(element => {
    element.addEventListener("click", Like)
});
nolike.forEach(element => {
    element.addEventListener("click", Like)
});

let delete_product= document.querySelectorAll(".basketDelete");
let checkboxs = document.querySelectorAll(".basketcheckboxItem");
function deleteFunc(){
    let element = event.currentTarget;
    let Id = element.dataset.id; 

    checkboxs.forEach((el) => {
        if (el.dataset.id == Id){
            el.checked = false;
        }
    });

    rightProduct();
    
    let token = document.querySelector("meta[name='csrf_token']").getAttribute("content");

    fetch("/delete_basket", {
        method: "POST",
        credentials: "include",
        headers: { 
            'Content-Type': 'application/json',
            "X-CSRFToken": token },
        body: JSON.stringify({product_id: parseInt(Id)})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            removeDiv = document.querySelector(`#card-${Id}`)
            removeDiv.remove();

            let update = JSON.parse(localStorage.getItem("selectedItems")) || [];
            update = update.filter(item => item !== Id);
            localStorage.setItem("selectedItems", JSON.stringify(update));
            showToast(data.message)
        }
        else{
            showToast(data.error)
        }
    })
}
delete_product.forEach(element => {
    element.addEventListener("click", deleteFunc)
});

let divForProduct = document.querySelector("#basketProductsPay");
function rightProduct() {
    let basketPay = document.querySelector("#basketPay");
    let num = 1;
    let sum = 0;
    checkboxs.forEach(box => {
        const productId = box.dataset.id
        const product = allProducts.find(item => item.id == productId);
        
        try {
            let productDiv = document.querySelector(`#basketRightProductId${box.dataset.id}`)
            productDiv.remove();
        } catch (error) {}
        if (box.checked == true){
            let productShow = document.createElement("div");
            productShow.innerHTML += `<p style = "font-size: 1.2rem">${num}. ${product.name} — ${product.price}&#8376;</p>`;
            productShow.classList.add("basketRightProducts");
            productShow.id = `basketRightProductId${productId}`;

            divForProduct.appendChild(productShow)
            num++;
            sum += product.price;
        }
    });
    basketPay.innerHTML = `<h3 style = "font-size: 1.5rem">К оплате — ${sum}&#8376;</h3>`;
}

let messageBth = document.querySelector("#basketWhatsAppBth");
messageBth.addEventListener("click", messageBthFunc)

function messageBthFunc(){
    if (document.querySelector("#basketAddress").value != ``) {
        
        let checkedProductF = document.querySelectorAll(".basketRightProducts");
    
        let checkedProductS = [];
    
        checkedProductF.forEach((e)=>{
            checkedProductS.push(e.innerText.split(" — ")[0].split(". ")[1]);
        })
    
        let allName = document.querySelectorAll(".productName");
        let allColor = document.querySelectorAll(".basketColor");
        let allSize = document.querySelectorAll(".basketSize");
        let allMat = document.querySelectorAll(".basketmaterial");
        
    
        let chet = 1;
        let name = document.querySelector("#basketNamehidden").value;
        let num = 77003360024;
        let text = `Здраствуйте! Меня зовут ${name}. Хочу оформить заказ.%0a`;
        
        for(let i = 0; i < allName.length; i++){
            for(let j = 0; j < checkedProductS.length; j++){
                if(allName[i].innerText == checkedProductS[j]){
                    text += `
${chet}) ${allName[i].innerText},%0a
Цвет нити: ${allColor[i].innerText.split(`Цвет нити`)[1]},%0a
Размер: ${allSize[i].innerText.split(`Размер`)[1]},%0a
Материал: ${allMat[i].innerText.split(`Материал`)[1]}%0a
`
                    chet++;
                }
            }
        }
        text += `Удобна доставка на адрес ${document.querySelector("#basketAddress").value}`
        console.log(text);
        
        window.open(`https://wa.me/${num}?text=${text}`, '_blank');
    }
    else{
        formAddress.style.display=`block`;
        setTimeout(() => {
            formAddress.style.opacity = `1`;
            showToast("Адрес не указан");
        }, 1);
    }
}

let bthAdd = document.querySelector("#ProfilAddBth");
bthAdd.addEventListener('click', ()=>{
    formAddress.style.opacity = `0`;
    setTimeout(() => {
        formAddress.style.display = `none`;
    }, 300);


    let name = document.querySelector("#basketName");
    let city = document.querySelector("#basketCity");
    let street = document.querySelector("#basketStreet");
    let home = document.querySelector("#basketHome");
    let flat = document.querySelector("#basketFlat");

    let token = document.querySelector("meta[name='csrf_token']").getAttribute("content");


    fetch('/add_address', {
        method: "POST",
        credentials: "include",
        headers: { 
            "Content-Type": "application/json",
            "X-CSRFToken": token
         },
        body: JSON.stringify({name: name.value, city: city.value, street: street.value, home: home.value, flat: flat.value})
      })
        .then(response =>response.json())
        .then(data => {
          if(data.success){
            document.querySelector("#basketAddress").value = data.address;
            showToast(data.message);
          }
          else{
            showToast(data.error)
          }
    })
})

let formAddress = document.querySelector("#ProfilAddSplit");
formAddress.style.opacity = `0`;
formAddress.style.display = `none`;
formAddress.style.transition = `opacity 0.3s ease-in-out`