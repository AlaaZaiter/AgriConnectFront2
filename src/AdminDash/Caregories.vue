<template>
    <div class="PostsDashContainer">
       <!-- Spinner -->
    <div v-if="isLoading" class="spinner"></div>
    <div v-if="isLoading" class="overlay"></div>
      <h1>Products</h1>
      <button @click="showYourProducts" class="email-name-button">Display All Categories</button>
      <button @click="showAddProduct" class="email-name-button">Add Category</button>
  
      <div id="YourProductsContainer" v-show="yourProductsVisible">
    <table class="products-table">
      <thead>
        <tr>
          <th>Category Title</th>
          <th>Category Image</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categories" :key="index">
          <td>
            <span v-if="!category.editMode">{{ category.Title }}</span>
            <input v-else v-model="category.editedTitle" />
          </td>
          
          <td>
            <span v-if="!category.editMode"> <img :src="category.image" alt="" class="productimg"></span>
            <input v-else type="file" @change="handleFileChange($event, index)" />
          </td>
          
          <td>
            <img
              v-if="!category.editMode"
              src="../images/edit.svg"
              @click="startEditing(index)"
              class="SuitableIcon"
            />
            <img
              v-else
              src="../images/save.png"
              @click="saveEdit(index)"
              class="SuitableIcon"
            />
          </td>
          <td><img src="../images/delete.svg" class="SuitableIcon" @click="deleteProduct(index)" /></td>
        </tr>
      </tbody>
    </table>
  </div>
  
  
      <div id="AddProductContainer" v-show="addProductVisible">
        <h2>Add Product</h2>
        <div class="product-search">
          <p class="product-label">Enter Product Info<br /></p>
          <input class="product-name-search" style="width: 50%;" placeholder="Enter Category Title" v-model="Title">
          <input class="product-name-search" style="width: 50%;" accept="image/" type="file" @change="handleAddProductFileChange($event)">
                
          <button class="product-name-button" @click="handleAddProduct">Add Category</button>
        </div>
      </div>
      <!--
        <div id="AddPostContainer" v-show="addPostVisible">
        <h2>Add User</h2>
        <div class="email-search">
          <p class="email-label">Enter Full Name<br /></p>
          <input class="email-name-search" placeholder="Enter Full Name" v-model="title">
          <p class="email-label">Enter Email<br /></p>
          <input class="email-name-search" placeholder="Enter Email" v-model="email">
          <p class="email-label">Enter Phone Number<br /></p>
          <input class="email-name-search" placeholder="Enter Phone Number" v-model="phoneNumber">
          <p class="email-label">Enter Role<br /></p>
          <input class="email-name-search" placeholder="Enter Role" v-model="role">
          <button class="email-name-button" @click="handleAddUser">Add User</button>
        </div>
      </div>
      -->
      <!-- Toast Notification -->
    <div v-if="toast.show" :class="`toast ${toast.type}`">{{ toast.message }}</div>
  
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import {getUserID} from '../Util/Userdata'

  
  export default {
    name: 'productsDash',
    data() {
      return {
        Title: '',
        stock: '',
        description: '',
        price: '',
        image: '',
        CategoryId: '',
        discount: '',
        yourProductsVisible: true,
        addProductVisible: false,
        categories: [],
        userId:null,
        isLoading: false,
      toast: {
        show: false,
        message: '',
        type: '' // 'success' or 'error'
      }

      };
    },
    async created() {
  this.userId = await getUserID();

},
    methods: {
      handleAddProductFileChange(event) {
        // Update the 'file' property used for adding a post
        this.image = event.target.files[0];
      },
      showLoading() {
      this.isLoading = true;
    },
    hideLoading() {
      this.isLoading = false;
    },
    showToast(message, type) {
      this.toast = { show: true, message, type };
      setTimeout(() => this.toast.show = false, 3000);
    },
      handleAddProduct() {
        this.showLoading()
        const apiUrl = `${process.env.VUE_APP_BASE_URL}/category/add`;
  
        // Assuming you have the necessary data in this.title, this.stock, this.description, etc.
        const formData = new FormData();
        formData.append('Title', this.Title);
        formData.append('image', this.image);
        formData.append('AdminId',this.userId)
  
        axios.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          console.log('Category added successfully:', response.data);
          this.showToast('Category added successfully','success')
          this.showYourProducts(); // Refresh the products after adding a new one
        })
        .catch(error => {
          console.error('Error adding category:', error);
          this.showToast('Error adding category','error')

        }).finally(() => {
          this.hideLoading()
          this.fetchProducts();

        });
      },
      showYourProducts() {
        this.yourProductsVisible = true;
        this.addProductVisible = false;
        this.fetchProducts();
      },
      showAddProduct() {
        this.yourProductsVisible = false;
        this.addProductVisible = true;
      },
      fetchProducts() {
        const apiUrl = `${process.env.VUE_APP_BASE_URL}/category/getAll`;
  
        axios.get(apiUrl)
          .then(response => {
            this.categories = response.data.data.map(product => ({
              ...product,
              editMode: false,
            }));
          })
          .catch(error => {
            console.error('Error fetching categories:', error);
          });
      },
      startEditing(index) {
    this.categories[index].editMode = true;
  },
  /*saveEdit(index) {
      this.showLoading();

      const editedProduct = this.products[index];
      const apiUrl = `${process.env.VUE_APP_BASE_URL}/product/update/${editedProduct.id}`;
console.log("this is id "+editedProduct.id)
      const formData = new FormData();
      formData.append('Title', editedProduct.editedTitle);
      formData.append('stock', editedProduct.editedStock);
      formData.append('description', editedProduct.editedDescription);
      formData.append('price', editedProduct.editedPrice);
      formData.append('image', editedProduct.editedImage);
      formData.append('CategoryId', editedProduct.editedCategoryId);
      formData.append('CreatedBy', this.userId);
      formData.append('discount', editedProduct.editedDiscount);
      
      axios.put(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log('Product updated successfully:', response.data);
        this.showToast('Product updated successfully', 'success');

        this.products[index].editMode = false;
        this.showYourProducts()
      })
      .catch(error => {
        console.error('Error updating product:', error);
        this.showToast('Error updatng product: ' + error.message, 'error');

        this.products[index].editMode = false;
      })
      .finally(() => {
        this.hideLoading();
      });
    }, */
      saveEdit(index) {
        this.showLoading()
        const editedProduct = this.categories[index];
        const apiUrl = `${process.env.VUE_APP_BASE_URL}/category/update/${editedProduct.id}`;
        console.log("this is id "+editedProduct.id)
        const formData = new FormData();
        formData.append('Title', editedProduct.editedTitle);
        formData.append('AdminId',this.userId)
        formData.append('image', editedProduct.editedImage);
       
        axios.put(apiUrl, formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          console.log('Product updated successfully:', response.data);
          this.products[index].editMode = false;
          this.showToast('Product updated successfully','success')
          this.showYourProducts()
        })
        .catch(error => {
          console.error('Error updating product:', error);
          this.products[index].editMode = false;
          this.showToast('Error updating product','error')
        }).finally(() => {
          this.hideLoading()
        });
      },
      deleteProduct(index) {
        const deletedProduct = this.categories[index];
        const apiUrl = `${process.env.VUE_APP_BASE_URL}/category/delete/${deletedProduct.id}`;
        axios.delete(apiUrl)
          .then(response => {
            console.log('Product deleted successfully', response);
            this.showToast('Product updated successfully','success')
            this.showYourProducts()

          })
          .catch(error => {
            console.error('Error deleting product:', error);
          });
      },
      handleFileChange(event, index) {
      const editedProduct = this.categories[index];
      const fileInput = event.target;

        editedProduct.editedImage= fileInput.files[0];
        
      
    },
    },
  };
  </script>
  
  <style scoped>
  input {
    border: none;
    width: 100%;
    text-align: center;
    
  }
  form{
        display:flex;
  justify-content:center;
  }
  </style>
  