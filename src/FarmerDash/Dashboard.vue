<template >
  <div class="Dashboard">
    <div class="side-menu">
      <img  :src="this.userData.image" alt="no prfile image" class="ProfileImage"/>
      <p class="dash-title" @click="handleClick('default')">Welcome  </p>
      <p class="dash-title" style="margin-bottom: 50px;" @click="handleClick('default')"> {{ this.userData.FullName }} </p>
      <ul class="dash-menu">
        <li class="dash-menu-item" @click="handleClick('products')">Products</li>
        <li class="dash-menu-item" @click="handleClick('orders')">orders</li>
        <li class="dash-menu-item" @click="handleClick('posts')">Posts</li>
      </ul>
    </div>
    <hr />
    <div class="dash-content">
      
      <div id="dash-projects" v-show="activeSection === 'products'">
        <productsDash />
      </div>
      <div id="dash-cv" v-show="activeSection === 'orders'">
        <AccountsDash />
      </div>
      <div id="dash-cv" v-show="activeSection === 'posts'">
        <CategoryDash />
      </div>
      <div id="default" v-show="activeSection === 'default'">
        <h2 class="default-dash-title">Welcome to Admin dashboard</h2>
      </div>
    </div>
  </div>
</template>

<script>
import ProductsDash from './products.vue';
import AccountsDash from './orders.vue';
import CategoryDash from './Posts.vue';
import {getUserID} from '../Util/Userdata';
import axios from 'axios';
import '../CSS/FarmerDash.css';
export default {
  name: 'DashboardPage',
  components: {
    ProductsDash,
    AccountsDash,
    CategoryDash,
  },
  data() {
    return {
      activeSection: 'default',
      userId: null,
      userData:{},
    };
  },
  async created() {
    this.userId = await getUserID();
    await this.getUserData(this.userId);

  },
  methods: {
    handleClick(section) {
      switch (section) {
        case 'posts':
          this.activeSection = 'posts';
          break;
        case 'products':
          this.activeSection = 'products';
          break;
        case 'orders':
          this.activeSection = 'orders';
          break;
        
        default:
          this.activeSection = 'default';
      }
      
    },
    async getUserData(userId){
      if(userId !=null){
       const api =`${process.env.VUE_APP_BASE_URL}/user/getByID/${userId}`;
       try {
        const response=  await axios.get(api);
        console.log(api)
        console.log(response.data.data.FullName)
        this.userData=  response.data.data;
        console.log(this.userData.FullName);
       } catch (error) {
        console.log(error)
       }
      } 
      },

  },
};
</script>

<style scoped>
.ProfileImage{
  height: 100px;
  width: 100px;
  align-self: center;
  margin-top: 10px;
  border-radius: 50%;
}
</style>
