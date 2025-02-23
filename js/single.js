document.addEventListener("DOMContentLoaded", () => {
    // Initialize cart count from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartCount = cartItems.reduce((total, item) => total + item.quantity, 0); // Count cart items
    updateCartAndWishlistBadges(); // Update the cart and wishlist badge immediately

    // Initialize wishlist count from localStorage
    wishlistCount = parseInt(localStorage.getItem('wishlistCount') || '0');
});

// Function to format description by adding <br> after every 8th word
function formatDescription(text) {
    return text.split(' ').map((word, index) => {
        return (index + 1) % 8 === 0 ? word + "<br>" : word;
    }).join(' ');
}

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("productId");

// Variables to track cart and wishlist
let cartCount = 0;
let wishlistCount = 0;
let currentProduct = {}; // Store current product for price updates

// Function to update badges for cart and wishlist
function updateCartAndWishlistBadges() {
    document.getElementById("cart-badge").textContent = cartCount;
    document.getElementById("wish-badge").textContent = wishlistCount;
}

// Function to handle adding product to the cart
function addToCart() {
    const quantity = parseInt(document.getElementById('quantity-input').value);
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cartItems.find(item => item.id === currentProduct.id);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        currentProduct.quantity = quantity;
        currentProduct.thumbnail = currentProduct.images[0];
        cartItems.push(currentProduct);
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));
    cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    localStorage.setItem('cartCount', cartCount);
    updateCartAndWishlistBadges();

    Toastify({
        text: `${currentProduct.title} added to cart!`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #4a9c80,rgb(50, 163, 123))"
    }).showToast();
}

// Function to handle adding product to the wishlist
function addToWishlist() {
    wishlistCount++;
    updateCartAndWishlistBadges();
    localStorage.setItem('wishlistCount', wishlistCount);
}

// Function to update price based on quantity
function updatePrice(quantity) {
    const priceWithAddition = currentProduct.price + 0.4;
    const discountPercentage = currentProduct.discountPercentage / 100;
    const finalPrice = priceWithAddition * (1 - discountPercentage) * quantity;
    const withoutTax = currentProduct.price * (1 - discountPercentage) * quantity;

    document.getElementById("product-price").textContent = `$${(priceWithAddition * quantity).toFixed(2)}`;
    document.getElementById("product-discount").textContent = `$${finalPrice.toFixed(2)}`;
    document.querySelector(".without-tax").textContent = `Without Tax $${withoutTax.toFixed(2)}`;
}

// Function to fetch product details and update the page
async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        const product = await response.json();
        currentProduct = product;

        const priceWithAddition = product.price + 0.4;
        const discountPercentage = product.discountPercentage / 100;
        const finalPrice = priceWithAddition * (1 - discountPercentage);
        const withoutTax = product.price * (1 - discountPercentage);

        document.getElementById("product-title").textContent = product.title;
        document.getElementById("product-category").textContent = product.category;
        document.getElementById("product-image").src = product.images[0];
        document.getElementById("product-description").innerHTML = formatDescription(product.description);
        document.getElementById("product-price").textContent = `$${priceWithAddition.toFixed(2)}`;
        document.querySelector(".without-tax").textContent = `Without Tax $${withoutTax.toFixed(2)}`;
        document.getElementById("product-discount").textContent = `$${finalPrice.toFixed(2)}`;
        document.getElementById("product-sku").textContent = product.sku;
        document.getElementById("left-in-stock").textContent = product.stock;

        if (product.dimensions) {
            document.getElementById("product-details").innerHTML = `Width: ${product.dimensions.width} <br>Height: ${product.dimensions.height} <br>Depth: ${product.dimensions.depth}`;
        } else {
            document.getElementById("product-details").textContent = "Dimensions not available";
        }

        if (product.reviews && product.reviews.length > 0) {
            const firstReview = product.reviews[0];
            document.getElementById("product-ratings").innerHTML = `Ratings: ${firstReview.rating}<br>
                Comment: ${firstReview.comment}<br>
                Date: ${firstReview.date}<br>
                ReviewerName: ${firstReview.reviewerName}<br>
                ReviewerEmail: ${firstReview.reviewerEmail}`;
        } else {
            document.getElementById("product-ratings").innerHTML = "No reviews available.";
        }

        document.getElementById('quantity-input').value = 1;

        // Handle quantity change with dynamic price updates
        document.querySelector('.qty-plus').addEventListener('click', () => {
            let currentValue = parseInt(document.getElementById('quantity-input').value);
            document.getElementById('quantity-input').value = currentValue + 1;
            updatePrice(currentValue + 1);
        });

        document.querySelector('.qty-minus').addEventListener('click', () => {
            let currentValue = parseInt(document.getElementById('quantity-input').value);
            if (currentValue > 1) {
                document.getElementById('quantity-input').value = currentValue - 1;
                updatePrice(currentValue - 1);
            }
        });

        document.querySelector(".add-to-cart").addEventListener("click", addToCart);
        document.querySelector(".add-to-wishlist").addEventListener("click", addToWishlist);
        document.querySelector(".buy-now").addEventListener("click", function () {
            window.location.href = "menu.html";
        });

    } catch (error) {
        console.error("Error fetching product details:", error);
    }
}

// Fetch product details when the page loads
if (productId) {
    fetchProductDetails(productId);
} else {
    console.log("Product ID not found in URL.");
}
