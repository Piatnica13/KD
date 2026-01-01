let bthProfil = document.querySelector("#ProfilMenuItemProfil");
let profil = document.querySelector("#ProfilLeftProfil");
let bthRechange = document.querySelector("#ProfilEdit");
let bthRechangee = document.querySelector("#ProfilEditt");
let rechange = document.querySelector("#ProfilLeftChanchInfo");

if (!document.querySelector("#profilNotUserPasswor")){
    var bthPassword = document.querySelector("#ProfilMenuItemPassword");
    var password = document.querySelector("#ProfilLeftChanchPass");
}

let bthAddress = document.querySelector("#ProfilMenuItemAddress");
let address = document.querySelector("#ProfilLeftAddAddress");
let formToAddAddresses = document.querySelector("#ProfilAddSplit")
let bthAddAddresses = document.querySelector("#ProfilBthAddAdd");
let bthFavorite = document.querySelector("#ProdilMenuItemFavorites");
let favorite = document.querySelector("#ProfilLeftFavoritess");

let needCheckForAddress = sessionStorage.getItem("needAddressCheck");
let needCheckForFavorite = sessionStorage.getItem("needFavoriteCheck");

let ChekProfilOpacity = true;
if (needCheckForAddress === "true") {
    sessionStorage.removeItem("needAddressCheck"); // Удаляем, чтобы не срабатывало всегда
    PageAddress(); // Вызываем нужную функцию
}
if (needCheckForFavorite === "true"){
    sessionStorage.removeItem("needFavoriteCheck");
    PageFavorite();
}

try{
    let CardImg = document.querySelector("#productImg1")
    CardImg.style.opacity = "1";
    CardImg.style.display = "flex";
}
catch{}

bthFavorite.addEventListener("click", PageFavorite)
function PageFavorite() {
    NotTach()
    rechange.style.opacity = "0";
    if (!document.querySelector("#profilNotUserPasswor")){
        password.style.opacity = "0";
    }
    address.style.opacity = "0";
    profil.style.opacity = "0";
    favorite.style.display = "flex";
    ChekProfilOpacity = false;
    setTimeout(() => {
        address.style.display = "none"
        rechange.style.display = "none";
        if (!document.querySelector("#profilNotUserPasswor")){
            password.style.display = "none";
        }
        profil.style.display = "none";
        favorite.style.opacity = "1";
        StilDobro();
    }, 500);

}

bthProfil.addEventListener("click", OpacityOfProfil)
function OpacityOfProfil() {
    NotTach()
    rechange.style.opacity = "0";
    if (!document.querySelector("#profilNotUserPasswor")){
        password.style.opacity = "0";
    }
    address.style.opacity = "0";
    favorite.style.opacity = "0";
    profil.style.display = "flex";
    setTimeout(() => {
        address.style.display = "none"
        rechange.style.display = "none";
        if (!document.querySelector("#profilNotUserPasswor")){
            password.style.display = "none";
        }
        favorite.style.display = "none";
        profil.style.opacity = "1";
        StilDobro()
    }, 500);
}

bthRechange.addEventListener("click", () => {
    NotTach()
    profil.style.opacity = "0";
    if (!document.querySelector("#profilNotUserPasswor")){
        password.style.opacity = "0";
    }
    address.style.opacity = "0";
    favorite.style.opacity = "0";
    rechange.style.display = "block";
    setTimeout(() => {
        address.style.display = "none"
        profil.style.display = "none";
        favorite.style.display = "none";
        if (!document.querySelector("#profilNotUserPasswor")){
            password.style.display = "none";
        }
        rechange.style.opacity = "1";
        StilDobro()
    }, 500)
})
bthRechangee.addEventListener("click", () => {
    NotTach()
    profil.style.opacity = "0";
    if (!document.querySelector("#profilNotUserPasswor")){
        password.style.opacity = "0";
    }
    favorite.style.opacity = "0";
    address.style.opacity = "0";
    rechange.style.display = "block";
    setTimeout(() => {
        favorite.style.display = "none";
        address.style.display = "none"
        profil.style.display = "none";
        if (!document.querySelector("#profilNotUserPasswor")){
            password.style.display = "none";
        }
        rechange.style.opacity = "1";
        StilDobro()
    }, 500)
})

if (!document.querySelector("#profilNotUserPasswor")){
    bthPassword.addEventListener("click", () => {
        NotTach()
        profil.style.opacity = "0";
        address.style.opacity = "0";
        favorite.style.opacity = "0";
        rechange.style.opacity = "0";
        password.style.display = "flex";
        setTimeout(() => {
            favorite.style.display = "none";
            address.style.display = "none"
            profil.style.display = "none";
            rechange.style.display = "none";
            password.style.opacity = "1";
            StilDobro()
        }, 500);
    })
}

bthAddress.addEventListener("click", PageAddress);
function PageAddress(){
    NotTach()
    profil.style.opacity = "0";
    if (!document.querySelector("#profilNotUserPasswor")){
        password.style.opacity = "0";
    }
    favorite.style.opacity = "0";
    rechange.style.opacity = "0";
    address.style.display = "flex";
    ChekProfilOpacity = false;
    setTimeout(() => {
        profil.style.display = "none";
        favorite.style.display = "none";
        if (!document.querySelector("#profilNotUserPasswor")){
            password.style.display = "none";
        }
        rechange.style.display = "none";
        address.style.opacity = "1";
        StilDobro()
    }, 500);
}

bthAddAddresses.addEventListener("click", () => {
    bthAddAddresses.style.opacity = "0";
    formToAddAddresses.style.display = "grid";
    setTimeout(() => {
        formToAddAddresses.style.opacity = "1";
        bthAddAddresses.style.display = "none";
    }, 300);
})

let buttonSave = document.querySelector("#ProfilDivButtonAdd");
let deletedAddresses = [];

function showButton() {
        buttonSave.style.display = "flex";
        setTimeout(() => {
            buttonSave.style.opacity = "1";
        }, 1);
}

function markForDeletion(addressId) {
    
    let addressElement = document.getElementById(`address-${addressId}`);
    
    if (addressElement) {
        addressElement.remove();

        if (!deletedAddresses.includes(addressId)) {
            deletedAddresses.push(addressId);
        }

        let hiddenInput = document.getElementById("deletedAddresses");
        if (hiddenInput) {
            hiddenInput.value = deletedAddresses.join(",");
        } else {
            console.error("Скрытое поле deletedAddresses не найдено!");
        }

        showButton();
    } else {
        console.error(`Элемент #address-${addressId} не найден!`);
    }
}
if (ChekProfilOpacity == true){
    OpacityOfProfil() 
}
function StilDobro(){
    let Dobro = document.querySelector("#ProfilTop");
    if (profil.style.display == `flex`){
        Dobro.style.display = `flex`;
    }
    else if(profil.style.display == `none`){
        Dobro.style.display = `none`;
    }
}
function NotTach() {
    try{
        clearTimeout(interval);
    }
    catch{}
    bthProfil.style.pointerEvents = `none`;
    if (!document.querySelector("#profilNotUserPasswor")){
        bthPassword.style.pointerEvents = `none`;
    }
    bthFavorite.style.pointerEvents = `none`;
    bthRechange.style.pointerEvents = `none`;
    bthAddress.style.pointerEvents = `none`;
    interval = setTimeout(() => {
        bthProfil.style.pointerEvents = `auto`;
        if (!document.querySelector("#profilNotUserPasswor")){
            bthPassword.style.pointerEvents = `auto`;
        }
        bthFavorite.style.pointerEvents = `auto`;
        bthRechange.style.pointerEvents = `auto`;
        bthAddress.style.pointerEvents = `auto`;
    }, 600);
}