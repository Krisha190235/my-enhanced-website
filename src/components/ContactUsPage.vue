<template>
  <main class="container mt-5">
    <h1>Contact Us</h1>

    <!-- Map Section -->
    <section id="location" class="mt-5">
      <h2>Find Us</h2>
      <div class="map-responsive">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345081784!2d144.9554313159045!3d-37.81627937975166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f205ef9b%3A0x5045675218cce40!2sMelbourne%20CBD%2C%20Victoria%2C%20Australia!5e0!3m2!1sen!2sau!4v1604414542843!5m2!1sen!2sau"
          width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section id="contact-form" class="mt-5">
      <h2>Get in Touch</h2>

      <form @submit.prevent="submitForm" novalidate>
        <!-- Name Input -->
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control" id="name" v-model="formData.name" required>
          <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
        </div>

        <!-- Email Input -->
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" v-model="formData.email" required>
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </div>

        <!-- Phone Number Input -->
        <div class="mb-3">
          <label for="phone" class="form-label">Phone Number</label>
          <input type="text" class="form-control" id="phone" v-model="formData.phone" required>
          <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
        </div>

        <!-- Query Input -->
        <div class="mb-3">
          <label for="query" class="form-label">Your Query</label>
          <textarea class="form-control" id="query" v-model="formData.query" rows="5" required></textarea>
          <div v-if="errors.query" class="error-message">{{ errors.query }}</div>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary">Send</button>
      </form>
    </section>

    <!-- Summary Section (Only shows after submission) -->
    <section v-if="submitted" id="form-summary" class="mt-5">
      <h2>Form Submitted Successfully!</h2>
      <p><strong>Name:</strong> {{ formData.name }}</p>
      <p><strong>Email:</strong> {{ formData.email }}</p>
      <p><strong>Phone:</strong> {{ formData.phone }}</p>
      <p><strong>Your Query:</strong> {{ formData.query }}</p>
    </section>
  </main>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        email: '',
        phone: '',
        query: ''
      },
      errors: {},
      submitted: false, // Flag to check if the form has been submitted
    };
  },
  methods: {
    validateForm() {
      this.errors = {};
      if (!this.formData.name) this.errors.name = 'Name is required';
      if (!this.formData.email) this.errors.email = 'Email is required';
      if (!this.formData.phone) this.errors.phone = 'Phone is required';
      if (!this.formData.query) this.errors.query = 'Query is required';
      return Object.keys(this.errors).length === 0;
    },
    submitForm() {
      if (this.validateForm()) {
        this.submitted = true; // Show the summary section after submission
        alert('Form submitted successfully!');
      }
    }
  }
};
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
}

.map-responsive {
  overflow: hidden;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  position: relative;
  height: 0;
}

.map-responsive iframe {
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  position: absolute;
}
</style>