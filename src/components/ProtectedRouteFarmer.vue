<template>
    <div v-if="isAuthorized">
      <slot></slot> <!-- This will render the child components -->
    </div>
  </template>
  
  <script>
  import { defineComponent, onMounted, ref } from 'vue';
  import {  useRouter } from 'vue-router';
  import { getUserRole } from '../Util/Userdata'; // Adjust the import path as needed
  
  export default defineComponent({
    name: 'ProtectedRoute',
    props: {
      adminOnly: Boolean,
    },
    setup(props) {
    const isAuthenticated = ref(false);
    const isAuthorized = ref(false);
    const router = useRouter();
  
    onMounted(() => {
      const authToken = sessionStorage.getItem('authToken');
      const userRole = getUserRole(); // Ensure this function returns the current user's role
      isAuthenticated.value = !!authToken;
  console.log('user type ' + userRole)
  
      // Check if user is authenticated and, if adminOnly is true, whether the user's role matches the adminType
      isAuthorized.value = isAuthenticated.value && (props.adminOnly || userRole === "farmer");
  
      if (!isAuthorized.value) {
        router.push('/login');
      }
    });
  
    return {
      isAuthorized,
    };
  }
  ,
  });
  </script>
  