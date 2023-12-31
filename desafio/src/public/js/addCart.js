const socket = io();

const productInput = document.getElementById("product-input");
const descriptionInput = document.getElementById("description-input");
const codeInput = document.getElementById("code-input");
const priceInput = document.getElementById("price-input");
const stockInput = document.getElementById("stock-input");
const categoryInput = document.getElementById("category-input");
const sendButton = document.getElementById("send-button");

const idInput = document.getElementById("id-input");
const sendButtonDelete = document.getElementById("send-button-delete");

/**
 * Event listener for the send button click.
 * Emits a "products-list" event with the entered product details.
 * @param {Event} ev - The click event.
 */
sendButton.addEventListener("click", function (ev) {

    const payload = {
        "title": productInput.value,
        "description": descriptionInput.value,
        "code": codeInput.value,
        "price": priceInput.value,
        "stock": stockInput.value,
        "category": categoryInput.value,
    }
    socket.emit("products-list", JSON.stringify(payload));
})

/**
 * Event listener for the delete button click.
 * Emits a "products-list-delete" event with the entered product ID.
 * @param {Event} ev - The click event.
 */
sendButtonDelete.addEventListener("click", function (ev) {
    socket.emit("products-list-delete", idInput.value);
})


const productsList = document.getElementById("products-list");

/**
 * Socket event listener for "products-list-update" event.
 * Updates the products list on the webpage with the received data.
 * @param {Array} data - The array of products to be displayed.
 */
socket.on("products-list-update", (data) => {
    productsList.innerText = '';

    for (const el of data) {
        const li = document.createElement("li");
        const product = el;
        li.innerText = `Id: ${product.id} Titulo: ${product.title} Descripción:${product.description} Código:${product.code} Precio:${product.price} Stock:${product.stock} Categoría:${product.category} `;
        productsList.appendChild(li)
    }
})