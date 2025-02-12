// Funksioni per te marre kategorite dhe per ti shfaq ato ne menyre dinamike
async function fetchCategories() {
    const categoriesContainer = document.getElementById("categories-container");

    try {
        const response = await fetch("https://dummyjson.com/products/categories"); // Zgjidhni API-ne tuaj te vertete
        const categories = await response.json();

        // Ruani butonat e kategorive per t'i perdorur me vone
        const categoryButtons = [];

        // Krijo dhe shto butonin "All", dhe beje aktiv ne fillim
        const allButton = document.createElement("button");
        allButton.classList.add("menu-category");
        allButton.textContent = "All";
        allButton.classList.add("active"); // Beje butonin "All" aktiv ne fillim

        // Shto event listener per butonin "Te gjithe"
        allButton.addEventListener("click", () => {
            // Hiq klasat 'active' nga te gjitha butonat e kategorive
            categoryButtons.forEach(buttonObj => buttonObj.categoryButton.classList.remove("active"));

            // Shto klasat 'active' tek butoni "Te gjithe"
            allButton.classList.add("active");

            // Merr dhe shfaq produktet nga te gjitha kategorite
            fetchAllProducts();
        });

        // Shto butonin "Te gjithe" ne kontejner
        categoriesContainer.appendChild(allButton);

        categories.forEach((category, index) => {
            const categoryButton = document.createElement("button");
            categoryButton.classList.add("menu-category");
            categoryButton.textContent = category.name;

            // Shto butonin e kategorise ne listen
            categoryButtons.push({ categoryButton, category });

            // Shto event listener per butonat e kategorive
            categoryButton.addEventListener("click", () => {
                // Hiq klasat 'active' nga te gjitha butonat e kategorive
                categoryButtons.forEach(buttonObj => buttonObj.categoryButton.classList.remove("active"));

                // Hiq klasat 'active' nga butoni "Te gjithe" nese klikohet
                allButton.classList.remove("active");

                // Shto klasat 'active' tek butoni i klikuar
                categoryButton.classList.add("active");

                // Merr produktet per kategorine e zgjedhur
                fetchProducts(category.slug);
            });

            categoriesContainer.appendChild(categoryButton);
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Funksioni per te marre te gjitha produktet nga cdo kategori dhe i shfaq ato
async function fetchAllProducts() {
    const productsContainer = document.getElementById("products-container");

    // Fshi produktet e meparshme
    productsContainer.innerHTML = '';

    try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        const products = data.products;

        products.forEach(product => {
            // Krijo kartelen e produktit
            const productCard = document.createElement("div");
            productCard.classList.add("grid-item");

            // Krijo imazhin e produktit
            const productImage = document.createElement("img");
            productImage.src = product.thumbnail;
            productImage.alt = product.title;

            // Krijo kontejnerin e informacionit per artikujt
            const itemInfo = document.createElement("div");
            itemInfo.classList.add("item-info");

            // Krijo titullin e produktit
            const productTitle = document.createElement("h3");
            productTitle.classList.add("item-title");
            productTitle.textContent = product.title.length > 20 ? product.title.substring(0, 20) + "..." : product.title;

            // Krijo pershkrimin e produktit
            const productDescription = document.createElement("p");
            productDescription.classList.add("item-description");
            productDescription.textContent = product.description.length > 20 ? product.description.substring(0, 20) + "..." : product.description;

            // Krijo cmimin dhe kontejnerin e butonit per ta shtuar ne karroce
            const priceAndButtonContainer = document.createElement("div");
            priceAndButtonContainer.classList.add("price-and-button-container");

            // Krijo cmimin e produktit
            const productPrice = document.createElement("p");
            productPrice.classList.add("item-price");
            productPrice.textContent = `$${product.price.toFixed(2)}`;

            // Krijo butonin per ta shtuar ne karroce
            const addToCartButton = document.createElement("button");
            addToCartButton.classList.add("add-to-cart");
            addToCartButton.textContent = "Add to Cart";
            addToCartButton.addEventListener("click", () => addToCart(product));

            // Krijo ikonen e Gratipay
            const gratipayIcon = document.createElement("i");
            gratipayIcon.classList.add("fa-brands", "fa-gratipay");

            // Shto cmimin dhe butonin per ta shtuar ne karroce ne kontejner
            priceAndButtonContainer.appendChild(productPrice);
            priceAndButtonContainer.appendChild(addToCartButton);
            priceAndButtonContainer.appendChild(gratipayIcon);

            // Shto titullin, pershkrimin dhe kontejnerin e cmimit/butonit ne informacionin e artikujve
            itemInfo.appendChild(productTitle);
            itemInfo.appendChild(productDescription);
            itemInfo.appendChild(priceAndButtonContainer);

            // Shto imazhin dhe informacionin per artikujt ne kartelen e produktit
            productCard.appendChild(productImage);
            productCard.appendChild(itemInfo);

            // Shtoni kartelen e produktit ne kontejnerin e produkteve
            productsContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error("Error fetching all products:", error);
    }
}

// Funksioni per te marre produktet per nje kategorie te caktuar dhe i shfaq ato
async function fetchProducts(categorySlug) {
    const productsContainer = document.getElementById("products-container");

    // Fshi produktet e meparshme
    productsContainer.innerHTML = '';

    try {
        const response = await fetch(`https://dummyjson.com/products/category/${categorySlug}`);
        const data = await response.json();
        const products = data.products;

        products.forEach(product => {
            // Krijo kartelen e produktit
            const productCard = document.createElement("div");
            productCard.classList.add("grid-item");

            // Krijo imazhin e produktit
            const productImage = document.createElement("img");
            productImage.src = product.thumbnail;
            productImage.alt = product.title;

            // Krijo kontejnerin e informacionit per artikujt
            const itemInfo = document.createElement("div");
            itemInfo.classList.add("item-info");

            // Krijo titullin e produktit
            const productTitle = document.createElement("h3");
            productTitle.classList.add("item-title");
            productTitle.textContent = product.title.length > 20 ? product.title.substring(0, 20) + "..." : product.title;

            // Krijo pershkrimin e produktit
            const productDescription = document.createElement("p");
            productDescription.classList.add("item-description");
            productDescription.textContent = product.description.length > 20 ? product.description.substring(0, 20) + "..." : product.description;

            // Krijo cmimin dhe kontejnerin e butonit per ta shtuar ne karroce
            const priceAndButtonContainer = document.createElement("div");
            priceAndButtonContainer.classList.add("price-and-button-container");

            // Krijo cmimin e produktit
            const productPrice = document.createElement("p");
            productPrice.classList.add("item-price");
            productPrice.textContent = `$${product.price.toFixed(2)}`;

            // Krijo butonin per ta shtuar ne karroce
            const addToCartButton = document.createElement("button");
            addToCartButton.classList.add("add-to-cart");
            addToCartButton.textContent = "Add to Cart";
            addToCartButton.addEventListener("click", () => addToCart(product));

            // Krijo ikonen e Gratipay
            const gratipayIcon = document.createElement("i");
            gratipayIcon.classList.add("fa-brands", "fa-gratipay");

            // Shto cmimin dhe butonin per ta shtuar ne karroce ne kontejner
            priceAndButtonContainer.appendChild(productPrice);
            priceAndButtonContainer.appendChild(addToCartButton);
            priceAndButtonContainer.appendChild(gratipayIcon);

            // Shto titullin, pershkrimin dhe kontejnerin e cmimit/butonit ne informacionin e artikujve
            itemInfo.appendChild(productTitle);
            itemInfo.appendChild(productDescription);
            itemInfo.appendChild(priceAndButtonContainer);

            // Shto imazhin dhe informacionin per artikujt ne kartelen e produktit
            productCard.appendChild(productImage);
            productCard.appendChild(itemInfo);

            // Shtoni kartelen e produktit ne kontejnerin e produkteve
            productsContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Funksioni per te shtuar nje produkt ne karroce
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Shfaq nje njoftim duke perdorur Toastify
    Toastify({
        text: `${product.title} added to cart successfully!`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #4a9c80,rgb(50, 163, 123))"
    }).showToast();

    // Perditeso badge-in e karroces
    updateCartBadge();
}

// Funksioni per te perditesuar numrin e badge-it te karroces
function updateCartBadge() {
    const cartBadge = document.getElementById("cart-badge");

    // Merr totalin e artikujve ne karroce
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Perditeso badge-in me numrin total te artikujve
    cartBadge.textContent = totalItems;
}

document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    fetchAllProducts();  // Qe te gjitha produktet te shfaqen fillimisht
    updateCartBadge(); // Qe badge-i i karroces te perditesohet kur hapet faqja
});
