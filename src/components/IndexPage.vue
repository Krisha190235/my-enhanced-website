<script>
import book1 from '../assets/book1.jpg';
import book2 from '../assets/41jiySKmibL._SL500_.jpg';
import book3 from '../assets/51BDnlOHmvL._SL500_.jpg';

export default {
  name: 'IndexPage',
  data() {
    return {
      book1,
      book2,
      book3
    };
  }
};
</script>

<template>
  <main class="container mt-5">
    <section id="featured-books" class="mt-5">
      <h2>Featured Books</h2>
      <div class="row">
        <div class="col-md-4">
          <div class="card">
            <img :src="book1" class="card-img-top" alt="Cover of Book Title 1">
            <div class="card-body">
              <h5 class="card-title">The Power of Letting Go</h5>
              <p class="card-text">By: John Purkiss</p>
              <p class="card-text">Narrated by: Mark Meadows</p>
              <a href="order.html" class="btn btn-primary">Buy Now</a>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <img :src="book2" class="card-img-top" alt="Cover of Book Title 2">
            <div class="card-body">
              <h5 class="card-title">The Mountain Is You</h5>
              <p class="card-text">By: Brianna Wiest</p>
              <p class="card-text">Narrated by: Stacey Glemboski</p>
              <a href="order.html" class="btn btn-primary">Buy Now</a>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <img :src="book3" class="card-img-top" alt="Cover of Book Title 3">
            <div class="card-body">
              <h5 class="card-title">The Psychology of Money</h5>
              <p class="card-text">By: Morgan Housel</p>
              <p class="card-text">Narrated by: Chris Hill</p>
              <a href="order.html" class="btn btn-primary">Buy Now</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>