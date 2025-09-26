<template>
  <main class="container mt-5">
    <h1>About Us</h1>

    <!-- Mission Statement -->
    <section id="mission" class="mt-4">
      <h2>Our Mission</h2>
      <p>Our mission is to foster a love for reading and provide a diverse range of books to readers of all ages and interests.</p>
    </section>

    <!-- Team Section -->
    <section id="team" class="mt-5">
      <h2>Meet Our Team</h2>
      <div class="row">
        <div class="col-md-4">
          <img src="../assets/team1.jpeg" class="img-fluid rounded-circle" alt="Portrait of John Doe, Founder & CEO">
          <h5>John Doe</h5>
          <p>Founder & CEO</p>
        </div>
        <div class="col-md-4">
          <img src="../assets/images.jpeg" class="img-fluid rounded-circle" alt="Portrait of Jane Smith, Chief Operating Officer">
          <h5>Jane Smith</h5>
          <p>Chief Operating Officer</p>
        </div>
        <div class="col-md-4">
          <img src="../assets/images (1).jpeg" class="img-fluid rounded-circle" alt="Portrait of Michael Brown, Head of Marketing">
          <h5>Michael Brown</h5>
          <p>Head of Marketing</p>
        </div>
      </div>
    </section>

    <!-- Store Gallery -->
    <section id="gallery" class="mt-5">
      <h2>Our Store Gallery</h2>
      <div class="row">
        <div class="col-md-4">
          <img src="../assets/exterier.jpeg" class="img-fluid rounded" alt="Exterior view of Online Bookstore, Store 1">
        </div>
        <div class="col-md-4">
          <img src="../assets/interior.jpeg" class="img-fluid rounded" alt="Interior view of Online Bookstore, Store 2">
        </div>
        <div class="col-md-4">
          <img src="../assets/reading launge.jpeg" class="img-fluid rounded" alt="Reading lounge in Online Bookstore, Store 3">
        </div>
      </div>
    </section>
  </main>
</template>

<script>


export default {
  name: 'AboutUsPage',
  data() {
    
  },
};
</script>

<style scoped>
/* Scoped styles for about us page */
</style>