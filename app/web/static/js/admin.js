const productForm = document.querySelector("#product_form");

productForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const formElement = document.querySelector("#product_form");
    const formData = new FormData(formElement)
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    formData.append("csrf_token", csrfToken);
    
    try{
        const response = await fetch('/admin/add_imgs', {
            method: "POST",
            body: formData
        })
    }
    catch{}

    showToast(`Фотки товаров успешно добавлены ${document.querySelector('#productName').value}`);
});