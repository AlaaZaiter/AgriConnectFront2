<template>
    <ProtectedRouteAdmin :adminOnly="false" >
      <AdminDash />
    </ProtectedRouteAdmin>
  </template>
  
  <script>
  import ProtectedRouteAdmin from './ProtectedRouteAdmin.vue';
  import AdminDash from '../AdminDash/Dashboard.vue';
  
  export default {
    components: {
      ProtectedRouteAdmin,
      AdminDash
    }
  }
  </script>
  