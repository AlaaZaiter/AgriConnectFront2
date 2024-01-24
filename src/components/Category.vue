<template>
  <div id="CategoryContainer">
    <p class="CategoryTitle">Browse By Category</p>
    <div class="categoriesContainer">
      <div class="SubCategoryContainer" 
           v-for="category in visibleCategories" :key="category.id">
        <div>
          <img :src="category.image" alt="Category Image" class="CategoryImg"/>
          <p class="CategoryName">{{ category.Title }}</p>
        </div>
      </div>
    </div>
    <div class="RightAndLeft">
      <img src='../images/previous.png' alt="Previous" class="Arrow" @click="prevCategory"/>
      <img src='../images/next.png' alt="Next" class="Arrow" @click="nextCategory"/>
    </div>
  </div>
</template>


<script>
import '../CSS/Category.css'
import { getUserID } from "../Util/Userdata.js"; 
import axios from 'axios';

export default {
  name: 'CategoryContainer',
  data() {
    return {
      Categories: [],
      visibleCategories: [],
      currentIndex: 0,
      itemsPerPage: 4,
      userId: null,
    };
  },
  async created() {
    this.userId = await getUserID();
    await this.fetchCategories();
    this.updateVisibleCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/category/getAll`);
        this.Categories = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    updateVisibleCategories() {
      this.visibleCategories = this.Categories.slice(
        this.currentIndex, 
        this.currentIndex + this.itemsPerPage
      );
    },
    nextCategory() {
      if (this.currentIndex + this.itemsPerPage < this.Categories.length) {
        this.currentIndex++;
        this.updateVisibleCategories();
      }
    },
    prevCategory() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.updateVisibleCategories();
      }
    }
  },
};
</script>

<style >
/* Add any scoped styles here if needed */
</style>
