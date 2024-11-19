class Item {
    constructor(name, price, weight, rating) {
        this.name = name;
        this.price = price; // Price in INR
        this.weight = weight; // Weight in kg
        this.rating = rating; // Rating (1-5 stars)
    }
}

const items = [
    new Item("Laptop", 50000, 3, 4.5),
    new Item("Headphones", 3000, 1, 4.0),
    new Item("Phone", 20000, 2, 4.2),
    new Item("Watch", 15000, 1, 3.8),
    new Item("Backpack", 5000, 2, 4.1),
];

let cart = [];

// Helper Functions
function formatPrice(price) {
    return `₹${price.toLocaleString("en-IN")}`; // Format price in INR
}

// Render Functions
function renderItems(list, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    list.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "item-card";
        card.innerHTML = `
            <p><strong>${item.name}</strong></p>
            <p>Price: ${formatPrice(item.price)}</p>
            <p>Weight: ${item.weight}kg</p>
            <p>Rating: ${item.rating} ⭐</p>
            <button onclick="addToCart(${index})">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";
    let totalPrice = 0;
    let totalRating = 0;

    cart.forEach((item) => {
        const card = document.createElement("div");
        card.className = "item-card";
        card.innerHTML = `
            <p><strong>${item.name}</strong></p>
            <p>Price: ${formatPrice(item.price)}</p>
            <p>Weight: ${item.weight}kg</p>
            <p>Rating: ${item.rating} ⭐</p>
        `;
        cartContainer.appendChild(card);
        totalPrice += item.price;
        totalRating += item.rating;
    });

    document.getElementById("total-price").textContent = formatPrice(totalPrice);
    document.getElementById("total-rating").textContent = totalRating;
}

// Add Item to Cart
function addToCart(index) {
    cart.push(items[index]);
    renderCart();
}

// Sort Items
function sortItems(key) {
    if (key === "price") {
        items.sort((a, b) => a.price - b.price);
    } else if (key === "rating") {
        items.sort((a, b) => b.rating - a.rating);
    } else if (key === "ratio") {
        items.sort((a, b) => (b.rating / b.weight) - (a.rating / a.weight));
    }
    renderItems(items, "items-list");
}

// Knapsack Algorithm (Optimizing Based on Budget)
function calculateOptimalItems() {
    const budget = parseInt(document.getElementById("budget-input").value); // Get the budget from the input
    const maxWeight = budget; // Use the budget as the weight limit
    const n = items.length;
    const dp = Array.from({ length: n + 1 }, () => Array(maxWeight + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= maxWeight; w++) {
            if (items[i - 1].price <= w) {
                dp[i][w] = Math.max(
                    dp[i - 1][w],
                    dp[i - 1][w - items[i - 1].price] + items[i - 1].rating
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    // Backtracking to find selected items
    let w = maxWeight;
    const selectedItems = [];
    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selectedItems.push(items[i - 1]);
            w -= items[i - 1].price;
        }
    }

    // Render Optimal Items
    document.getElementById("max-rating").textContent = dp[n][maxWeight];
    renderItems(selectedItems, "optimal-items-list");
}

// Initial Render
renderItems(items, "items-list");
renderCart();
