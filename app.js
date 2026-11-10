const API_URL = "https://dummyjson.com/products?limit=30";

const productsGrid = document.querySelector("#products-grid");
const statusMessage = document.querySelector("#status-message");
const retryButton = document.querySelector("#retry-button");
const searchInput = document.querySelector("#search-input");

let allProducts = [];

async function fetchProducts() {
  setLoadingState();

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.products)) {
      throw new Error("The received data does not have the expected structure.");
    }

    allProducts = data.products;
    renderProducts(allProducts);
    setStatus(`${allProducts.length} The product was received.`);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    productsGrid.innerHTML = "";
    statusMessage.textContent =
      "An error occurred while retrieving products. Please check your internet connection and try again.";
    statusMessage.classList.add("error");
    retryButton.classList.remove("hidden");
  }
}

function renderProducts(products) {
  productsGrid.innerHTML = "";

  if (products.length === 0) {
    productsGrid.innerHTML =
      '<p class="empty-state">No product found.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const card = createProductCard(product);
    fragment.appendChild(card);
  });

  productsGrid.appendChild(fragment);
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "product-image-wrap";

  const image = document.createElement("img");
  image.className = "product-image";
  image.src = product.thumbnail;
  image.alt = product.title;
  image.loading = "lazy";
  imageWrap.appendChild(image);

  const category = document.createElement("p");
  category.className = "product-category";
  category.textContent = product.category;

  const title = document.createElement("h2");
  title.className = "product-title";
  title.textContent = product.title;

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  const footer = document.createElement("div");
  footer.className = "product-footer";

  const price = document.createElement("span");
  price.className = "product-price";
  price.textContent = formatPrice(product.price);

  const rating = document.createElement("span");
  rating.className = "product-rating";
  rating.textContent = `★ ${product.rating}`;

  footer.append(price, rating);
  card.append(imageWrap, category, title, description, footer);

  return card;
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function setLoadingState() {
  statusMessage.textContent = "loading products";
  statusMessage.classList.remove("error");
  retryButton.classList.add("hidden");
  productsGrid.innerHTML = "";
}

function setStatus(message) {
  statusMessage.textContent = message;
  statusMessage.classList.remove("error");
  retryButton.classList.add("hidden");
}

function filterProducts(searchTerm) {
  const normalizedTerm = searchTerm.trim().toLowerCase();

  const filteredProducts = allProducts.filter((product) => {
    return product.title.toLowerCase().includes(normalizedTerm);
  });

  renderProducts(filteredProducts);
  setStatus(`Showing ${filteredProducts.length} products`);
}

searchInput.addEventListener("input", (event) => {
  filterProducts(event.target.value);
});

retryButton.addEventListener("click", fetchProducts);

fetchProducts();
