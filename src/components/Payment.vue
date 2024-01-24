<template>
<div>
<AppHeader/>
  <div class="payment-container">
    <form @submit.prevent="submitPayment">
      <h2>Payment Details</h2>
      
      <div class="form-group">
        <label for="cardName">Name on Card</label>
        <input type="text" id="cardName" v-model="cardName" required>
      </div>

      <div class="form-group">
        <label for="cardNumber">Card Number</label>
        <input type="text" id="cardNumber" v-model="cardNumber" required>
      </div>

      <div class="form-group">
        <label for="expiryDate">Expiry Date</label>
        <input type="month" id="expiryDate" v-model="expiryDate" required>
      </div>

      <div class="form-group">
        <label for="cvv">CVV</label>
        <input type="number" id="cvv" v-model="cvv" required>
      </div>

      <button type="submit" class="pay-button">Pay</button>
    </form>
  </div>
  <Footer/>
  </div>
</template>

<script>
import AppHeader from './Header.vue'
import Footer from './Footer.vue'
export default {
  name: 'PaymentContainer',
  components: {
    AppHeader,
    Footer,
  },
  data() {
    return {
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    };
  },
  methods: {
    submitPayment() {
      // Implement your submit logic here
      alert('Payment Submitted!');
    },
  },
};
</script>

<style>
.payment-container {
  background-color: white;
  padding: 20px;
  max-width: 400px;
  margin: 50px auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

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

.pay-button:hover {
  background-color: #90EE90;
}
</style>
