// AJAX PRODUCT INFO
$.get("./store.json").done((data) => {
  const products = data.products;
  products.forEach((product, i) => {
    const initTemplate = `<div class="product col-lg-3 col-md-6 mt-3" data-id="${product.id}" draggable="true">
     <img src="./${product.photo}" alt="" draggable="false" />
     <h5 class="product-title">${product.title}</h5>
     <p class="product-brand">${product.brand}</p>
     <p class="product-price">${product.price}</p>
     <button class="add" data-id="${product.id}">
       Add
     </button>
   </div>`;
    $(".products-group").append(initTemplate);
  });

  // SEARCH LISTENER
  $(".search-tab .input").on("change", (e) => {
    $(".products-group").html("");
    let userInput = e.target.value;
    $(".cart-drag").html("");
    $(".cart-drag").append('<h5 class="drag-here">Darg items here</h5>');
    productsSearched(userInput);
  });

  // SEARCH
  // - put the products searched on the products group box.
  function productsSearched(userInput) {
    $(".product").html("");

    $.get("./store.json").done((data) => {
      const products = data.products;
      products.forEach((product, i) => {
        if (product.title.includes(userInput)) {
          // 템플릿
          const yellowBg = `<span style='background-color: yellow;'>${userInput}</span>`;
          const template = `
          <div class="product col-lg-3 col-md-6 mt-3" data-id="${
            product.id
          }" draggable="true">
          <img src="./pr${i + 1}.JPG" draggable alt="" />
          <h5 class="product-title">${product.title.replace(
            userInput,
            yellowBg
          )}</h5>
          <p class="product-brand">${product.brand}</p>
          <p class="product-price">￦${product.price}</p>
          <button class="add" data-id="${product.id}">Add</button>
          </div>`;

          $(".products-group").eq(i).append(template);
        }
      });
    });
  }

  // Add button
  const cart = $(".cart-drag");
  const cartText = $(".drag-here");

  let count = 1;
  let shoppingList = [];
  let addedList = [];
  $(".add").on("click", (e) => {
    let productId = e.target.dataset.id;
    let indexNum = addedList.findIndex((added) => {
      return added.id == productId;
    });

    if (indexNum == -1) {
      let currentProduct = products.find((product) => {
        return product.id == productId;
      });
      currentProduct.count = 1;
      addedList.push(currentProduct);
    } else {
      addedList[indexNum].count++;
    }

    // after clicking an Add btn, html will be spreaded in cart.
    cartText.html("");
    cart.html("");
    addedList.forEach((added, i) => {
      cart.append(`
            <div class="product added-item col-md-3 bg-white">
              <img src="${added.photo}">
              <h4>${added.title}</h4>
              <h4>${added.brand}</h4>
              <p>${added.price}</p>
              <input type="number" value="${added.count}" class="${added.id} input-btn w-100">
            </div>
          `);
    });
    // SHOWING THE ORDER PAPER
    $(".final-price-modal").css("display", "block");

    let totalprice = priceTotal();
    $(".final-price").html(`${totalprice} won`);
  });

  // DRAG AND DROP PRODUCTS
  $(".product").on("dragstart", (e) => {
    e.originalEvent.dataTransfer.setData("id", e.target.dataset.id);
  });
  cart.on("dragover", (e) => {
    e.preventDefault();
  });
  cart.on("drop", (e) => {
    let hidProductId = e.originalEvent.dataTransfer.getData(
      "id",
      e.target.dataset.id
    );
    cartText.html("");
    $(".add").eq(hidProductId).click();
  });

  // PRICE CALC
  function priceTotal() {
    let totalPrice = 0;
    for (let i = 0; i < $(".input-btn").length; i++) {
      let total = 0;
      let quantity = parseInt($(".input-btn").eq(i).val());
      let price = parseInt($(".added-item p").eq(i).text());
      total = quantity * price;
      totalPrice += total;
    }
    console.log(totalPrice);
    return totalPrice;
  }

  // Show the Receipt when BUY BUTTON is cicked
  // - SHOW
  const modal = $(".order-modal");
  const buyFinalBtn = $(".buy-final");
  buyFinalBtn.on("click", () => {
    modal.addClass("show-modal");
  });
  // - close
  const closeModal = $(".close");

  closeModal.on("click", () => {
    modal.removeClass("show-modal");
  });

  modal.on("click", (e) => {
    if (e.target == modal[0]) {
      modal.removeClass("show-modal");
    }
  });

  let now = new Date();
  console.log(now);
  //
  let name = "";
  let phone = "";

  $("#name").on("input", function () {
    name = $("#name").val();
    console.log(name);
  });

  $("#phone").on("input", function () {
    phone = $("#phone").val();
  });
  //
  // - receipt
  $(".show-receipt").click(function () {
    modal.removeClass("show-modal");
    $(".receipt").css("display", "block");
    //
    const canvas = document.getElementById("canvas");
    const c = canvas.getContext("2d");
    c.font = "10px dotum";
    c.fillText(`${now}`, 1, 13);
    c.font = "16px dotum";
    c.fillText("Customer's name : " + name, 20, 40);
    c.fillText("Contact : " + phone, 20, 70);
    c.fillText("        ", 20, 60);
    c.fillText(`---Fianl price---`, 90, 120);
    c.fillText($(".final-price").html(), 112, 140);
  });
  $(".close-receipt").on("click", () => {
    $(".receipt").css("display", "none");
  });
});
