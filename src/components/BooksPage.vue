<template>
  <main class="container mt-5">
    <h1>Books</h1>

    <!-- Categories Section -->
    <section id="categories" class="mt-4">
      <h2>Categories</h2>
      <ul class="nav nav-pills">
        <li class="nav-item"><a class="nav-link" href="#">Fiction</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Non-Fiction</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Sci-Fi</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Mystery</a></li>
      </ul>
    </section>

    <!-- Book List Section -->
    <section id="book-list" class="mt-4">
      <div class="row">
        <div class="col-md-3">
          <div class="card">
            <img src="../assets/book1.jpg" class="card-img-top" alt="Book Cover" />
            <div class="card-body">
              <h5 class="card-title">Book Title 1</h5>
              <p class="card-text">Author: John Doe</p>
              <a href="#" class="btn btn-primary">Buy Now</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Join the Reading Challenge Section -->
    <section id="reading-challenge" class="mt-5">
      <div class="challenge-card p-4 text-center bg-light rounded">
        <h2>Join Our 30-Day Reading Challenge!</h2>
        <p>Challenge yourself to read more this month and track your progress. Compete with fellow book lovers and see where you stand on the leaderboard!</p>
        <a href="#" class="btn btn-success">Join the Challenge</a>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Scoped styles for books page and reading challenge */
.challenge-card {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px 0;
}

.challenge-card h2 {
  font-size: 1.75rem;
  color: #007bff;
}

.challenge-card p {
  font-size: 1.2rem;
  margin: 15px 0;
}

.challenge-card .btn-success {
  font-size: 1.2rem;
  padding: 10px 20px;
}
</style>