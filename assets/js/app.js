const API_URL = "https://striveschool-api.herokuapp.com/api/product/";
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViZmI3YmQyMjA3MTAwMTVkZTJmNDciLCJpYXQiOjE3MzQwODc4MDEsImV4cCI6MTczNTI5NzQwMX0.qKqYNyPzROpPbiPUq_WrNuwwezEZ4Hf84wDpcXxlv08";

const headers = {
  "Content-Type": "application/json",
  Authorization: TOKEN,
};

// Fetch all products
async function fetchProducts() {
  try {
    const response = await fetch(API_URL, { headers });
    if (!response.ok) throw new Error("Failed to fetch products");
    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Render products
function renderProducts(products) {
  const productList = document.getElementById("products");
  if (!productList) return; // Ensure we're on the correct page

  productList.innerHTML = "";
  const template = document.getElementById("product-template").content;

  products.forEach((product) => {
    const clone = template.cloneNode(true);
    clone.querySelector(".product-name").textContent = product.name;
    clone.querySelector(".product-description").textContent = product.description;
    clone.querySelector(".product-brand").textContent = product.brand;
    clone.querySelector(".product-price").textContent = `$${product.price}`;
    clone.querySelector(".product-image").src = product.imageUrl;

    // Set the links with the actual product ID
    const editButton = clone.querySelector(".edit-btn");
    editButton.href = `edit.html?id=${product._id}`;

    const detailButton = clone.querySelector(".detail-btn");
    detailButton.href = `detail.html?id=${product._id}`;

    clone.querySelector(".delete-btn").addEventListener("click", () => deleteProduct(product._id));

    productList.appendChild(clone);
  });
}

// Create a new product
async function createProduct(product) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error("Failed to create product");
    fetchProducts();
  } catch (error) {
    console.error("Error creating product:", error);
  }
}

// Fetch product details by ID
async function fetchProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (productId) {
    try {
      const response = await fetch(`${API_URL}${productId}`, { headers });
      if (!response.ok) throw new Error("Failed to fetch product details");
      const product = await response.json();
      renderProductDetails(product);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  }
}

// Render product details
function renderProductDetails(product) {
  const productDetail = document.getElementById("product-detail");
  if (!productDetail) return; // Ensure we're on the correct page

  productDetail.innerHTML = `
    <div class="col-md-6 mx-auto">
      <div class="card">
        <img src="${product.imageUrl}" class="card-img-top" alt="Product image">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <p class="card-text"><strong>Brand:</strong> ${product.brand}</p>
          <p class="card-text"><strong>Price:</strong> $${product.price}</p>
        </div>
      </div>
    </div>
  `;
}

// Update product details
async function updateProduct(productId, updatedProduct) {
  try {
    const response = await fetch(`${API_URL}${productId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updatedProduct),
    });
    if (!response.ok) throw new Error("Failed to update product");
    window.location.href = `detail.html?id=${productId}`;
  } catch (error) {
    console.error("Error updating product:", error);
  }
}

// Delete product
async function deleteProduct(productId) {
  try {
    const response = await fetch(`${API_URL}${productId}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) throw new Error("Failed to delete product");
    fetchProducts(); // Refresh the product list
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}

// Attach form submission logic for creating a product
if (document.getElementById("productForm")) {
  const form = document.getElementById("productForm");
  form.onsubmit = (event) => {
    event.preventDefault();
    const newProduct = {
      name: form.name.value,
      description: form.description.value,
      brand: form.brand.value,
      imageUrl: form.imageUrl.value,
      price: parseFloat(form.price.value),
    };
    createProduct(newProduct);
    form.reset();
  };
}

// Fetch products when on the homepage
if (document.getElementById("products")) {
  fetchProducts();
}

// Fetch product details when on the product detail page
if (document.getElementById("product-detail")) {
  fetchProductDetails();
}