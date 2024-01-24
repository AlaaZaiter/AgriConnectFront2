<template>
    <ProtectedRouteFarmer :adminOnly="false" >
      <FarmerDash />
    </ProtectedRouteFarmer>
  </template>
  
  <script>
  import ProtectedRouteFarmer from './ProtectedRouteFarmer.vue';
  import FarmerDash from '../FarmerDash/Dashboard.vue';
  
  export default {
    components: {
      ProtectedRouteFarmer,
      FarmerDash
    }
  }
  </script>
  