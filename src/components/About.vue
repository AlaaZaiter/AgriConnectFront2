<template>
  <div id="AboutConatiner">
  <p class="SecionTitle">{{$t('message.about')}}</p>
  <div class="SubAboutContainer">
    <img src='../images/Farmer22.png' alt="logo Image" class="AboutImg"/>
<p class="AboutText"> {{$t('message.aboutText')}}</p>
</div>
</div>
</template>

<script>
import '../CSS/About.css'
export default {
  name: 'AboutConatiner',
  
};
</script>

<style >
/* Add any scoped styles here if needed */
</style>
