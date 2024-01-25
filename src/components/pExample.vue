<template>
  <div class="payment-container">
    <form @submit.prevent="submitPayment">
      <h2>Payment Details</h2>
      <!-- Additional input fields as necessary (e.g., amount, order ID) -->
      <div class="form-group">
        <label for="amount">Amount</label>
        <input type="text" id="amount" v-model="amount" :disabled="true" required>
      </div>

      <!-- Stripe's Card Element for secure card details entry -->
      <div id="card-element" class="form-group"></div>

      <button type="submit" class="pay-button">Pay</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

export default {
  data() {
    return {
      stripe: null,
      cardElement: null,
      amount: this.$route.params.Amount +"$",
            OrderId: null,
    };
  },
  async mounted() {
    await this.initializeStripe();
  },
  async created(){
    this.OrderId = localStorage.getItem('pendingOrderId');

  },
  methods: {
    async initializeStripe() {
      const stripePublicKey = 'pk_test_51OZd1WJFhc9UZk7ff69YNdGJxL8MpHQV8JpWxvt4oTRcr0QFf5UID1tUOg1KecBbimVMz0VeUXMp9VkXvrGCpNp9000z0xV4IH';
      this.stripe = await loadStripe(stripePublicKey);
      const elements = this.stripe.elements();
      this.cardElement = elements.create('card');
      this.cardElement.mount('#card-element');
    },
    async submitPayment() {
      try {
        // Example: Retrieve additional data like amount
        const {  PaymentStatus } = this.$route.params;
        const OrderID = this.OrderId;
        const PaymentMethod ='credit card'

        // Create a token using Stripe's Card Element
        const { token, error } = await this.stripe.createToken(this.cardElement);

        if (error) {
          console.error(error);
          return; // Handle the error
        }

        // Make a request to your backend API with the token and additional data
        const response = await axios.post(`${process.env.VUE_APP_BASE_URL}/payment/pay`, {
          OrderID,
          amount: this.$route.params.Amount, // Use the amount from the data model
          PaymentStatus,
          PaymentMethod,
          stripeToken: token.id,
        });

        // Handle the response
        console.log(response.data);
        alert("Your payment operation was done")
      } catch (error) {
        console.error(error);
        // Handle errors
      }
    },
  },
};
</script>

<style>
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.pay-button {
  background-color: #355E3B;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}
.payment-container {
  background-color: white;
  padding: 20px;
  max-width: 400px;
  margin: 50px auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.pay-button:hover {
  background-color: #90EE90;
}
@media screen and (min-width: 360px) and (max-width: 480px) {
  .form-group{
    display: flex;
    flex-direction: column;
  }
  }
</style>
