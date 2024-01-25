<template>
  <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" >&times;</span>
      <h2>Your Cart</h2>
      
      <div v-if="cartItems.length === 0">
        <p>Your cart is empty.</p>
      </div>

      <div v-else class="cart-items">
        <div v-for="item in cartItems" :key="item.productId" class="cart-item">
          <img :src="item.Proimage" alt="Product Image" class="product-image"/>
          <div class="item-details">
            <p class="item-title">{{ item.title }}</p>
            <p class="item-price">{{ item.price }}$</p>
            <p class="item-quantity">Quantity: {{ item.quantity }}</p>
          </div>
        </div>
        <button @click="checkout" class="checkout-button">Checkout</button>
        <button @click="clearCart" class="clear-cart-button">Clear Cart</button> <!-- Clear cart button -->

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CartModal',

  data() {
    return {
      cartItems: []
    };
  },

  props: {
    isVisible: Boolean,
    userId: Number
  },

  async created() {
    this.loadCartItems();
  },

  methods: {
    loadCartItems() {
      const storedCart = localStorage.getItem(`cart-${this.userId}`);
      this.cartItems = storedCart ? JSON.parse(storedCart) : [];
    },

    closeModal() {
      this.$emit('update:isVisible', false);
    },
    clearCart() {
      localStorage.setItem(`cart-${this.userId}`, JSON.stringify([]));
      this.cartItems = [];
      alert("Cart cleared successfully!");
    },

    async checkout() {
      if (this.cartItems.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      try {
        const orderId = await this.addOrder();
        for (let item of this.cartItems) {
          await this.addOrderProducts(item.productId, orderId, item.quantity);
        }

        localStorage.setItem(`cart-${this.userId}`, JSON.stringify([]));
        this.cartItems = [];
        alert("Your order has been placed!");
        this.closeModal();
      } catch (error) {
        console.error("Error during checkout:", error);
        alert("There was a problem processing your order.");
      }
    },

    async addOrder() {
      const totalAmount = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      try {
        const response = await axios.post(`${process.env.VUE_APP_BASE_URL}/order/add`, {
          UserID: this.userId,
          TotalAmount: totalAmount,
          orderStatus: "pending"
        });
        return response.data.orderId;
      } catch (error) {
        console.error('Error adding order:', error);
        throw error;
      }
    },

    async addOrderProducts(productId, orderId, quantity) {
      // Replace with your implementation
      try {
        await axios.post(`${process.env.VUE_APP_BASE_URL}/orderProducst/add`, {
          Orderid: orderId,
          ProductId: productId,
          Quantity: quantity
        });
      } catch (error) {
        console.error('Error adding order products:', error);
        throw error;
      }
    }
  }
};
</script>



  
  <style scoped>
  .modal {
    display: block;
    position: fixed;
    z-index: 1;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  .modal-content {
    position: relative;
    background-color: #fefefe;
    margin: auto;
    padding: 0;
    border: 1px solid #888;
    width: 80%;
    box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  animation-name: animatetop;
  animation-duration: 0.4s
}

@keyframes animatetop {
  from {top: -300px; opacity: 0} 
  to {top: 0; opacity: 1}
}

.close {
  color: white;
  float: right;
  font-size: 28px;
  font-weight: bold;
  margin-right: 15px;
  margin-top: 15px;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.cart-items {
  padding: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.product-image {
  width: 100px;
  height: 200px;
  height: auto;
  margin-right: 20px;
}

.item-details {
  flex-grow: 1;
}

.item-title {
  margin: 0;
  font-weight: bold;
}

.item-price, .item-quantity {
  margin: 0;
}
/* ... your existing styles ... */
.checkout-button {
background-color: #355E3B;
border-radius: 10px;
margin: 10px;
height:40px;
width:100px;
color: white;

}
.clear-cart-button {
background-color: #355E3B;  
border-radius: 10px;
height:40px;
width:100px;
color: white;
}
@media screen and (min-width: 360px) and (max-width: 480px) {
    
  .modal-content{
    width: 70%;
  }
  }
  @media screen and (min-width: 481px) and (max-width: 1024px) {
    li{
        margin: 10px;
    }
    .contact-container {
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .inside-contact-container {
        width: 100%;
        width: 300px;
        padding-left: 15px;
        margin-bottom: 20px;
      }
  }
</style>
  