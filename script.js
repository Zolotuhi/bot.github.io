function openModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "block";
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "none";
}


document.getElementById('light-theme-toggle').addEventListener('click', function() {
    document.body.className = 'light-theme';
});

document.getElementById('dark-theme-toggle').addEventListener('click', function() {
    document.body.className = 'dark-theme';
});

document.getElementById('orange-theme-toggle').addEventListener('click', function() {
    document.body.className = 'orange-theme';
});


document.addEventListener('DOMContentLoaded', () => {
    const cart = [];


    document.getElementById('clear-cart-button').addEventListener('click', () => {
        clearCart();
    });

    document.querySelectorAll('.product button').forEach(button => {
        button.addEventListener('click', (e) => {
            const product = e.target.parentElement;
            const productName = product.querySelector('h2').innerText;
            const productPriceText = product.querySelectorAll('p')[1].innerText; // Получаем текст с ценой

            // Извлекаем числовое значение из строки цены
            const productPrice = parseInt(productPriceText.replace(/[^0-9]/g, ''));

            cart.push({ name: productName, price: productPrice });
            updateCart();
        });
    });

    
    // Закрытие модального окна при клике вне его области
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
        }
    }

    function updateCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;
            const itemElement = document.createElement('li');
            itemElement.innerText = `${item.name} - ${item.price} ₸`;

            const removeButton = document.createElement('button');
            removeButton.innerText = 'Удалить';
            removeButton.onclick = function() {
                removeFromCart(index);
            };

            itemElement.appendChild(removeButton);
            cartItems.appendChild(itemElement);
        });

        cartTotal.innerText = total;
    }

    function removeFromCart(itemIndex) {
        cart.splice(itemIndex, 1);
        updateCart();
    }

    function clearCart() {
        cart.length = 0; // Очищаем массив корзины
        updateCart(); // Обновляем отображение корзины
    }
});