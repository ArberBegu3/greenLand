// Ensure the DOM is fully loaded before running any script
document.addEventListener("DOMContentLoaded", () => {
    // Function to fetch categories and display them dynamically
    async function fetchCategories() {
        const categoriesContainer = document.getElementById("categories-container");

        try {
            const response = await fetch("https://dummyjson.com/products/categories"); // Choose your actual API
            const categories = await response.json();

            // Store category buttons for later use
            const categoryButtons = [];

            // Create and add the "All" button, and make it active initially
            const allButton = document.createElement("button");
            allButton.classList.add("menu-category");
            allButton.textContent = "All";
            allButton.classList.add("active"); // Make the "All" button active initially

            // Add event listener for the "All" button
            allButton.addEventListener("click", () => {
                // Remove 'active' classes from all category buttons
                categoryButtons.forEach(buttonObj => buttonObj.categoryButton.classList.remove("active"));

                // Add 'active' class to the "All" button
                allButton.classList.add("active");

                // Fetch and display products from all categories
                fetchAllProducts();
            });

            // Append the "All" button to the container
            categoriesContainer.appendChild(allButton);

            categories.forEach((category, index) => {
                const categoryButton = document.createElement("button");
                categoryButton.classList.add("menu-category");
                categoryButton.textContent = category.name;

                // Add the category button to the list
                categoryButtons.push({ categoryButton, category });

                // Add event listener for category buttons
                categoryButton.addEventListener("click", () => {
                    // Remove 'active' classes from all category buttons
                    categoryButtons.forEach(buttonObj => buttonObj.categoryButton.classList.remove("active"));

                    // Remove 'active' class from the "All" button if clicked
                    allButton.classList.remove("active");

                    // Add 'active' class to the clicked button
                    categoryButton.classList.add("active");

                    // Fetch products for the selected category
                    fetchProducts(category.slug);
                });

                categoriesContainer.appendChild(categoryButton);
            });
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    // Function to fetch all products from every category and display them
    async function fetchAllProducts() {
        const productsContainer = document.getElementById("products-container");

        // Clear previous products
        productsContainer.innerHTML = '';

        try {
            const response = await fetch("https://dummyjson.com/products");
            const data = await response.json();
            const products = data.products;

            products.forEach(product => {
                // Create the product card
                const productCard = document.createElement("div");
                productCard.classList.add("grid-item");

                // Create the product image
                const productImage = document.createElement("img");
                productImage.src = product.thumbnail;
                productImage.alt = product.title;

                // Ensure the product image (thumbnail) click event is properly set
                productImage.addEventListener("click", (event) => {
                    // Prevent the default behavior if needed
                    event.preventDefault();

                    // Update the cart badge and localStorage before redirection
                    updateCartBadge();

                    // Store the updated cart in localStorage before redirecting
                    localStorage.setItem("cart", JSON.stringify(cart));

                    // Redirect to the single-view-page with the product ID
                    window.location.href = `single.html?productId=${product.id}`;
                });

                // Create the information container for items
                const itemInfo = document.createElement("div");
                itemInfo.classList.add("item-info");

                // Create the product title
                const productTitle = document.createElement("h3");
                productTitle.classList.add("item-title");
                productTitle.textContent = product.title.length > 20 ? product.title.substring(0, 20) + "..." : product.title;

                // Create the product description
                const productDescription = document.createElement("p");
                productDescription.classList.add("item-description");
                productDescription.textContent = product.description.length > 20 ? product.description.substring(0, 20) + "..." : product.description;

                // Calculate the price with tax and discount
                const priceWithTax = product.price + 0.4; // Add tax
                const discountPercentage = product.discountPercentage || 0; // Get discount percentage (default to 0 if not available)
                const discount = priceWithTax * (discountPercentage / 100); // Calculate the discount
                const finalPrice = priceWithTax - discount; // Final price after discount

                // Create the price and button container
                const priceAndButtonContainer = document.createElement("div");
                priceAndButtonContainer.classList.add("price-and-button-container");

                // Create the product price
                const productPrice = document.createElement("p");
                productPrice.classList.add("item-price");
                productPrice.textContent = `$${finalPrice.toFixed(2)}`; // Show the final price with tax and discount

                // Create the button to add to cart
                const addToCartButton = document.createElement("button");
                addToCartButton.classList.add("add-to-cart");
                addToCartButton.textContent = "Add to Cart";
                addToCartButton.addEventListener("click", () => addToCart(product));

                // Create the Gratipay icon
                const gratipayIcon = document.createElement("i");
                gratipayIcon.classList.add("fa-brands", "fa-gratipay");

                // Append price and button to the container
                priceAndButtonContainer.appendChild(productPrice);
                priceAndButtonContainer.appendChild(addToCartButton);
                priceAndButtonContainer.appendChild(gratipayIcon);

                // Append title, description, and price/button container to item info
                itemInfo.appendChild(productTitle);
                itemInfo.appendChild(productDescription);
                itemInfo.appendChild(priceAndButtonContainer);

                // Append the image and item info to the product card
                productCard.appendChild(productImage);
                productCard.appendChild(itemInfo);

                // Add the product card to the products container
                productsContainer.appendChild(productCard);
            });
        } catch (error) {
            console.error("Error fetching all products:", error);
        }
    }

    // Function to fetch products for a specific category and display them
    async function fetchProducts(categorySlug) {
        const productsContainer = document.getElementById("products-container");

        // Clear previous products
        productsContainer.innerHTML = '';

        try {
            const response = await fetch(`https://dummyjson.com/products/category/${categorySlug}`);
            const data = await response.json();
            const products = data.products;

            products.forEach(product => {
                // Create the product card
                const productCard = document.createElement("div");
                productCard.classList.add("grid-item");

                // Create the product image
                const productImage = document.createElement("img");
                productImage.src = product.thumbnail;
                productImage.alt = product.title;

                // Add click event to redirect to single-view-page with the product ID
                productImage.addEventListener("click", () => {
                    // Redirect to the single-view-page.html and pass the product ID in the query string
                    window.location.href = `single-view-page.html?productId=${product.id}`;
                });

                // Create the information container for items
                const itemInfo = document.createElement("div");
                itemInfo.classList.add("item-info");

                // Create the product title
                const productTitle = document.createElement("h3");
                productTitle.classList.add("item-title");
                productTitle.textContent = product.title.length > 20 ? product.title.substring(0, 20) + "..." : product.title;

                // Create the product description
                const productDescription = document.createElement("p");
                productDescription.classList.add("item-description");
                productDescription.textContent = product.description.length > 20 ? product.description.substring(0, 20) + "..." : product.description;

                // Calculate the price with tax and discount
                const priceWithTax = product.price + 0.4; // Add tax
                const discountPercentage = product.discountPercentage || 0; // Get discount percentage (default to 0 if not available)
                const discount = priceWithTax * (discountPercentage / 100); // Calculate the discount
                const finalPrice = priceWithTax - discount; // Final price after discount

                // Create the price and button container
                const priceAndButtonContainer = document.createElement("div");
                priceAndButtonContainer.classList.add("price-and-button-container");

                // Create the product price
                const productPrice = document.createElement("p");
                productPrice.classList.add("item-price");
                productPrice.textContent = `$${finalPrice.toFixed(2)}`; // Show the final price with tax and discount

                // Create the button to add to cart
                const addToCartButton = document.createElement("button");
                addToCartButton.classList.add("add-to-cart");
                addToCartButton.textContent = "Add to Cart";
                addToCartButton.addEventListener("click", () => addToCart(product));

                // Create the Gratipay icon
                const gratipayIcon = document.createElement("i");
                gratipayIcon.classList.add("fa-brands", "fa-gratipay");

                // Append price and button to the container
                priceAndButtonContainer.appendChild(productPrice);
                priceAndButtonContainer.appendChild(addToCartButton);
                priceAndButtonContainer.appendChild(gratipayIcon);

                // Append title, description, and price/button container to item info
                itemInfo.appendChild(productTitle);
                itemInfo.appendChild(productDescription);
                itemInfo.appendChild(priceAndButtonContainer);

                // Append the image and item info to the product card
                productCard.appendChild(productImage);
                productCard.appendChild(itemInfo);

                // Add the product card to the products container
                productsContainer.appendChild(productCard);
            });
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    // Function to add a product to the cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function addToCart(product) {
        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        // Show a notification using Toastify
        Toastify({
            text: `${product.title} added to cart successfully!`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #4a9c80,rgb(50, 163, 123))"
        }).showToast();

        // Update the cart badge
        updateCartBadge();
    }

    // Function to update the cart badge count
    function updateCartBadge() {
        const cartBadge = document.getElementById("cart-badge");

        // Get the total number of items in the cart
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

        // Update the badge with the number of items in the cart
        cartBadge.textContent = totalItems;
    }

    // Function to initialize the page
    function init() {
        // Fetch categories and initial products
        fetchCategories();
        fetchAllProducts();

        // Update the badge at the start
        updateCartBadge();
    }

    init();
});
