// Funksioni per te renderuar artikujt ne karroce
function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartQuantity = document.querySelector(".cart-quantity");
    const orderContainer = document.querySelector(".order-container");

    // Fshi artikujt ekzistues ne kontejner
    orderContainer.innerHTML = '';

    let subtotal = 0;

    cart.forEach(item => {
        // Llogarit cmimin total per artikullin
        const itemTotalPrice = item.price * item.quantity;
        subtotal += itemTotalPrice;

        // Shkurto pershkrimin nese eshte shume i gjate (p.sh., kufizoje ne 100 karaktere)
        const truncatedDescription = item.description.length > 60 
            ? item.description.substring(0,60) + "..." 
            : item.description;

        // Krijo nje div te ri per porosine
        const orderElement = document.createElement('div');
        orderElement.classList.add('order');

        // Krijo detajet e porosise
        orderElement.innerHTML = `
            <div class="order-details">
                <div class="order-image">
                    <img src="${item.thumbnail}" alt="${item.title}">
                </div>
                <div class="order-name">
                    <h1 class="order-name">${item.title}</h1>
                    <p class="order-detail">${truncatedDescription}</p>
                </div>
            </div>
            <div class="quantity-selector">
                <span class="quantity">${item.quantity}</span>
                <div class="quantity-selectors">
                    <button class="quantity-btn-increase" onclick="updateQuantity(${item.id}, 'increase')">
                        <i class="fa-solid fa-caret-up"></i>
                    </button>
                    <button class="quantity-btn-decrease" onclick="updateQuantity(${item.id}, 'decrease')">
                        <i class="fa-solid fa-caret-down"></i>
                    </button>
                </div>
            </div>
            <div class="order-price">$${itemTotalPrice.toFixed(2)}</div>
            <div class="delete" onclick="removeItemFromCart(${item.id})">
                <i class="fa-solid fa-trash-can"></i>
            </div>
        `;

        // Shto elementin e porosise ne kontejner
        orderContainer.appendChild(orderElement);
    });

    cartQuantity.textContent = `You have ${cart.length} items${cart.length > 1 ? 'e' : ''} in your cart`;

    // Llogarit taksen dhe totalin
    const tax = subtotal * 0.04; // Pasi taksa eshte 4%
    const total = subtotal + tax;

    // Perditeso permbledhjen e pageses (SubTotal, Taksa, Totali)
    document.querySelector(".subtotal-value").textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector(".tax-value").textContent = `$${tax.toFixed(2)}`;
    document.querySelector(".total-value").textContent = `$${total.toFixed(2)}`;

    // Perditeso butonin e pageses me totalin
    document.querySelector(".checkout-total").textContent = `$${total.toFixed(2)}`;
}

// Funksioni per te perditesuar sasine e nje artikulli ne karroce
function updateQuantity(itemId, action) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(item => item.id === itemId);

    if (item) {
        if (action === 'increase') {
            item.quantity++;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity--;
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartItems(); 
    }
}

// Funksioni per te hequr nje artikull nga karroca
function removeItemFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== itemId);

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems(); // Perditeso karrocen pas heqjes se artikullit
}

// Funksioni per te pastruar karrocen dhe localStorage pas pageses se suksesshme
function clearCartAfterPayment() {
    
    localStorage.removeItem('cart'); 

    renderCartItems();
}

// Aktivizo kete funksion pas validimit te pageses (p.sh., brenda trajtuesit te butonit per pages)
document.querySelector(".pay-button").addEventListener("click", function (event) {
    event.preventDefault();  // Parandalon dergimin e formularit per te bere validimin

    
    if (validateForm()) {
        // Nese formulari eshte valid, vazhdo me pagesen
        // Pastro localStorage dhe fshij karten
        clearCartAfterPayment();
    }
});

// Ekzekuto funksionin renderCartItems gjate ngarkimit te faqes per te shfaqur karrocen
document.addEventListener("DOMContentLoaded", renderCartItems);
