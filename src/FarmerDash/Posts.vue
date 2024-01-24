<template>
  <div class="PostsDashContainer">
    <!-- Spinner -->
    <div v-if="isLoading" class="spinner"></div>
    <div v-if="isLoading" class="overlay"></div>
    <!-- Toast Notification -->
    <div v-if="toast.show" :class="`toast ${toast.type}`">{{ toast.message }}</div>
  
    <h1>Posts</h1>
    <button @click="showYourPosts" class="email-name-button">Display Your Posts</button>
    <button @click="showAddPost" class="email-name-button">Add Post</button>

    <div id="YourPostsContainer" v-show="yourPostsVisible">
      <table class="posts-table">
        <thead>
          <tr>

            <th>Content</th>
            <th>File</th>
            <th>Discussions</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, index) in posts" :key="index">
            <td class="content-cell">
              <span v-if="!post.editMode">{{ post.Content }}</span>
              <input v-else v-model="post.editedContent" class="editInput" />
            </td>
            <td class="content-cell">
                
              <span v-if="!post.editMode">
                
                <video v-if="isVideo(post.File)" class="productimg" controls >
    <source :src="post.File" type="video/mp4"> <!-- You may need to adjust the MIME type -->
    Your browser does not support the video tag.
  </video>
  <!-- Render image tag if the file is not a video -->
  <img v-else :src="post.File" alt="post" class="productimg"  >
   
              </span>
              <input v-else type="file" @change="handleFileChange($event, index)" class="editInput" />
            </td>
            <td>
              <img
                src="../images/comment.svg"
                class="SuitableIcon"
                @click="openDiscussionModal(post.id)"
              />
            </td>
            <td>
              <img
                v-if="!post.editMode"
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
            <td><img src="../images/delete.svg" class="SuitableIcon" @click="deletePost(index)" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div id="AddPostContainer" v-show="addPostVisible">
      <h2>Add Project</h2>
      <div class="email-search">
        <p class="email-label">Enter a Post Info<br /></p>
        <input class="email-name-search" accept="image/" type="file" @change="handleAddPostFileChange($event)">
        <textarea class="add-project-desc" placeholder="Enter Content for your post" v-model="description"></textarea>
        <button class="email-name-button" @click="handleAddPost">Add Post</button>
      </div>
    </div>

     <!-- Modal -->
     <div v-if="showDiscussionModal" class="modal">
        <div class="modalContent">
          <!-- Close button (x) to close the modal -->
          <button  @click.stop="closeDiscussionModal"> <img src='../images/closed.png' class="closeButton"/></button>

          <!-- Your modal content goes here -->
          
          <div v-for="(discussion, index) in discussions" :key="index" class="CommentContainer">
        <img  :src="discussion.image" class="discussionProfile"/>
        <div class="infoComments">
          <div class="SubinfoComments">
            <p class="PostOwner">{{ discussion.FullName }}</p>
            <p class="PostDuration">{{ relativeTime(discussion.created_at) }}</p>
          </div>
          <p class="CommentContent">{{ discussion.content }}</p>
        </div>
      </div>

          <section class="AddCommentSection">
            <form>
              <input type="text" placeholder="send your comment"/>
              <button>
                <img src='../images/Send.png'/>
              </button>
            </form>
          </section>
        </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import {getUserID} from '../Util/Userdata'
import '../CSS/UIUX.css';
import moment from 'moment';


export default {
  name: 'postsDash',
 
  data() {
    return {
      title: '',
      description: '',
      yourPostsVisible: true,
      addPostVisible: false,
      posts: [],
      showDiscussionModal: false,
      discussions: [],
      currentPostIndex: null,
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
    handleAddPostFileChange(event) {
      // Update the 'file' property used for adding a post
      this.file = event.target.files[0];
    },
    relativeTime(dateString) {
      const date = moment(dateString);
      return date.fromNow();
    },
    showLoading() {
      this.isLoading = true;
    },
    hideLoading() {
      this.isLoading = false;
    },
    isVideo(file) {
    // Adjusting regex to account for Firebase Storage URL format and encoded spaces
    const isVideoFile = /\.mp4(%20|\?|$)/i.test(file);
    return isVideoFile;

  },
    showToast(message, type) {
      this.toast = { show: true, message, type };
      setTimeout(() => this.toast.show = false, 3000);
    },
    handleAddPost() {
      this.showLoading()
      const apiUrl = `${process.env.VUE_APP_BASE_URL}/post/add`;

      // Assuming you have the necessary data in this.title, this.description, and this.file
      const formData = new FormData();
      formData.append('Content', this.description); // Assuming 'Content' is the field name for description
      formData.append('File', this.file); // Assuming 'File' is the field name for the file
      formData.append('FarmerUserID', this.userId);
      axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log('Post added successfully:', response.data);
        this.showToast('post added successfully', 'success');
        this.showYourPosts(); // Refresh the posts after adding a new one
      })
      .catch(error => {
        console.error('Error adding post:', error);
        this.showToast('Error adding post','error')
      }).finally(() => {
        this.hideLoading()
      });
    },
    showYourPosts() {
      this.yourPostsVisible = true;
      this.addPostVisible = false;
      this.fetchPosts();
    },
    showAddPost() {
      this.yourPostsVisible = false;
      this.addPostVisible = true;
    },
    fetchPosts() {
      const apiUrl = `${process.env.VUE_APP_BASE_URL}/post/getAll`;

      axios.get(apiUrl)
        .then(response => {
          this.posts = response.data.data.map(post => ({
            ...post,
            editMode: false,
            editedContent: post.Content,
          }));
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
        });
    },
    startEditing(index) {
      this.posts[index].editMode = true;
    },
    saveEdit(index) {
      this.showLoading()
      const editedPost = this.posts[index];
      const apiUrl = `${process.env.VUE_APP_BASE_URL}/post/update/${editedPost.id}`;

      const formData = new FormData();
      formData.append('Content', editedPost.editedContent);
      formData.append('File', editedPost.editedFile);
      formData.append('FarmerUserID', this.userId);


      axios.put(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log('Post updated successfully:', response.data);
        this.showToast('Product updated successfully', 'success');
        this.posts[index].editMode = false;
        this.showYourPosts();
      })
      .catch(error => {
        console.error('Error updating post:', error);
        this.showToast('Error updating post','error')

        this.posts[index].editMode = false;
      }).finally(() => {
        this.hideLoading()
      })
    },
    handleFileChange(event, index) {
      const editedPost = this.posts[index];
      const fileInput = event.target;

      if (fileInput.files.length > 0) {
        editedPost.editedFile = fileInput.files[0];
      }
    },
    deletePost(index) {
      this.showLoading()
      const deletedPost = this.posts[index];
      const apiUrl = `${process.env.VUE_APP_BASE_URL}/post/delete/${deletedPost.id}`;
      axios.delete(apiUrl)
        .then(response => {
          console.log('Post deleted successfully', response);
          this.showToast('Post deleted successfully','success')
        })
        .catch(error => {
          console.error('Error deleting post:', error);
          this.showToast('Error deleting post','error')

        }).finally(() => {
          this.hideLoading()

        });
    },
    openDiscussionModal(postId) {
      console.log(postId)
      this.currentPostIndex = postId;
      this.showDiscussionModal = true;
      // Fetch discussions after opening the modal
      this.fetchDisussionsByPostId(postId);
    },
    fetchDisussionsByPostId(postId) {
      console.log(postId)
      const apiUrl = `${process.env.VUE_APP_BASE_URL}/postdiscussions/getByPostID/${postId}`;

      axios.get(apiUrl)
        .then(response => {
          this.discussions = response.data.data;
        })
        .catch(error => {
          console.error('Error fetching discussions:', error);
        });
    },
    closeDiscussionModal() {
      this.showDiscussionModal = false;
    },
  },
};
</script>

<style scoped>
.SuitableIcon {
  width: 50%;
  height: 50%;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.modalContent {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
height: 80%;  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  flex-direction: column;
}

.infoComments {
  display: flex;
  flex-direction: column;
}

.SubinfoComments {
  display: flex;
  flex-direction: row;
}

.CommentContent {
  font-family: Arial, Helvetica, sans-serif;
  font-size: small;
  margin-left: 5px;
  margin-top: 10px;
}

.CommentContainer {
  width: 30%;
  display: flex;
  flex-direction: row;
  box-shadow: 0 4px 8px;
  /* Box shadow */
  border-radius: 10px;
  padding:5px;
  margin: 5px;
}
  .content-cell {
  width: 300px; /* Adjust the width as needed */
  white-space: normal;
  word-wrap: break-word;
}
.posts-table {
  table-layout: fixed;
  width: 100%; /* Adjust as necessary */
}




.AddCommentSection {
  border: 2px solid #355e3b;
  width: 30%;
  display: flex;
  justify-content: center;
  align-self: center;
  border-radius: 10px;   
  margin-top: 30px;
}


form{
      display:flex;
justify-content:center;
}

.closeButton {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  background: none;
  border: none;
  cursor: pointer;
  color: #000; 
  width:50px;
  height:50px;
}
.discussionProfile{
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
</style>
