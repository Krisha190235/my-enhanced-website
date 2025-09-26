document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('orderForm');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the form from submitting for now
            let isValid = true;

            // Validate Book Selection
            const bookSelect = document.getElementById('book');
            if (bookSelect.value === '') {
                alert('Please select a book.');
                isValid = false;
            }

            // Validate Shipping Option
            const shippingOptions = document.getElementsByName('shipping');
            let shippingSelected = false;
            shippingOptions.forEach((option) => {
                if (option.checked) shippingSelected = true;
            });
            if (!shippingSelected) {
                alert('Please select a shipping option.');
                isValid = false;
            }

            if (isValid) {
                alert('Order submitted successfully!');
            }
        });
    }
});