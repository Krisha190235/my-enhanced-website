<template>
  <main class="container mt-5">
        <h1>Order Books</h1>

        <!-- Order Form -->
        <form id="orderForm" novalidate>
            <!-- Book Selection -->
            <div class="mb-3">
                <label for="category" class="form-label">Book Category</label>
                <select id="category" class="form-select" required>
                    <option value="">Select a category</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-Fiction</option>
                    <option value="sci-fi">Sci-Fi</option>
                    <option value="mystery">Mystery</option>
                </select>
                <div class="invalid-feedback" id="categoryError">Please select a book category.</div>
            </div>

            <!-- Book Title -->
            <div class="mb-3">
                <label for="book" class="form-label">Book Title</label>
                <select id="book" class="form-select" required>
                    <option value="">Select a book</option>
                    <option value="book1">Book Title 1</option>
                    <option value="book2">Book Title 2</option>
                    <option value="book3">Book Title 3</option>
                </select>
                <div class="invalid-feedback" id="bookError">Please select a book title.</div>
            </div>

            <!-- Shipping Options -->
            <div class="mb-3">
                <label class="form-label">Shipping Options</label>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="shipping" id="standard" value="standard" required>
                    <label class="form-check-label" for="standard">
                        Standard Shipping - $5.00
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="shipping" id="express" value="express">
                    <label class="form-check-label" for="express">
                        Express Shipping - $15.00
                    </label>
                </div>
                <div class="invalid-feedback" id="shippingError">Please choose a shipping option.</div>
            </div>

            <!-- Payment Information -->
            <div class="mb-3">
                <label for="cardNumber" class="form-label">Card Number</label>
                <input type="text" class="form-control" id="cardNumber" required placeholder="1234 5678 9012 3456">
                <div class="invalid-feedback" id="cardNumberError">Please enter a valid 16-digit card number.</div>
            </div>
            <div class="mb-3">
                <label for="expiryDate" class="form-label">Expiry Date</label>
                <input type="text" class="form-control" id="expiryDate" placeholder="MM/YY" required>
                <div class="invalid-feedback" id="expiryDateError">Please enter the expiry date in MM/YY format.</div>
            </div>
            <div class="mb-3">
                <label for="cvv" class="form-label">CVV</label>
                <input type="text" class="form-control" id="cvv" required placeholder="123">
                <div class="invalid-feedback" id="cvvError">Please enter a 3-digit CVV.</div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary">Place Order</button>
        </form>

        <!-- Subscribe Now Section -->
        <section class="mt-5 text-center">
            <h3>Subscribe for Exclusive Updates</h3>
            <p>Stay updated with the latest book releases, offers, and exclusive content by subscribing to our newsletter.</p>
            <form id="subscribeForm" class="d-flex justify-content-center">
                <input type="email" class="form-control me-2" placeholder="Enter your email" required>
                <button type="submit" class="btn btn-warning">Subscribe Now</button>
            </form>
        </section>
    </main>
</template>

<script>
export default {
  name: 'OrderPage',
};
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
}

/* Subscribe section styles */
#subscribeForm {
  max-width: 500px;
  margin: 0 auto;
}

#subscribeForm input {
  width: 70%;
}

#subscribeForm button {
  width: 30%;
}
</style>