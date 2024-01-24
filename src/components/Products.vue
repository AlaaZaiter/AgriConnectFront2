<template>
  <AppHeader/>
  <div class="AllProductsContainer">
    <div class="subProductsContainer">
    <div class="ProductItem" v-for="product in products" :key="product.id">
      <img :src="product.image" alt="Product Image" class="ProductImg"/>
      <button class="AddToCartBTN" @click="addToCart(product)">Add To Cart</button>
      <p class="ProductTitle">{{ product.Title }}</p>
      <div class="starsReview">
        <p class="PriceNumber">{{ product.price }}$</p>
        <!-- ... Star Ratings and Reviews ... -->
      </div>
    </div>
  </div>
  </div>
  <Footer/>
</template>

<script>
import AppHeader from './Header.vue'
import Footer from './Footer.vue'
import '../CSS/OurProducts.css'
import '../CSS/AllProducts.css'
import axios from 'axios'
import { getUserID } from "../Util/Userdata.js";

export default {
  name: 'ProductsList',
  components: {
    AppHeader,
    Footer,
  },
  data() {
    return {
      products: [],
      userId: null,
    };
  },
  async created() {
    this.fetchProducts();
    this.userId = await getUserID();
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
    addToCart(product) {
  if (this.userId === null) {
    alert('You must be logged in to add items to the cart.');
    return;
  }
  if (product.stock > 0) {
    let cart = JSON.parse(localStorage.getItem(`cart-${this.userId}`)) || [];
    const existingProductIndex = cart.findIndex(item => item.productId === product.id);

    if (existingProductIndex !== -1) {
      // Product already in cart, increment quantity
      cart[existingProductIndex].quantity += 1;
    } else {
      // Add new product to cart
      let cartItem = {
        productId: product.id,
        title: product.Title,
        price: product.price,
        Proimage: product.image,
        quantity: 1,
        addedTime: new Date().getTime()
      };
      cart.push(cartItem);
    }

    localStorage.setItem(`cart-${this.userId}`, JSON.stringify(cart));
    alert('Product added to cart!');
  } else {
    alert('Out Of Stock!');
  }
},

  },
};
</script>

<style scoped>


.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;

}
.closeButton {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  background: none;
  border: none;
  cursor: pointer;
  color: #000; 
  width:50px;
  height:50px;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.productTitle{
  font-size: large;
  font-weight: bold;
  
}

.modalContent {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  
}

</style>
