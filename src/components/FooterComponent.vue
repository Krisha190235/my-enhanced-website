<template>
  <footer class="bg-dark text-center text-white p-4 mt-5" :class="textSizeClass">
    <div class="container">
      <p>&copy; {{ currentYear }} Online Bookstore. All rights reserved.</p>
      <p>Last updated: September 2024 | Contact us: 
        <a href="mailto:info@onlinebookstore.com" class="text-white">info@onlinebookstore.com</a>
      </p>
      
      <!-- Follow Us Section -->
      <p>Follow us on:
        <a href="https://www.facebook.com" class="text-white me-2" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-facebook"></i>
        </a>
        <a href="https://www.twitter.com" class="text-white me-2" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-twitter"></i>
        </a>
        <a href="https://www.instagram.com" class="text-white" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-instagram"></i>
        </a>
      </p>

      <!-- CTA Buttons Section -->
      <div class="mt-4 d-flex justify-content-center gap-3">
        <!-- Join Our Community Button -->
        <a href="/community-signup" class="btn btn-warning btn-lg">
          Join Our Book Lovers’ Community
        </a>
        
        <!-- Download Our App Button -->
        <a href="/download-app" class="btn btn-primary btn-lg">
          Download Our App for Easy Access
        </a>
      </div>
      
      <!-- Other Links -->
      <p class="mt-3">
        <a href="#" class="text-white">Contact Us</a> /
        <a href="#" class="text-white">Order Now</a>
      </p>
      
      <!-- Text Size Toggle Section -->
      <div class="text-size-toggle mt-3">
        <p>Change text size:</p>
        <button @click="setTextSize('small')" class="btn btn-light btn-sm">Small</button>
        <button @click="setTextSize('medium')" class="btn btn-light btn-sm">Medium</button>
        <button @click="setTextSize('large')" class="btn btn-light btn-sm">Large</button>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue';
import { useTextSizeStore } from '../textSizeStore';

export default {
  name: 'FooterComponent',
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
  setup() {
    const textSizeStore = useTextSizeStore();
    const textSizeClass = computed(() => {
      return textSizeStore.textSize === 'small' ? 'text-small' :
             textSizeStore.textSize === 'large' ? 'text-large' : 'text-medium';
    });
    const setTextSize = textSizeStore.setTextSize;
    
    return { textSizeClass, setTextSize };
  },
};
</script>

<style scoped>
footer {
  background-color: #333;
  color: white;
  padding: 20px 0;
  text-align: center;
}

footer a {
  color: #ffcc00;
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}

.text-size-toggle {
  margin-top: 20px;
}

button {
  margin: 0 5px;
  color: black;
}

button:hover {
  background-color: #ddd;
}

/* Text size classes */
.text-small {
  font-size: 12px;
}

.text-medium {
  font-size: 16px;
}

.text-large {
  font-size: 24px;
}

/* Add styling for CTA buttons */
.btn-warning {
  background-color: #ffcc00;
  color: black;
  font-weight: bold;
}

.btn-warning:hover {
  background-color: #e6b800;
  color: white;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.btn-primary:hover {
  background-color: #0056b3;
  color: white;
}
</style>