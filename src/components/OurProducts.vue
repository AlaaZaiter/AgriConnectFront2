<template>
  <div id="OurProductsContainer">
    <p class="ProductsTitle">Explore Our Products</p>
    <div class="SubOurProductsContainer">
      <div v-for="product in firstFourProducts" :key="product.id" class="ProductItem">
        <img :src="product.image" alt="Product Image" class="ProductImg" />
        <button class="AddToCartBTN"> Add To Cart</button>
        <p class="ProductTitle">{{ product.Title }}</p>
        <div class="starsReview">
          <p class="PriceNumber">{{ product.price }}</p>
          <p class="star"> &#9733;</p>
   <p class="star"> &#9733;</p>
   <p class="star"> &#9733;</p>
   <p class="star"> &#9733;</p>
   <p class="star"> &#9733;</p>
   <p class="numderReview"> (65)</p>        </div>
      </div>
    </div>
    <button class="ProductsButton" @click="goToProducts">View All Products</button>
  </div>
</template>

<script>
import axios from 'axios';
import '../CSS/OurProducts.css';

export default {
  name: 'OurProductsContainer',
  data() {
    return {
      products: [],
    };
  },
  computed: {
    firstFourProducts() {
      return this.products.slice(0, 4);
    },
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/product/getAll`);
        this.products = response.data.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    goToProducts() {
      // Use router.push to navigate to the Products component
      this.$router.push('/products');
    },
  },
};
</script>

<style scoped>
/* Add any scoped styles here if needed */
</style>
