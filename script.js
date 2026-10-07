// ----- footer year -----
document.getElementById("year").textContent = new Date().getFullYear();


// ----- cart -----
var cart = [];
var cartBadge = document.getElementById("cartCount");
var cartItems = document.getElementById("cartItems");
var cartTotal = document.getElementById("cartTotal");
var deliveryNote = document.getElementById("deliveryNote");
var cartSubtotal = document.getElementById("cartSubtotal");
var discountRow = document.getElementById("discountRow");
var cartDiscount = document.getElementById("cartDiscount");
var discountOn = false; 

function formatPrice(amount) {
  return "\u20B9" + amount.toLocaleString("en-IN");
}

function renderCart() {
  cartItems.innerHTML = ""; 
  var count = 0;
  var total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="text-muted">Your cart is empty.</p>';
  }

  cart.forEach(function (item, index) {
    count += item.qty;
    total += item.price * item.qty;

    var row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML =
      '<div><div class="fw-semibold">' + item.name + '</div>' +
      '<div class="small text-muted">' + formatPrice(item.price) + ' each</div></div>' +
      '<div class="d-flex align-items-center gap-2">' +
      '<button type="button" class="btn btn-sm btn-outline-dark" data-action="minus" data-index="' + index + '">-</button>' +
      '<span>' + item.qty + '</span>' +
      '<button type="button" class="btn btn-sm btn-outline-dark" data-action="plus" data-index="' + index + '">+</button>' +
      '<button type="button" class="btn btn-sm btn-outline-danger" data-action="remove" data-index="' + index + '">Remove</button>' +
      '</div>';
    cartItems.appendChild(row);
  });

    var discount = discountOn ? Math.round(total * 0.2) : 0;
  var payable = total - discount;

  cartBadge.textContent = count;
  cartSubtotal.textContent = formatPrice(total);
  cartTotal.textContent = formatPrice(payable);

  if (discount > 0) {
    discountRow.classList.remove("d-none");
    cartDiscount.textContent = "-" + formatPrice(discount);
  } else {
    discountRow.classList.add("d-none");
  }

  if (payable === 0) {
    deliveryNote.textContent = "";
  } else if (payable > 699) {
    deliveryNote.textContent = "You get free delivery on this order.";
  } else {
    deliveryNote.textContent = "Add " + formatPrice(700 - payable) + " more for free delivery.";
  }
}
// add to cart buttons
var addButtons = document.querySelectorAll(".add-btn");

addButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    var card = button.closest(".product-card");
    var name = card.querySelector("h5").textContent.trim();
    var priceText = card.querySelector(".price").firstChild.textContent;
    var price = parseInt(priceText.replace(/[^0-9]/g, ""), 10);

    var existing = cart.find(function (item) { return item.name === name; });
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name: name, price: price, qty: 1 });
    }
    renderCart();

    // "Added" feedback (clearTimeout fixes the fast-click problem)
    clearTimeout(button.resetTimer);
    button.textContent = "Added";
    button.classList.add("added");
    button.resetTimer = setTimeout(function () {
      button.textContent = "Add to cart";
      button.classList.remove("added");
    }, 1000);
  });
});

// + / - / remove inside the cart panel
cartItems.addEventListener("click", function (event) {
  var btn = event.target.closest("button[data-action]");
  if (!btn) return;

  var index = parseInt(btn.getAttribute("data-index"), 10);
  var action = btn.getAttribute("data-action");

  if (action === "plus") {
    cart[index].qty++;
  } else if (action === "minus") {
    cart[index].qty--;
    if (cart[index].qty === 0) cart.splice(index, 1);
  } else if (action === "remove") {
    cart.splice(index, 1);
  }
  renderCart();
});

renderCart();


// ----- filter products by category -----
var filterButtons = document.querySelectorAll(".filter-btn");
var products = document.querySelectorAll(".product");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    var chosen = button.getAttribute("data-filter");

    // make only the clicked button dark
    filterButtons.forEach(function (b) {
      b.classList.remove("btn-dark");
      b.classList.add("btn-outline-dark");
    });
    button.classList.remove("btn-outline-dark");
    button.classList.add("btn-dark");

    // show or hide each product
    products.forEach(function (item) {
      if (chosen === "all" || item.getAttribute("data-category") === chosen) {
        item.classList.remove("d-none");
      } else {
        item.classList.add("d-none");
      }
    });
  });
});


// ----- newsletter form validation -----
var form = document.getElementById("newsletterForm");
var emailInput = document.getElementById("emailInput");
var emailMsg = document.getElementById("emailMsg");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop page reload

  var email = emailInput.value.trim();
  var pattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  if (email === "") {
    emailMsg.textContent = "Please enter your email address.";
    emailMsg.className = "d-block mt-2 msg-error";
  } else if (!pattern.test(email)) {
    emailMsg.textContent = "Enter a valid email, like name@gmail.com";
    emailMsg.className = "d-block mt-2 msg-error";
    } else {
    discountOn = true;
    renderCart();
    emailMsg.textContent = "Thanks for subscribing! 20% off has been applied to your cart.";
    emailMsg.className = "d-block mt-2 msg-ok";
    form.reset();
  }

});
