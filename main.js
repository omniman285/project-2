let cardsContainer = document.getElementById("cards");
let cart = document.getElementById("cart");

document.addEventListener("DOMContentLoaded", async () => {
  if (cardsContainer) {
    await getAllProducts();
  }

  if (cart) {
    await getCart();
  }
});

async function getAllProducts() {
  try {
    let response = await fetch(
      "https://restaurant.stepprojects.ge/api/Products/GetAll",
    );

    if (!response.ok) {
      throw new Error("Request failed!");
    }

    let data = await response.json();
    let basketResponse = await fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll");
    let basketData = await basketResponse.json();
    let basketIds = basketData.map(item => item.product.id);

    cardsContainer.innerHTML = "";

    for (let product of data) {
      let isInCart = basketIds.includes(product.id);
      cardsContainer.innerHTML += `
        <div class="card" id="product-${product.id}">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <strong class="card-text">Price: ${product.price} GEL</strong>
            <p class="card-text">Spiciness: ${product.spiciness}</p>
            <p class="card-text">Nuts: ${product.nuts ? "Yes" : "No"}</p>
            <p class="card-text">Vegetarian: ${product.vegeterian ? "Yes" : "No"}</p>
            <button class="btn btn-success add-to-cart ${isInCart ? 'in-cart-btn' : ''}" data-id="${product.id}">
              ${isInCart ? 'In Cart' : 'Add to cart'}
            </button>
          </div>
        </div>
      `;
    }

    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", async () => {
        let id = Number(btn.dataset.id);
        let product = data.find((item) => item.id === id);
        await addToCart(id, product.price);
        
        btn.classList.add('in-cart-btn');
        btn.textContent = 'In Cart';
      });
    });
  } catch (error) {
    console.error(error);
  }
}

async function getCart() {
  try {
    let response = await fetch(
      "https://restaurant.stepprojects.ge/api/Baskets/GetAll",
    );

    if (!response.ok) {
      throw new Error("Request failed!");
    }

    let data = await response.json();

    cart.innerHTML = "";

    let totalPrice = 0;

    for (let item of data) {
      totalPrice += item.price * item.quantity;
    }

    if (data.length > 0) {
      cart.innerHTML += `
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4>Total: ${totalPrice.toFixed(2)} GEL</h4>
          <button id="order-now" class="btn btn-primary">Order Now</button>
        </div>
      `;
    } else {
      cart.innerHTML += `<h4>Your cart is empty</h4>`;
    }

    for (let item of data) {
      let product = item.product;

      cart.innerHTML += `
        <div class="card mb-3" style="border: 1px solid #fc101083; border-radius: 8px;">
          <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 180px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <strong class="card-text">Price: ${item.price} GEL</strong>
            <p class="card-text">Quantity: ${item.quantity}</p>
            <p class="card-text">Spiciness: ${product.spiciness}</p>
            <p class="card-text">Nuts: ${product.nuts ? "Yes" : "No"}</p>
            <p class="card-text">Vegetarian: ${product.vegeterian ? "Yes" : "No"}</p>
            <button class="btn btn-danger remove-from-cart" data-id="${product.id}">
              Remove
            </button>
          </div>
        </div>
      `;
    }

    document.querySelectorAll(".remove-from-cart").forEach((btn) => {
      btn.addEventListener("click", async () => {
        let id = Number(btn.dataset.id);
        await removeFromCart(id);
      });
    });

    const orderBtn = document.getElementById("order-now");
    if (orderBtn) {
      orderBtn.addEventListener("click", async () => {
        for (let item of data) {
          await fetch(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${item.product.id}`, {
            method: "DELETE",
          });
        }
        alert("Successfully ordered!");
        await getCart();
      });
    }
  } catch (error) {
    console.error(error);
  }
}

async function addToCart(productId, productPrice) {
  try {
    let newProduct = {
      quantity: 1,
      price: productPrice,
      productId: productId,
    };

    let response = await fetch(
      "https://restaurant.stepprojects.ge/api/Baskets/AddToBasket",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      },
    );

    if (!response.ok) {
      throw new Error("Request failed!");
    }

    if (cart) {
      await getCart();
    }
  } catch (error) {
    console.error(error);
  }
}

async function removeFromCart(productId) {
  try {
    let response = await fetch(
      `https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${productId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error("Request failed!");
    }

    const btn = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
    if (btn) {
      btn.classList.remove('in-cart-btn');
      btn.textContent = 'Add to cart';
    }
    
    await getCart();
  } catch (error) {
    console.error(error);
  }
}


const playlist = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", 
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", 
  "https://www.chosic.com/wp-content/uploads/2021/04/The-Grand-Succession-Chinese-Background-Music.mp3",
  "https://www.chosic.com/wp-content/uploads/2021/04/Lotus-Flower-Chinese-Background-Music.mp3",
  "https://www.chosic.com/wp-content/uploads/2021/04/Chinese-New-Year-Traditional-Chinese-Music.mp3",
  "https://www.chosic.com/wp-content/uploads/2021/04/Bamboo-Forest-Chinese-Background-Music.mp3",
  "https://www.chosic.com/wp-content/uploads/2021/04/The-Great-Wall-Traditional-Chinese-Music.mp3",
  "https://www.chosic.com/wp-content/uploads/2021/04/Cherry-Blossoms-Traditional-Chinese-Music.mp3",
  "https://www.chosic.com/wp-content/uploads/2021/04/Tea-Ceremony-Traditional-Chinese-Music.mp3",
  "https://www.chosic.com/wp-content/uploads/2021/04/Mountain-Temple-Traditional-Chinese-Music.mp3"
];

let currentAudio = new Audio();
const musicBtn = document.getElementById("play-random-music");

if (musicBtn) {
  musicBtn.addEventListener("click", () => {
    let randomIndex = Math.floor(Math.random() * playlist.length);
    
    currentAudio.pause();
    currentAudio.src = playlist[randomIndex];
    
    currentAudio.play().catch(error => {
      console.warn("Playback error. Check your internet connection:", playlist[randomIndex]);
    });
  });
}