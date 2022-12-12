const formatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

const elementGrid = document.getElementById("gridContent");
const loading = document.getElementById("loading");
const total = document.getElementById("total-cart");
const cartList = document.getElementsByClassName("cart-items");
let cart = [];
let products = [];

const fetchIniProducts = () => {
  loading.style.display = "block";
  fetch("https://fakestoreapi.com/products?limit=19")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      loading.style.display = "none";
      elementGrid.innerHTML = data
        .map((product) => templateGrid(product))
        .join("");
    })
    .catch((error) => {
      console.error(error);
      loading.style.display = "block";
      loading.textContent = error;
    });
};

const templateGrid = (product) => `<div class="card">
      <div class="card-header">
          <img
          src="${product.image}"
          class="card-image"
          alt=""
          />
      </div>
      <div class="card-body">
          <h3>${product.title}</h3>
          <div class="container-price">
              <h4>${formatter.format(product.price)}</h4>
              <input type="number" id="qty-${
                product.id
              }" name="qty" min="1" value="1" class="input" />
          </div>
          <p>${product.description}</p>
          <button class="btn" onclick="add(${product.id})">Add to cart</button>
          <a href="${product.slug}">Learn more</a>
      </div>
  </div>`;

const templateCart = (cart) => `<li><div
          class="cart-product"
          style="background-image: url(${cart.image});"
        >
          <input readonly class="quantity" value="${cart.qty}" />
        </div>
        <div class="cart-description">
          <h3>${cart.title}</h3>
          <span class="subtotal">${formatter.format(cart.price)}
            <button class="btn-trash" onclick="remove(${
              cart.id
            })">Remove</button>
          </span>
        </div></li>`;

const remove = (id) => {
  let cart = JSON.parse(localStorage.getItem("cartList"));
  let newCart = cart.filter((c) => c.id !== id);
  if (newCart) {
    localStorage.setItem("cartList", JSON.stringify(newCart));
  }
  loadListCart();
};

const add = (id) => {
  let qty = document.getElementById(`qty-${id}`);
  const product = products.find((f) => f.id === id);
  product.qty = parseInt(qty.value) || 1;
  product.price = product.price * product.qty;

  let cart = JSON.parse(localStorage.getItem("cartList"));
  if (cart) {
    const index = cart.findIndex((f) => f.id === id);

    if (index >= 0) {
      cart[index].qty += product.qty;
      cart[index].price = cart[index].price * cart[index].qty;
    } else {
      cart.push(product);
    }
  } else {
    cart = [product];
  }
  localStorage.setItem("cartList", JSON.stringify(cart));
  loadListCart();
};

const loadListCart = () => {
  let cart = JSON.parse(localStorage.getItem("cartList"));
  cartList[0].innerHTML = cart.map((item) => templateCart(item)).join("");
  total.innerText = formatter.format(cart.reduce((a, b) => a + b.price, 0));
};

window.addEventListener("load", (event) => {
  fetchIniProducts();
  loadListCart();
});
