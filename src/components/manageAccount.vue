<template>
    <div class="manageAcc">
      <div class="user-form">
        <div v-if="!isEditMode">
          <img :src="userData.userImage" alt="User Image" class="userImage" />
        </div>
        <div v-if="isEditMode">
          <label for="userImage" class="Userlabel">User Image:</label>
          <input
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="Userinput"
          />
        </div>
        <div>
          <label for="fullName" class="Userlabel">Full Name:</label>
          <input class="Userinput" v-model="userData.fullName" :disabled="!isEditMode" id="fullName" :class="{ 'edit-mode': isEditMode }" />
        </div>
        <div>
          <label for="phoneNumber" class="Userlabel">Phone Number:</label>
          <input class="Userinput" v-model="userData.phoneNumber" :disabled="!isEditMode" id="phoneNumber" :class="{ 'edit-mode': isEditMode }" />
        </div>
  
        <button @click="toggleEditMode" class="Savebutton">
          {{ isEditMode ? 'Save' : 'Update' }}
        </button>
      </div>
    </div>
  </template>
  
  <script>
import axios from 'axios';

export default {
  data() {
    return {
      isEditMode: false,
      userId: null,
      userData: {
        userImage: null,
        fullName: "",
        phoneNumber: "",
      },
    };
  },
  async created() {
    await this.getUserData(this.$route.params.userId);
  },
  methods: {
    async getUserData(userId) {
      console.log("here is user id" + userId);
      this.userId = userId; // Store the userId for later use
      if (userId != null) {
        const api = `${process.env.VUE_APP_BASE_URL}/user/getByID/${userId}`;
        try {
          const response = await axios.get(api);

          // Set user data
          this.userData = {
            userImage: response.data.data.image || null,
            fullName: response.data.data.FullName || "",
            phoneNumber: response.data.data.phoneNumber || "",
          };
        } catch (error) {
          console.log(error);
        }
      }
    },
    async toggleEditMode() {
  if (this.isEditMode) {
    try {
      const updateApi = `${process.env.VUE_APP_BASE_URL}/user/updateWithImg/${this.$route.params.userId}`;
      const formData = new FormData();
      formData.append("image", this.userData.userImage);
      formData.append("FullName", this.userData.fullName);
      formData.append("phoneNumber", this.userData.phoneNumber);

      // Make an API request to update the user data
      await axios.put(updateApi, formData);

      console.log("User Id:", this.userId);
      console.log("Updated:", formData);
    } catch (error) {
      console.log(error);
      // Handle error appropriately
    }
  }
  this.isEditMode = !this.isEditMode;
},

    handleImageUpload(event) {
      this.userData.userImage = event.target.files[0];

    },
  },
};
</script>
  
  <style scoped>
  /* Add any scoped styles here if needed */
  .manageAcc {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .user-form {
    align-self: center;
  }
  
  .Userlabel {
    display: block;
    margin-bottom: 8px;
  }
  
  .Userinput {
    width: 100%;
    padding: 8px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: border-color 0.3s ease-in-out;
  }
  
  .edit-mode {
    border-color: #3498db;
  }
  
  .Savebutton {
    padding: 10px;
    background-color: #355E3B;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
  }
  
  .Savebutton:hover {
    background-color: #90EE90;
  }
  
  .userImage {
    width: 100px; /* Set your desired width */
    height: auto; /* Maintain aspect ratio */
    border-radius: 50%; /* For a circular image */
    margin-bottom: 16px;
  }
  @media screen and (min-width: 360px) and (max-width: 480px) {
    
   
  }
  @media screen and (min-width: 481px) and (max-width: 1024px) {
    .user-form{
        width: 80%;
        align-self: center;
    }
}
  </style>
  