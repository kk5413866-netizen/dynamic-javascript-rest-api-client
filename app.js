let products = [];
let filteredProducts = [];

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const cartCount = document.getElementById("cartCount");


// Load products
async function loadProducts() {

    try {

        loading.style.display = "block";
        errorBox.style.display = "none";

        products = await fetchProducts();

        filteredProducts = [...products];

        createCategories();
        displayProducts(filteredProducts);

        loading.style.display = "none";

    } catch (error) {

        loading.style.display = "none";

        errorBox.textContent =
            "⚠️ Unable to load products. Please try again.";

        errorBox.style.display = "block";
    }
}


// Create category buttons/options
function createCategories() {

    const categories = [...new Set(
        products.map(product => product.category)
    )];

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });
}


// Display products
function displayProducts(items) {

    productsContainer.innerHTML = "";

    if (items.length === 0) {

        productsContainer.innerHTML =
            "<p>No products found.</p>";

        return;
    }

    items.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">

            <h3>${product.title}</h3>

            <p class="category">
                ${product.category}
            </p>

            <p class="price">
                $${product.price}
            </p>

            <button onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        `;

        productsContainer.appendChild(card);
    });
}


// Filter and search
function updateProducts() {

    const searchText =
        searchInput.value.toLowerCase();

    const category =
        categoryFilter.value;

    filteredProducts = products.filter(product => {

        const matchesSearch =
            product.title.toLowerCase()
            .includes(searchText);

        const matchesCategory =
            category === "all" ||
            product.category === category;

        return matchesSearch && matchesCategory;
    });

    sortProducts();

    displayProducts(filteredProducts);
}


// Sorting
function sortProducts() {

    const sortValue = sortSelect.value;

    if (sortValue === "low") {

        filteredProducts.sort(
            (a, b) => a.price - b.price
        );

    } else if (sortValue === "high") {

        filteredProducts.sort(
            (a, b) => b.price - a.price
        );

    } else if (sortValue === "name") {

        filteredProducts.sort(
            (a, b) => a.title.localeCompare(b.title)
        );
    }
}


// Add product to cart
function addToCart(id) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const product =
        products.find(item => item.id === id);

    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    alert("Product added to cart!");
}


// Update cart count
function updateCartCount() {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    cartCount.textContent = cart.length;
}


// Search event
searchInput.addEventListener(
    "input",
    updateProducts
);


// Category event
categoryFilter.addEventListener(
    "change",
    updateProducts
);


// Sort event
sortSelect.addEventListener(
    "change",
    updateProducts
);


// Initial load
updateCartCount();
loadProducts();