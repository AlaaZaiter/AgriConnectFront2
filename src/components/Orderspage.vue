<template>
  <div>
    <AppHeader/>
    <div class="TableContainer">
      <table class="orders-table">
        <thead>
          <tr>
            <th >Order ID</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Products</th>
            <th>Pay</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td data-label="Order ID">{{order.id}}</td>
            <td data-label="Amount">{{ order.TotalAmount }}</td>
            <td data-label="Order Status">{{order.orderStatus}}</td>
            <td data-label="Date">{{ order.created_at }}</td>
            <td data-label="ProductsButton">
              <button class="SeeProductsBTN" @click="openProductsModal(order.id)">See your products</button>
              <!-- Products Modal -->
              <div v-if="isProductsModalOpen" class="modal">
                <div class="modalContent">
                  <button @click.stop="closeProductsModal">
            <img src='../images/closed.png' class="closeButton"/>
          </button>
                  <!-- Your modal content goes here -->
                  <div class="ProductsContainer" v-for="product in this.products" :key="product.id">
                    
                    <ul>
                      <li>
                       <div class="EachProduct">
                       <img :src="product.image" alt="logo Image" class="ProductImg"/>
                       <div class="ProductTextInfo">
                       <p class="productTitle">{{ product.Title }}</p>
                       <p>{{ product.description }}</p>
                       <p>quantity : {{ product.Quantity }}</p>

                       <p class="productTitle">{{ product.price }} $</p>
                       
                       </div>
                       </div>
                      </li>

                    </ul>
                  </div>
                  <p class="TotalAmountP">Total:{{ order.TotalAmount }}$</p>

                </div>
              </div>
            </td>
            <td data-label="PaidButton"><button class="CheckPaidBTN" @click="HandlePaymentShow(order.id, order.TotalAmount )">Check if paid</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <Footer/>
  </div>
</template>

<script>
import AppHeader from './Header.vue'
import Footer from './Footer.vue'
import '../CSS/OrdersPage.css'
import '../CSS/OurProducts.css'
import axios from 'axios'
import { getUserID } from "../Util/Userdata.js";


export default {
  name: 'OrdersPage',
  components: {
    AppHeader,
    Footer,
  },
  data() {
    return {
      isProductsModalOpen: false,
      orders:[],
      products:[],
      userId:null,
      PaymentStatus:'',
    };
  },
  async created() {
    this.userId = await getUserID();
    console.log(this.userId)
    this.fetchOrders();


  },
  methods: {
    
    closeProductsModal() {
      this.isProductsModalOpen = false;
    },
    async HandlePaymentShow(orderId,Amount){
  await this.getpaymentStatus(orderId); // Get the payment status

  if(this.PaymentStatus !== 'succeeded') {
    // Store order ID in local storage if payment is not succeeded
    localStorage.setItem('pendingOrderId', orderId);
    this.$router.push({ name: 'Payment', params: { Amount } });//
  }else{
    alert("Already Paid")
  }

  // Redirect to payment page
}
,
    async fetchOrders(){
      const api = `${process.env.VUE_APP_BASE_URL}/orderProducst/getOrderByUserID/` +this.userId;
     try {
      const response = await axios.get(api)
      this.orders = response.data.data;     
    } catch (error) {
      console.error('Error fetching comments:', error);
     }
    },
    async getpaymentStatus(orderId){
      const api = `${process.env.VUE_APP_BASE_URL}/payment/getStatus/` +orderId;
     try {
      const response = await axios.get(api)
      this.PaymentStatus = response.data.data.PaymentStatus;
      
      console.log(this.PaymentStatus)     
    } catch (error) {
      console.error('Error fetching payment status:', error);
     }
    },
    async fetchProducts(OrderId){
      const api = `${process.env.VUE_APP_BASE_URL}/orderProducst/getByOrderID/` +OrderId;
     try {
      const response = await axios.get(api)
      this.products = response.data.data;     
    } catch (error) {
      console.error('Error fetching comments:', error);
     }
    },
    openProductsModal(orderId) {
      this.isProductsModalOpen = true;
      this.fetchProducts(orderId)
    },
  },
};
</script>

<style scoped>
/* Add your specific table styling here if needed */
.ProductsContainer{
  box-shadow: 0 4px 8px ; /* Box shadow */
  margin: 10px;
  border-radius: 10px;
  width: 70%;

}
.orders-table {
  width: 80%;
  border-collapse: collapse;
  margin: 20px;
  align-self:center;
}
.TableContainer{
    display:flex;
    justify-content:center;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
    background-color:#355E3B;
    color:white;
    font-family:Arial, Helvetica, sans-serif;
}
.CheckPaidBTN, .SeeProductsBTN {
    width:90%;
    height:30px;
    background-color:#355E3B;
    color:white;
    border:none;
    border-radius:40px;
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
  width:30px;
  height:30px;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
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
  overflow-y: auto; /* Enable vertical scrolling */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 50px;
  margin-bottom: 15px;
  box-sizing: border-box;
}
ul{
        list-style-type: none;

}
.ProductImg{
    width: 30%;
    border-radius: 10px;
    margin: 5px;
    }
    .EachProduct {
  display: flex;
  flex-direction: row;
  width: 100%; /* Adjusted width */
  margin-bottom: 10px; /* Add space between products */
}
.TotalAmountP{
    text-align:center;
    font-size: larger;
    font-weight: bold;
    color: #000;
}
.ProductTextInfo{
  display: flex;
  flex-direction: column; 
  justify-content: space-between;
  padding: 15px;
}
.ProductTextInfo p{
  color: #000;
}

@media screen and (min-width: 360px) and (max-width: 480px) {
  th {
    display: none; /* Hide the th elements */
  }

  td {
    display: block;
    width: 100%;
    text-align: left; /* Align the text for better readability */
    padding-left: 50%; /* Adjust as needed */
    position: relative;
  }

  td:before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 50%; /* Adjust as needed */
    padding-left: 15px; /* Adjust as needed */
    font-weight: bold;
    text-align: left;
  }

  .orders-table {
    width: 100%;
  }
  .SeeProductsBTN, .CheckPaidBTN {
    padding: 5px;
    font-size: 10px;
    width: 100%;
    background-color: #fff;
    color: #355E3B;
  }
  .orders-table tr:nth-child(odd) {
    background-color: #f9f9f9; /* Light color for odd rows */
  }

  .orders-table tr:nth-child(even) {
    background-color: #eee; /* Slightly different color for even rows */
  }
  .orders-table tr{
    margin: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add shadow for depth */

  }
  
  .EachProduct{
    flex-direction: column;
  }
  .ProductImg{
    width: 100%;
    margin: 0px;
  }
  
  .modalContent {
    width: 95%;
    max-height: 90%;
    margin-top: 100px;

  }
  .EachProduct {
    flex-direction: column;
    align-items: center;
  }
  

}

  @media screen and (min-width: 481px) and (max-width: 1024px) {
    
  }
</style>
