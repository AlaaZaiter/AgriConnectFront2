<template>
  <div>
    <h1>Email Verification</h1>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'VerifyPage',
  data() {
    return {
      message: ''
    };
  },
  async mounted() {
    try {
      const token = this.$route.query.token;
      const userToken = this.$route.query.userToken;
      console.log(token)
      if (!token) {
        this.message = 'No verification token found.';
        return;
      }

      console.log("here is the user token "+userToken)
      if (userToken) {
          sessionStorage.setItem("authToken", userToken);
          this.$router.push('/');

        } else {
          console.error('Token not found in response');
        }

      const response = await axios.put(`${process.env.VUE_APP_BASE_URL}/user/verify`, { token });
      this.message = response.data.message;

    } catch (error) {
      this.message = 'Error verifying email: ' + error.message;
    }
  }
};
</script>
