<template>
    <div class="Login">
      <div class="LoginContainer" :class="{ 'right-panel-active': isRightPanelActive }" id="LoginContainer">
        <div class="form-container sign-in-container">
          <form class="logInForm" >
            <h1 class="h1login">Sign in</h1>
            <input
              class='inputlogin'
              type="email"
              placeholder="Email"
              v-model="emailLogin"
            />
            <input
              class='inputlogin'
              type="password"
              placeholder="Password"
              v-model="passwordLogin"
            />
            <p>{{message}}</p>
            <button class='Sign' type="submit" @click.prevent="handleLogin">Sign In</button>
          </form>
        </div>
        <div class="form-container sign-up-container">
          <form class="logInForm" >
            <h1 class="h1login">Create Account</h1>
            <input
              class='inputlogin'
              type="text"
              placeholder="Name"
              v-model="name"
            />
            <input
              class='inputlogin'
              type="number"
              placeholder="Phone Number"
              v-model="Phone"
            />
            <input
              class='inputlogin'
              type="email"
              placeholder="Email"
              v-model="email"
            />
            <input
              class='inputlogin'
              type="password"
              placeholder="Password"
              v-model="password"
            />
            <p>Image Profile</p>
            <input
              class='inputlogin'
              type="File"
              placeholder="Image Profile" accept="image/"
              @change="handleAddProductFileChange($event)"
            />
            <br />
            <p>{{message}}</p>
            <button class='Sign' type="submit" @click.prevent="handleSignUp">Sign Up</button>
          </form>
        </div>
        <div class="overlay-container">
          
            
            <div class="overlay-panel overlay-left " v-if="isRightPanelActive">
              <h1 class='h1login'>Welcome Back!</h1>
              <p class='plogin'>
                To stay connected with us, please login with your personal info
              </p>
              <button class="ghost Sign" id="signIn" @click="handleSignInClick">
                Sign In
              </button>
            </div>
            <div class=" overlay-panel overlay-right" v-else>
              <h1 class='h1login'>Hello, Friend!</h1>
              <p class='plogin'>Enter your info and start your coding journey!</p>
              <button class="ghost Sign" id="signUp" @click="handleSignUpClick">
                Sign Up
              </button>
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import '../CSS/Login.css';
  import axios from 'axios';
  import '../CSS/Login.css';
  
  
  
  export default {
    name: 'LoginApp',
    components: {
    },
    data() {
      return {
        name: '',
        Phone: '',
        email: '',
        password: '',
        message: '',
        emailLogin:'',
        passwordLogin:'',
        Image:null,
        error: null,
        isRightPanelActive: false,

      };
    },
    methods: {
      async handleLogin() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_BASE_URL}/user/login`, {
          email: this.emailLogin,
          password: this.passwordLogin,
        });
        console.log('User logged in successfully: ', response.data.data);
        const token = response.data.token;
        if (token) {
          sessionStorage.setItem("authToken", token);
          this.$router.push('/');
        } else {
          console.error('Token not found in response');
        }
      } catch (error) {
        console.log(error);
      }
    },
      async handleSignUp() {
        try {
  
         
          const formData = new FormData();
          formData.append("FullName",this.name)
          formData.append("email",this.email)
          formData.append("phoneNumber",this.phone)
          formData.append("password",this.password)
          formData.append("image",this.Image)
          const response = await axios.post(`${process.env.VUE_APP_BASE_URL}/user/register`,
            formData
          )
  
          console.log('User added successfully:', response.data);
          console.log('API response:', response.data);
  
      
        
          
  
        } catch (error) {
          console.log(error)
        }
      },
      handleSignUpClick() {
    this.isRightPanelActive = true;
  },
  handleSignInClick() {
    this.isRightPanelActive = false;
  },
  handleAddProductFileChange(event) {
      // Update the 'file' property used for adding a post
      this.Image = event.target.files[0];
    },
    },
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>