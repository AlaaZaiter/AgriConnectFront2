<template>
  <div class="PostsDashContainer">
    <div v-if="isLoading" class="spinner"></div>
    <div v-if="isLoading" class="overlay"></div>
    <h1>Users</h1>
    <button @click="showYourPosts" class="email-name-button">Display  Users</button>

    <div id="YourPostsContainer" v-show="yourPostsVisible">
      <table class="posts-table">
        <thead>
          <tr>
            <th>FullName</th>
            <th>Email</th>
            <th>PhoneNumber</th>
            <th>Role</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in nonAdminUsers" :key="user.id">
            <td>{{ user.FullName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phoneNumber }}</td>
            <td>
              <span v-if="!user.editMode">{{ user.role }}</span>
              <select v-else v-model="user.editedRole">
                <option value="user">User</option>
                <option value="farmer">Farmer</option>
              </select>
            </td>
            <td>
          <img
            v-if="!user.editMode"
            src="../images/edit.svg"
            @click="startEditing(user)"
            class="SuitableIcon"
          />
          <img
            v-else
            src="../images/save.png"
            @click="saveEdit(user)"
            class="SuitableIcon"
          />
        </td>
        <td><img src="../images/delete.svg" class="SuitableIcon" @click="deleteUser(index)" /></td>

          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="toast.show" :class="`toast ${toast.type}`">{{ toast.message }}</div>

  </div>
</template>

<script>
import axios from 'axios';
import '../CSS/UIUX.css'


export default {
  name: 'postsDash',
  data() {
    return {
      title: '',
      email: '',
      phoneNumber: '',
      role: '',
      yourPostsVisible: true,
      addPostVisible: false,
      users: [],
      isLoading: false,
      toast: {
        show: false,
        message: '',
        type: '' // 'success' or 'error'
      }
    };
  },
  computed: {
    nonAdminUsers() {
      return this.users.filter(user => user.role !== 'admin');
    },
  },
  methods: {
    async handleAddUser() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_BASE_URL}/user/add`, {
          FullName: this.title,
          email: this.email,
          phoneNumber: this.phoneNumber,
          role: this.role,
        });
        console.log('User added successfully:', response.data);
        this.showYourPosts(); // Refresh the users after adding a new one
      } catch (error) {
        console.error('Error adding user:', error);
      }
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
    showYourPosts() {
      this.yourPostsVisible = true;
      this.addPostVisible = false;
      this.fetchUsers();
    },
    showAddPost() {
      this.yourPostsVisible = false;
      this.addPostVisible = true;
    },
    async fetchUsers() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/user/getAll`);
        this.users = response.data.data.map(user => ({
          ...user,
          editMode: false,
          editedRole: user.role,
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    startEditing(user) {
      user.editMode = true;
    },
    async saveEdit(user) {
      this.showLoading()
      const token = sessionStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${token}` };
      try {
        const response = await axios.put(`${process.env.VUE_APP_BASE_URL}/user/update/${user.id}`, {
          role: user.editedRole,
          // Include other fields you want to update
        },{
          headers,
        });
        console.log('User updated successfully:', response.data);
        this.showToast('User updated successfully','success')
        this.fetchUsers();
        user.editMode = false;
      } catch (error) {
        console.error('Error updating user:', error);
        this.showToast('Error updating user','error')

        user.editMode = false;
      } finally  {
        this.hideLoading();
      }
    },
    async deleteUser(index) {
      this.showLoading()

      const deletedUser = this.users[index];
      try {
        const response = await axios.delete(`${process.env.VUE_APP_BASE_URL}/user/delete/${deletedUser.id}`);
        console.log('User deleted successfully:', response.data);
        this.showToast('User deleted successfully','success')
        this.users.splice(index, 1);
      } catch (error) {
        console.error('Error deleting user:', error);
        this.showToast('Error deleting user','error')

      } finally{
        this.hideLoading();

      }
    },
  },
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
