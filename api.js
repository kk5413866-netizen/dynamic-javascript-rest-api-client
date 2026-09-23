const API_URL = "https://fakestoreapi.com/products";

async function fetchProducts() {

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    return data;
}