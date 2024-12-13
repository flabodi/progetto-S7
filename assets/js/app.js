const API_URL = "https://striveschool-api.herokuapp.com/api/product/";
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViZmI3YmQyMjA3MTAwMTVkZTJmNDciLCJpYXQiOjE3MzQwODc4MDEsImV4cCI6MTczNTI5NzQwMX0.qKqYNyPzROpPbiPUq_WrNuwwezEZ4Hf84wDpcXxlv08";

const headers = {
  "Content-Type": "application/json",
  Authorization: TOKEN,
};

// Funzione per recuperare tutti i prodotti
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

// Funzione per renderizzare i prodotti
function renderProducts(products) {
  const productList = document.getElementById("products");
  if (!productList) return; // Verifica se siamo sulla pagina giusta

  productList.innerHTML = "";
  const template = document.getElementById("product-template").content;

  products.forEach((product) => {
    const clone = template.cloneNode(true);
    clone.querySelector(".product-name").textContent = product.name;
    clone.querySelector(".product-description").textContent = product.description;
    clone.querySelector(".product-brand").textContent = product.brand;
    clone.querySelector(".product-price").textContent = `$${product.price}`;
    clone.querySelector(".product-image").src = product.imageUrl;

    // Funzione per cancellare un prodotto
    clone.querySelector(".delete-btn").addEventListener("click", () => deleteProduct(product._id));

    productList.appendChild(clone);
  });
}

// Funzione per creare un nuovo prodotto
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

// Funzione per recuperare un prodotto per ID
async function fetchProductById(productId) {
  try {
    const response = await fetch(`${API_URL}${productId}`, { headers });
    if (!response.ok) throw new Error("Failed to fetch product");
    const product = await response.json();
    fillForm(product);
  } catch (error) {
    console.error("Error fetching product:", error);
  }
}

// Funzione per riempire il form di modifica con i dettagli del prodotto
function fillForm(product) {
  document.getElementById("name").value = product.name;
  document.getElementById("description").value = product.description;
  document.getElementById("brand").value = product.brand;
  document.getElementById("imageUrl").value = product.imageUrl;
  document.getElementById("price").value = product.price;
  document.getElementById("deleteProduct").onclick = () => deleteProduct(product._id); // Aggiunge l'azione al pulsante "Delete"
}

// Funzione per aggiornare un prodotto
async function updateProduct(productId, updatedProduct) {
  try {
    const response = await fetch(`${API_URL}${productId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updatedProduct),
    });
    if (!response.ok) throw new Error("Failed to update product");
    alert("Product updated successfully");
    window.location.href = "index.html"; // Redirige alla homepage dopo l'aggiornamento
  } catch (error) {
    console.error("Error updating product:", error);
  }
}

// Funzione per eliminare un prodotto
async function deleteProduct(productId) {
  try {
    const response = await fetch(`${API_URL}${productId}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) throw new Error("Failed to delete product");
    alert("Product deleted successfully");
    window.location.href = "index.html"; // Redirige alla homepage dopo l'eliminazione
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}

// Logica per il form di creazione prodotto
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

// Logica per il form di modifica prodotto
if (document.getElementById("editForm")) {
  const form = document.getElementById("editForm");
  const productId = new URLSearchParams(window.location.search).get("id"); // Otteniamo l'ID del prodotto dalla query string
  if (productId) {
    fetchProductById(productId); // Recuperiamo il prodotto se l'ID è presente

    form.onsubmit = (event) => {
      event.preventDefault();
      const updatedProduct = {
        name: form.name.value,
        description: form.description.value,
        brand: form.brand.value,
        imageUrl: form.imageUrl.value,
        price: parseFloat(form.price.value),
      };
      updateProduct(productId, updatedProduct); // Aggiorniamo il prodotto
    };
  }
}

// Recupero e renderizzazione dei prodotti per la pagina principale
if (document.getElementById("products")) {
  fetchProducts();
}