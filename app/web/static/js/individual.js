const indiv1s = document.querySelectorAll(".indiv1Divs");
const indiv1imgs = document.querySelectorAll(".indiv1imgs");
const indiv1sec = document.querySelectorAll(".indivSec");
const indiv1text = document.querySelectorAll(".indiv1text");

const indiv1img = document.querySelector("#indiv1img");
const indiv2img = document.querySelector("#indiv2img");
const indiv3img = document.querySelector("#indiv3img");

const indiv1div = document.querySelector("#indiv1Div");
const indiv2div = document.querySelector("#indiv2Div");
const indiv3div = document.querySelector("#indiv3Div");

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        indiv1s.forEach((div, index) => {
            setTimeout(() => {
                div.style.opacity = `1`;
                div.style.transform = `translateX(0px)`;
            }, 500 * index);
        });
    }, 850);

    Width(); 
});

window.addEventListener("resize", Width);

function Width(){
    const W = window.innerWidth;
    if(W <= 610){
        indiv1sec.forEach((el) => {
            el.style.display = `flex`;
        })
        indiv1text.forEach((el) => {
            el.style.display = `none`;
        })
        indiv1img.style.top = `15px`;
        indiv2img.style.top = `15px`;
        indiv3img.style.top = `15px`;

        indiv1div.style.width = `280px`;
        indiv2div.style.width = `170px`;
        indiv3div.style.width = `280px`;

    }
    else{
        indiv1sec.forEach((el) => {
            el.style.display = `none`;
        })
        indiv1text.forEach((el) => {
            el.style.display = `flex`;
        })
        indiv1img.style.top = `0px`;
        indiv2img.style.top = `0px`;
        indiv3img.style.top = `0px`;

        indiv1div.style.width = `90%`;
        indiv2div.style.width = `90%`;
        indiv3div.style.width = `90%`;
    }
}
window.addEventListener('load', () => {
      AOS.refresh();
    });