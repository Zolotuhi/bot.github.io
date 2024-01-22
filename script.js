const cart = [];

function openModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "block";
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "none";
}

function sendOrderToTelegram(cart, customerInfo) {
    const botToken = '6692814846:AAEB0ysOUSfLmSZPdBKqKCOKqMgxJ09bEgo'; // Замените на ваш реальный токен
    const chatId = '@lrbotshoptt'; // Замените на ваш реальный ID канала
    let message = 'Заказ оформлен:\n';

    cart.forEach(item => {
        message += `Товар: ${item.name}\nЦена: ${item.price} ₸\nКоличество: ${item.quantity}\n`;
    });

    message += `\nИнформация о клиенте:\nТелефон: ${customerInfo.phone}\nEmail: ${customerInfo.email}`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`)
    .then(response => response.json())
    .then(data => {
        console.log('Order sent to Telegram', data);
    })
    .catch(error => {
        console.error('Error sending order to Telegram', error);
    });
}

function addToCart(productName, productPrice) {
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    updateCart();
}

function removeFromCart(productName) {
    const productIndex = cart.findIndex(item => item.name === productName);
    if (productIndex > -1) {
        if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity--;
        } else {
            cart.splice(productIndex, 1);
        }
    }
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemElement = document.createElement('li');
        itemElement.innerText = `${item.name} - ${item.price} ₸ (${item.quantity})`;

        const addButton = document.createElement('button');
        addButton.innerText = '+';
        addButton.classList.add('quantity-button', 'add');
        addButton.onclick = () => addToCart(item.name, item.price);
        itemElement.appendChild(addButton);

        const removeButton = document.createElement('button');
        removeButton.innerText = '-';
        removeButton.classList.add('quantity-button', 'remove');
        removeButton.onclick = () => removeFromCart(item.name);
        itemElement.appendChild(removeButton);

        cartItems.appendChild(itemElement);
    });

    cartTotal.innerText = total;
}

document.querySelectorAll('.product .add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const product = e.target.closest('.product');
        const productName = product.querySelector('h2').innerText;
        const productPriceText = product.querySelector('p').innerText;
        const productPrice = parseInt(productPriceText.replace(/[^0-9]/g, ''));
        addToCart(productName, productPrice);
    });
});

document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const customerInfo = { phone: phone, email: email };

    sendOrderToTelegram(cart, customerInfo);
    closeModal('orderModal');
    clearCart();
});

document.getElementById('checkout-button').addEventListener('click', function() {
    openModal('orderModal');
});

document.getElementById('clear-cart-button').addEventListener('click', clearCart);

function clearCart() {
    cart.length = 0;
    updateCart();
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
}
