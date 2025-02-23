// Function to render items in the cart
function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartQuantity = document.querySelector(".cart-quantity");
    const orderContainer = document.querySelector(".order-container");

    // Clear existing items in the container
    orderContainer.innerHTML = '';

    let subtotal = 0;

    cart.forEach(item => {
        // Price with tax (including the 0.4 increase, similar to single.js logic)
        const priceWithTax = item.price + 0.40;
        const discountPercentage = item.discountPercentage / 100;
        const finalPrice = priceWithTax * (1 - discountPercentage);  // Discounted price

        // Calculate total price for the item considering quantity
        const itemTotalPrice = finalPrice * item.quantity;
        subtotal += itemTotalPrice;

        // Shorten description if it's too long (e.g., limit to 100 characters)
        const truncatedDescription = item.description.length > 40 
            ? item.description.substring(0, 50) + "..." 
            : item.description;

        // Construct the link to the single product view (SVP)
        const productLink = `single.html?productId=${item.id}`;  // URL for SVP with the product id in the query string

        // Create a new div for the order
        const orderElement = document.createElement('div');
        orderElement.classList.add('order');

        // Create the order details
        orderElement.innerHTML = `
            <div class="order-details">
                <div class="order-image">
                    <!-- Make the thumbnail clickable and redirect to SVP -->
                    <a href="${productLink}">
                        <img src="${item.thumbnail}" alt="${item.title}">
                    </a>
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

        // Append the order element to the container
        orderContainer.appendChild(orderElement);
    });

    cartQuantity.textContent = `You have ${cart.length} item${cart.length > 1 ? 's' : ''} in your cart`;

    // Calculate tax and total (applying tax here as well)
    const tax = subtotal * 0.04; // Assuming 4% tax
    const total = subtotal + tax;

    // Update payment summary (SubTotal, Tax, Total)
    document.querySelector(".subtotal-value").textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector(".tax-value").textContent = `$${tax.toFixed(2)}`;
    document.querySelector(".total-value").textContent = `$${total.toFixed(2)}`;

    // Update the checkout button with total amount
    document.querySelector(".checkout-total").textContent = `$${total.toFixed(2)}`;
}

// Function to update the quantity of an item in the cart
function updateQuantity(itemId, action) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(item => item.id === itemId);

    if (item) {
        if (action === 'increase') {
            item.quantity++;
        } else if (action === 'decrease') {
            // If the quantity is greater than 1, decrease it
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                // If the quantity is 1, remove the item from the cart
                removeItemFromCart(itemId);
                return; // Exit the function to avoid further processing
            }
        }

        // Update the cart in localStorage and re-render the cart items
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartItems(); 
    }
}

// Function to remove an item from the cart
function removeItemFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== itemId);

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems(); // Update the cart after removing the item
}

// Function to clear the cart and localStorage after a successful payment
function clearCartAfterPayment() {
    localStorage.removeItem('cart'); 
    renderCartItems();
}

// Activate this function after validating payment (e.g., inside the payment button handler)
document.querySelector(".pay-button").addEventListener("click", function (event) {
    event.preventDefault();  // Prevents form submission to perform validation

    if (validateForm()) {
        // If the form is valid, proceed with payment
        // Clear localStorage and remove the cart
        clearCartAfterPayment();
    }
});

// Execute the renderCartItems function on page load to display the cart
document.addEventListener("DOMContentLoaded", renderCartItems);
