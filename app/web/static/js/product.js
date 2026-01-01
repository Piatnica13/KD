let favorite = document.querySelector("#f");
let productId = document.querySelector("#d");  
let b = document.querySelector("#b")
let user_size = 0;



function urlBth(user_name) {
    let token = document.querySelector("meta[name='csrf_token']").getAttribute("content");
    fetch('/add_basket', {
      method: "POST",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json",
        "X-CSRFToken": token
       },
      body: JSON.stringify({user_name: user_name, product_id: parseInt(productId.value), color: document.querySelector("#productColor").value.toLowerCase(), size: document.querySelector("#productSize").value, material: document.querySelector("#productMaterial").value.toLowerCase()})
    })
      .then(response =>response.json())
      .then(data => {
        if(data.success){
          showToast(data.message);
        }
        else{
          showToast(data.error)
        }
      })
}


let left = document.querySelector("#profilGalochka1");
let right = document.querySelector("#profilGalochka2");

let img1 = document.querySelector("#productImg1");
let img2 = document.querySelector("#productImg2");
let img3 = document.querySelector("#productImg3");
let img4 = document.querySelector("#productImg4");

img2.style.opacity = "0";
img3.style.opacity = "0";
img4.style.opacity = "0";

let chett = 0;

right.addEventListener('click', sizeRight)
function sizeRight() {
  switch (chett) {
    case 0: 
      chett++;
      img1.style.opacity = "0";
      img2.style.opacity = "1";
      img3.style.opacity = "0";
      img4.style.opacity = "0";
      break;
    case 1:
      chett++;
      img1.style.opacity = "0";
      img2.style.opacity = "0";
      img3.style.opacity = "1";
      img4.style.opacity = "0";
      break
    case 2:
      chett++;
      img1.style.opacity = "0";
      img2.style.opacity = "0";
      img3.style.opacity = "0";
      img4.style.opacity = "1";
      break
    case 3:
      chett = 0;
      img1.style.opacity = "1";
      img2.style.opacity = "0";
      img3.style.opacity = "0";
      img4.style.opacity = "0";
      break
    default:
      break;
  }
}

left.addEventListener('click', () => {
  
  switch (chett) {
    case 1: 
      chett--;
      img1.style.opacity = "1";
      img2.style.opacity = "0";
      img3.style.opacity = "0";
      img4.style.opacity = "0";
      break;
    case 2:
      chett--;
      img1.style.opacity = "0";
      img2.style.opacity = "1";
      img3.style.opacity = "0";
      img4.style.opacity = "0";
      break
    case 3:
      chett--;
      img1.style.opacity = "0";
      img2.style.opacity = "0";
      img3.style.opacity = "1";
      img4.style.opacity = "0";
      break
    case 0:
      chett = 3;
      img1.style.opacity = "0";
      img2.style.opacity = "0";
      img3.style.opacity = "0";
      img4.style.opacity = "1";
      break
    default:
      break;
  }
})

window.addEventListener("resize", resize);
let cheked = false;
function resize() {
    width = window.innerWidth;
    if (width <= 1000){
      if(cheked == false){
        img1.style.opacity = "1";
        img2.style.opacity = "0";
        img3.style.opacity = "0";
        img4.style.opacity = "0";
        cheked = true;
      }
    }
    else{
      cheked = false;
      img1.style.opacity = "1";
      img2.style.opacity = "1";
      img3.style.opacity = "1";
      img4.style.opacity = "1";
    }
  };
  
  let BthLike = document.querySelector("#productLike")
  let BthGetLike = document.querySelector("#productGetLike");
  BthLike.addEventListener('click', BthLikes)
  BthGetLike.addEventListener("click", BthLikes)

  function BthLikes() {
  let name = BthLike.dataset.name;
  let token = document.querySelector("meta[name='csrf_token']").getAttribute("content");
  fetch("/add_favorite", {
    method: "POST",
    credentials: "include",
    headers: { 
      "Content-Type": "application/json",
      "X-CSRFToken": token
     },
    body: JSON.stringify({user_name: name, product_id: parseInt(productId.value)})
  })
  .then(response => response.json())
  .then(data => {
    if (data.success){
      showToast(data.message)
      if (BthLike.style.display == "flex"){
        FuncBthLike();
      }
      else{
        FuncBthGetLike();
      }
    }
    else{
      showToast(data.error)
    }
  })
}


function FuncBthGetLike(){
  BthLike.style.display = "flex";
  BthGetLike.style.opacity = "0";
  BthLike.style.opacity = "1";
  BthGetLike.style.display = "none";
}

function FuncBthLike() {
  BthLike.style.opacity = "0";
  BthGetLike.style.display = "flex";
  BthGetLike.style.opacity = "1";
  BthLike.style.display = "none";
}

function chek(){
  let value = favorite.value.slice(1).slice(0, -1).split(', '); 
  for(let i = 0; i < value.length; i++){
    if (productId.value == value[i]){
      FuncBthGetLike()
    }
  }
}
chek();
resize();

document.querySelector("#productMaterial").addEventListener('change', function(){
  
  const selectedValue = this.value;
  
  
  if (selectedValue === "Золото 585 (Белое)") {
    showToast("Изделия из белого золота 585 изготавливается на заказ, до 2 недель", 10, 5000)
  }
  else if(selectedValue === "Золото 585 (Жёлтое)"){
    showToast("Изделия из жёлтого золота 585 изготавливается на заказ, до 2 недель", 10, 5000)
  }
})