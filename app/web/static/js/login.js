let body = document.querySelector("#Contener");
const toast = document.getElementById('divMessegeBox');
let messageQueue = [];
let isMessageShowing = false;

document.addEventListener("DOMContentLoaded", () =>{


    setTimeout(() => {
        body.style.transition = `opacity 0.6s linear, background 0.5s ease-in-out`;
        body.style.opacity = "1";
        body.style.background = `var(--add-bg)`;
    }, 300);

    const links = document.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Отключаем мгновенный переход
            const href = link.getAttribute("href");
            // Прячем меню
            body.style.transition = `opacity 0.6s linear`;
            body.style.opacity = "0";
            // Ждем окончания анимации и затем переходим
            setTimeout(() => {
                window.location.href = href; // Переход на новую страницу
            }, 600);
        });     // Тайминг должен совпадать с CSS transition
    });

    const emailInput = document.querySelector("#email");
      // Проверяем, есть ли сохранённый email в Local Storage
    const savedEmail = localStorage.getItem("savedEmail");
        if (savedEmail) {
        emailInput.value = savedEmail; // Предзаполняем поле email
        }
    
      // Сохраняем email при каждом изменении
    emailInput.addEventListener("input", () => {
        localStorage.setItem("savedEmail", emailInput.value);
    });

    const savedTheme = localStorage.getItem("theme") || "light";
    
    document.body.dataset.theme = savedTheme;
    
    const theme = savedTheme === "light" ? {
        "--main-bg": "#fffaf5",
        "--add-bg": "#e5d7cc",
        "--black": "#3a3a3a",
        "--white": "#000",
        "--grey": "#b8ada6",
        "--border": "#decabc",
        "--shadow": "#f2e0d5",
        "--gradient": "linear-gradient(145deg, #f7eee7, #fffaf5, #f1e8dd)",
        "--main-footer": "#e5d7cc",
        "--add-footer": "#d2c2b5",
        "--gradient-main": "linear-gradient(60deg,rgb(221, 203, 189),rgb(247, 238, 230),rgb(205, 190, 172))",
        "--gradient-add": "linear-gradient(100deg,rgb(226, 212, 195),rgb(214, 193, 179))",       
    } : {
        "--main-bg": "#2e2e2e",
        "--add-bg": "#3e3e3e",
        "--black": "#ffffff",
        "--white": "#ffffff",
        "--grey": "#999999",
        "--border": "#5a5a5a",
        "--shadow": "#1a1a1a",
        "--gradient": "linear-gradient(145deg, #383838, #2e2e2e)",
        "--main-footer": "#1c1c1c",
        "--add-footer": "#292929",
        "--gradient-main": "linear-gradient(-30deg,rgb(51, 51, 51),rgb(65, 65, 65),rgb(55, 55, 55))",
        "--gradient-add": "linear-gradient(135deg, rgb(98, 98, 98),rgb(73, 73, 73))",
    };
    
    for (let key in theme) {
        if (key.startsWith("--")) {
            document.documentElement.style.setProperty(key, theme[key]);
        }
    }

    if (savedTheme === "dark") {
        darkMod.style.display = "flex";
        lightMod.style.display = "none";
        lightMod.style.opacity = "0";
        setTimeout(() => {
            darkMod.style.opacity = "1";
            
        }, 10);
    } else {
        lightMod.style.display = "flex";
        darkMod.style.opacity = "0";
        darkMod.style.display = "none";
        setTimeout(() => {
            lightMod.style.opacity = "1";
        }, 10);
    }

    setTimeout(() => {
        
        updateIconsByTheme(true);
    }, 150);
});

form = document.querySelector("#loginForm")

form.addEventListener("submit", (e) => {
    e.preventDefault(); // Останавливаем обычную отправку
    body.style.transition = "opacity 0.5s ease"; 
    body.style.opacity = "0"; // например, плавно исчезает

    setTimeout(() => {
        form.submit(); // теперь форма реально отправится после анимации
    }, 500); // дожидаемся окончания анимации
});

let InpPass = document.querySelector('#InpPass');
let hide = document.querySelector('#Hide');
let show = document.querySelector('#Show');
let isPasswordVisible = false;
InpPass.addEventListener('focus', () =>{
    hide.style.opacity = `0.5`;
    show.style.opacity = `0`;
});
show.addEventListener('click', () =>{
    const start = InpPass.selectionStart;
    const end = InpPass.selectionEnd;
    InpPass.type = isPasswordVisible ? 'password' : 'text';
    isPasswordVisible = !isPasswordVisible;
    if(isPasswordVisible){
        hide.style.opacity = `0`;
        show.style.opacity = `0.5`;
    }
    else{
        hide.style.opacity = `0.5`;
        show.style.opacity = `0`;
    }
    InpPass.setSelectionRange(start, end);
})
show.addEventListener('mousedown', (event) => {
    event.preventDefault();
});

let Button = document.querySelector('#ButtonSignIn');

function showToast(text, timeForLoad = 10, timeForLook=2500) {

    messageQueue.push({text, timeForLoad, timeForLook});
    if (!isMessageShowing) {
        processQueue();
    }
}

function processQueue() {
    if (messageQueue.length === 0) {
        isMessageShowing = false;
        return;
    }
    
    isMessageShowing = true;
    const {text, timeForLoad, timeForLook} = messageQueue.shift();
    toast.style.position = `fixed`;
    toast.style.display = `block`;
    
    message = document.createElement('div')
    message.style.opacity = "0";
    message.style.transform = `translateX(400px)`;
    message.style.transition = `opacity 0.5s ease-in-out, transform 0.5s ease-in-out`;
    message.innerHTML = `
    <div class="message">
    <h3>${text}</h3>
    </div>`;
    
    toast.appendChild(message)
    setTimeout(() => {
        message.style.opacity = `1`;
        message.style.transform = `translateX(0px)`;
    }, timeForLoad);

    // Прячем и удаляем сообщение
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = `translateX(400px)`;
        
        setTimeout(() => {
            toast.style.display = `none`;
            message.remove();
            processQueue();
        }, 500);
    }, timeForLook + timeForLoad);
}

function removeMessage(message) {
    message.style.opacity = '0';
    message.style.transform = `translateX(400px)`;
    
    setTimeout(() => {
        message.remove();
        processQueue(); // Показываем следующее сообщение
        toast.style.display = `none`;
    }, 500);
}

// Выводить меседж боксы с помощью flash and flask
let messages = document.querySelectorAll(".message-box");
messages.forEach(message => {
    showToast(message.textContent);
});


function updateIconsByTheme(bool) {

    const theme = document.body.dataset.theme || 'light';
    
    const icons = document.querySelectorAll('img[data-icon]');
    
    icons.forEach(img => {
      const filename = img.dataset.icon;
      img.style.transition = "opacity 0.25s ease-in-out";
      img.style.opacity = `0`;
      setTimeout(() => {
        if(bool == true){
            img.src = `/static/icon/${theme === 'light' ? 'black' : 'white'}/${filename}`;
        }
        else{
            img.src = `/static/icon/${theme === 'dark' ? 'black' : 'white'}/${filename}`;
        }
          img.style.opacity = `1`;
      }, 250);
    });
}

function back(){
    let forma = document.querySelector("#Forma");
    forma.classList.add(`back`);
    setTimeout(() => {
        forma.classList.remove(`back`);
    }, 500);
}

let darkMod = document.querySelector("#bthDark");
let lightMod = document.querySelector("#bthLight");

lightMod.style.transition = "opacity 0.4s ease";
darkMod.style.transition = "opacity 0.4s ease";

darkMod.addEventListener("click", () => {
    back()
    lightMod.style.pointerEvents = `none`;
    darkMod.style.pointerEvents = `none`;
    setTimeout(() => {
        lightMod.style.pointerEvents = `all`;
        darkMod.style.pointerEvents = `all`;
    }, 600);
    updateIconsByTheme(false);

    theme = {
        "--main-bg": "#fffaf5",
        "--add-bg": "#e5d7cc",
        "--black": "#3a3a3a",
        "--white": "#000",
        "--grey": "#b8ada6",
        "--border": "#decabc",
        "--shadow": "#f2e0d5",
        "--gradient": "linear-gradient(145deg, #f7eee7, #fffaf5, #f1e8dd)",
        "--main-footer": "#e5d7cc",
        "--add-footer": "#d2c2b5",
        "--gradient-main": "linear-gradient(60deg,rgb(221, 203, 189),rgb(247, 238, 230),rgb(205, 190, 172))",
        "--gradient-add": "linear-gradient(100deg,rgb(226, 212, 195),rgb(214, 193, 179))",  
    }
    setTimeout(() => {
        for (let key in theme) {
            if (key.startsWith("--")) {
                document.documentElement.style.setProperty(key, theme[key]);
            }
        }
    }, 250);

    const current = document.body.dataset.theme;
    const nextTheme = current === "light" ? "dark" : "light";
  
    document.body.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme); // ← сохраняем в браузер

    darkMod.style.opacity = "0";
    setTimeout(() => {
        darkMod.style.display = "none";
        lightMod.style.display = "flex";
        setTimeout(() => {
            lightMod.style.opacity = "1";
        }, 10);
    }, 200);
})

lightMod.addEventListener("click", () => {
    
    back()
    darkMod.style.pointerEvents = `none`;
    lightMod.style.pointerEvents = "none";
    setTimeout(() => {
        darkMod.style.pointerEvents = `all`;
        lightMod.style.pointerEvents = "all";
    }, 600);
    updateIconsByTheme(false);

    theme = {
        "--main-bg": "#2e2e2e",
        "--add-bg": "#3e3e3e",
        "--black": "#ffffff",
        "--white": "#ffffff",
        "--grey": "#999999",
        "--border": "#5a5a5a",
        "--shadow": "#1a1a1a",
        "--gradient": "linear-gradient(145deg, #383838, #2e2e2e)",
        "--main-footer": "#1c1c1c",
        "--add-footer": "#292929",
        "--gradient-main": "linear-gradient(-30deg,rgb(51, 51, 51),rgb(65, 65, 65),rgb(55, 55, 55))",
        "--gradient-add": "linear-gradient(135deg, rgb(98, 98, 98),rgb(73, 73, 73))",
    };
    setTimeout(() => {
        for (let key in theme) {
            if (key.startsWith("--")) {
                document.documentElement.style.setProperty(key, theme[key]);
            }
        }
    }, 250);

    const current = document.body.dataset.theme;
    const nextTheme = current === "light" ? "dark" : "light";
  
    document.body.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme); // ← сохраняем в браузер

    lightMod.style.opacity = "0";
    setTimeout(() => {
        lightMod.style.display = "none";
        darkMod.style.display = "flex";
        setTimeout(() => {
            darkMod.style.opacity = "1";
        }, 10);
    }, 200);
})