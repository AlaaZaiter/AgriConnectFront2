<template>
  <div class="HeaderConatiner">
    <img src='../images/logoAgriConnect2.jpg' alt="logo Image" class="logoImg"/>

    <ul class="headerList">
      <a href="/"><li>{{ $t('message.home') }}</li></a>
      <a href="/#MostPopularPostsContainer"><li>{{ $t('message.posts') }}</li></a>
      <a href="/#CategoryContainer"><li>{{ $t('message.category') }}</li></a>
      <a href="/#OurProductsContainer"><li>{{ $t('message.products') }}</li></a>
      <a href="/#AboutConatiner"><li>{{ $t('message.about') }}</li></a>
      <a href="/#contactContainer"><li>{{ $t('message.contactus') }}</li></a>
    </ul>

    <img :src="this.userData.image" alt="Menu Image" class="MenuImg" @click="toggleModal" v-if="isLoggedin"/>
   <a v-else href="/login"> <button  class="LoginButton" > {{ $t('message.login') }}</button></a>
  </div>

  <div class="heroSection">
    <div class="heroSectionContent">
      <p class="HeroTitle">{{ $t('message.heroTitle') }} </p>
      <p class="HeroText">{{ $t('message.heroText') }}
</p>
      <button class="HeroButton">{{ $t('message.ReadMore') }}</button>
    </div>
  </div>

  <div class="modal" v-if="isModalVisible" @click="closeModal">
    <div class="modalContent">
      <button class="modalButton" @click="navigateToManageAccount">{{ $t('message.ManageAccount') }}</button>
      <button class="modalButton" @click="showCartModal">{{$t('message.cart')}}</button>
      <Multiselect v-model="selectedLanguage" 
  :options="languages" 
  class="modalSelect" 
  placeholder="Language"/>
      <button class="modalButton" @click="handleLogout">{{ $t('message.logout') }}</button>
    </div>
    <CartModal 
    :isVisible="isCartModalVisible" 
    :userId="this.userId"
  />
  </div>
</template>

<script>
import '../CSS/Header.css'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'
import CartModal from './Cart.vue'
import {getUserID} from '../Util/Userdata'
import axios from 'axios'

export default {
  name: 'AppHeader',
  components: {
    Multiselect,
    CartModal
  },
  data() {
    return {
      isModalVisible: false,
      selectedLanguage: null,
      languages: ['English', 'العربية'],
      isCartModalVisible: false,
      userId: null,
      isLoggedin: false,
      userData:{},

    };
  },
  watch: {
    userId(newUserId) {
      this.isLoggedin = newUserId !== null;
      // Add any additional side effects here if needed
    },
    selectedLanguage(newLang) {
    this.changeLanguage(newLang === 'English' ? 'en' : 'ar');
  }
  },
  async created() {
    this.userId = await getUserID();
    this.checkLogin();
    await this.getUserData(this.userId);

  },
  methods: {
    toggleModal() {
      this.isModalVisible = !this.isModalVisible;
    },
    navigateToManageAccount() {
      const userId = this.userId; // Replace with your actual user ID
      this.$router.push({ name: 'manageAccount', params: { userId } });
    },
    handleLogout() {
      sessionStorage.removeItem("authToken");
      this.userId = null; // Set userId to null to indicate logout
      this.isModalVisible = false; // Hide modal if it's open
      // You can add any additional logout cleanup here
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
    checkLogin() {
      this.isLoggedin = this.userId !== null;
      console.log("here is usre id "+this.userId)
    },
    closeModal(event) {
      if (event.target.classList.contains('modal')) {
        this.isModalVisible = false;
      }
    },
    showCartModal() {
      this.isCartModalVisible = true;
    },
    changeLanguage(lang) {
this.$i18n.locale = lang;

  },
  
}};
</script>


<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
}

.modalContent {
  background: #fff;
  padding: 20px;
  width: 25%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.modalButton {
  padding: 10px 20px;
  margin: 10px 0;
  background-color: #fff; /* Changed to white to match the select dropdown */
  color: #333; /* Darker text color for contrast */
  border: 1px solid #ccc; /* Border similar to the select dropdown */
  border-radius: 4px; /* Rounded corners like the select */
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  transition: background-color 0.3s, border-color 0.3s, color 0.3s;
}

.modalButton:hover {
  background-color: #f0f0f0; /* Lighter shade for hover, similar to select option hover */
  border-color: #bbb; /* Slightly darker border on hover */
  color: #000; /* Slightly darker text color on hover */
}

.modalSelect {
  width: 100%;
  margin: 10px 0;
}

.multiselect {
  border: 1px solid #ccc;
  border-radius: 4px;
}

.multiselect__content {
  max-height: 200px;
  overflow-y: auto;
}

.multiselect__option--highlight {
  background-color: #f0f0f0;
}

.multiselect__option--selected {
  background-color: #e0e0e0;
}
.LoginButton{
  background-color: #355E3B;
  width: 90px;
  height: 30px;
  border: none;
  border-radius: 10px;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  font-size: large;
  align-self: center;
}
.LoginButton:hover{
  cursor: pointer;
}

@media screen and (min-width: 360px) and (max-width: 480px) {
  .modalContent{
  width: 40%;
}
.LoginButton{
  width: 40px;
  font-size: smaller;
  margin-left: 3px;

}
  }
</style>
