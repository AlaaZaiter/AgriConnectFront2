<template>
  <div class="PostsDashContainer">
    <!-- Spinner -->
    <div v-if="isLoading" class="spinner"></div>
    <div v-if="isLoading" class="overlay"></div>
    <h1>Products</h1>
    <button @click="showYourProducts" class="email-name-button">Display All Products</button>
    <button @click="showAddProduct" class="email-name-button">Add Product</button>
<!-- Overlay -->
    <div id="YourProductsContainer" v-show="yourProductsVisible">
  <table class="posts-table">
    <thead>
      <tr>
        <th>Product Title</th>
        <th>Stock</th>
        <th>Description</th>
        <th>Price</th>
        <th>Image</th>
        <th>Category</th>
        <th>Discount</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(product, index) in products" :key="index">
        <td>
          <span v-if="!product.editMode">{{ product.Title }}</span>
          <input v-else v-model="product.editedTitle" class="editInput" />
        </td>
        <td>
          <span v-if="!product.editMode">{{ product.stock }}</span>
          <input v-else v-model="product.editedStock" class="editInput" />
        </td>
        <td>
          <span v-if="!product.editMode">{{ product.description }}</span>
          <input v-else v-model="product.editedDescription" class="editInput" />
        </td>
        <td>
          <span v-if="!product.editMode">{{ product.price }}</span>
          <input v-else v-model="product.editedPrice" class="editInput"/>
        </td>
        <td class="content-cell">
          <span v-if="!product.editMode"><img :src=" product.image" class="productimg"/></span>
          <input v-else type="file" @change="handleFileChange($event, index)" class="editInput" />
        </td>
        <td>
  <span v-if="!product.editMode">{{ getCategoryTitle(product.CategoryId) }}</span>
  <select v-else v-model="product.editedCategoryId" class="editInput">
    <option v-for="category in Categories" :key="category.id" :value="category.id">{{ category.Title }}</option>
  </select>
</td>


        <td>
          <span v-if="!product.editMode">{{ product.discount }}</span>
          <input v-else v-model="product.editedDiscount" class="editInput" />
        </td>
        <td>
          <img
            v-if="!product.editMode"
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
        <input class="product-name-search" placeholder="Enter Product Title" v-model="Title">
        <input class="product-name-search" placeholder="Enter Stock" v-model="stock">
        <input class="product-name-search"  placeholder="Enter Description" v-model="description">
        <input class="product-name-search" placeholder="Enter Price" v-model="price">
        <input class="product-name-search" accept="image/" type="file" @change="handleAddProductFileChange($event)">
        <select class="product-name-search" v-model="CategoryId" placeholder="Upload Image" >
  <option v-for="category in Categories" :key="category.id" :value="category.id">
    {{ category.Title }}
  </option>
</select>
        <input class="product-name-search" placeholder="Enter Discount" v-model="discount">
        <button class="product-name-button" @click="handleAddProduct">Add Product</button>
      </div>
    </div>
    
    <!-- Toast Notification -->
    <div v-if="toast.show" :class="`toast ${toast.type}`">{{ toast.message }}</div>
  
  </div>

</template>

<script>
import axios from 'axios';
import '../CSS/FarmerDash.css';
import '../CSS/UIUX.css'
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
      products: [],
      Categories:[],
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
  this.fetchCategories();
  this.userId = await getUserID();

}
,
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
      this.showLoading();

      const apiUrl = `${process.env.VUE_APP_BASE_URL}/product/add`;

      // Assuming you have the necessary data in this.title, this.stock, this.description, etc.
      const formData = new FormData();
      formData.append('Title', this.Title);
      formData.append('stock', this.stock);
      formData.append('description', this.description);
      formData.append('price', this.price);
      formData.append('image', this.image);
      formData.append('CategoryId', this.CategoryId);
      formData.append('CreatedBy',this.userId);
      formData.append('discount', this.discount);

      axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        this.showToast('Product added successfully', 'success');
        this.showYourProducts(); // Refresh products 
        console.log(response)
      })
      .catch(error => {
        console.error('Error adding product:', error);
        this.showToast('Error adding product: ' + error.message, 'error');

      })
      .finally(() => {
        this.hideLoading();
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
      const apiUrl = `${process.env.VUE_APP_BASE_URL}/product/getAll`;

      axios.get(apiUrl)
        .then(response => {
          this.products = response.data.data.map(product => ({
            ...product,
            editMode: false,
          }));
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    },
    startEditing(index) {
  const product = this.products[index];
    product.editMode = true;
    product.editedCategoryId = product.CategoryId;
},
getCategoryTitle(categoryId) {
    const category = this.Categories.find(c => c.id === categoryId);
    return category ? category.Title : 'Unknown Category';
  },
    saveEdit(index) {
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
    },
    deleteProduct(index) {
      this.showLoading();
      const deletedProduct = this.products[index];
      const apiUrl = `${process.env.VUE_APP_BASE_URL}/product/delete/${deletedProduct.id}`;
      axios.delete(apiUrl)
        .then(response => {
          console.log('Product deleted successfully', response);
          this.showToast('Product deleted successfully ' , 'success');
          this.showYourProducts()


        })
        .catch(error => {
          console.error('Error deleting product:', error);
          this.showToast('Error deleting product: ' + error.message, 'error');

        })
        .finally(() => {
        this.hideLoading();
      });
    },
    handleFileChange(event, index) {
      const editedProduct = this.products[index];
      const fileInput = event.target;

      if (fileInput.files.length > 0) {
        editedProduct.editedImage= fileInput.files[0];
        
      }
    },
    async fetchCategories(){
  try {
    const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/category/getAll`);
    this.Categories=response.data.data;
  } catch (error) {
    console.log(error)
  }

},UpdateCategoryid(CategoryTitle){
  const category = this.Categories.find(c => c.Title === CategoryTitle);
  console.log(category.id)
    return category.id ;
}
  },
};
</script>

<style scoped>

form{
      display:flex;
justify-content:center;
}




</style>
