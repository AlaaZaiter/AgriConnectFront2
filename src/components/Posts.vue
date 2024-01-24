<template>
  <div>
    <AppHeader/>
    <div class="AllPostsContainer">
      <div v-for="post in posts" :key="post.id" class="EachPost">
        <video v-if="isVideo(post.File)" class="postImage" controls @click="openFileModal(post.File)">
    <source :src="post.File" type="video/mp4"> <!-- You may need to adjust the MIME type -->
    Your browser does not support the video tag.
  </video>

  <!-- Render image tag if the file is not a video -->
  <img v-else :src="post.File" alt="post" class="postImage"  @click="openFileModal(post.File)">
        <div class="SubEachPost">
          <p class="EachPostTitle">post.Title</p>
          <p class="EachPostContent">{{ post.Content }}</p>
          <div class="PostInfo">
            <div class="PostInfoImg">
              <img src='../images/Avatars.png'/>
              <div>
                <p class="PostOwner">{{ userData[post.FarmerUserID]?.name }}</p>
                <p class="PostDuration">{{ relativeTime(post.created_at) }}</p>
              </div>
            </div>
            <div class="CommentsContainer" @click="openModal(post.id)">
              <img src='../images/comment.svg' class="CommentImg"/>
              <p class="Comments"> comments</p>
            </div>
            <img src='../images/Love.png'/>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="FileModal" class="modal">
        <div class="fileModalContent" >
          <button @click.stop="closeModalFile">
            <img src='../images/closed.png' class="closeButton"/>
          </button>

          <video v-if="isVideo( this.ShownFile)" class="ShownFile" controls >
    <source :src=" this.ShownFile" type="video/mp4"> <!-- You may need to adjust the MIME type -->
    Your browser does not support the video tag.
  </video>

  <!-- Render image tag if the file is not a video -->
  <img v-else :src=" this.ShownFile" alt="post" class="ShownFile"  >

        </div>
      </div>

      <!-- Modal -->
      <div v-if="isModalOpen" class="modal">
        <div class="modalContent">
          <button @click.stop="closeModal">
            <img src='../images/closed.png' class="closeButton"/>
          </button>


          <div class="CommentContainer" v-for="comment in Comments" :key="comment.id" >
            <img src='../images/Avatars.png'/>
            <div class="infoComments">
              <div class="SubinfoComments">
                <p class="PostOwner">{{ comment.FullName }}</p>
                <p class="PostDuration">{{ relativeTime(comment.created_at) }}</p>
              </div>
              <p class="CommentContent">{{ comment.content }}</p>
            </div>
          </div>
          <section class="AddCommentSection">
            <form>
              <input type="text" placeholder="send your comment" v-model="comment"/>
              <button @click.prevent="addCommentPost()">
                <img src='../images/Send.png'/>
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import axios from 'axios';
import AppHeader from './Header.vue';
import Footer from './Footer.vue';
import '../CSS/Posts.css';
import { getUserID } from "../Util/Userdata.js";
import moment from 'moment';


export default {
  name: 'ProductsList',
  components: {
    AppHeader,
    Footer,
  },
  data() {
    return {
      isModalOpen: false,
      posts: [],
      Comments: [],
      comment:'',
      userId: null, // hardcoded value
      currentPostId: null,
      FileModal:false,
      ShownFile:null,
      userData: {},
    };
  },
  async created() {
    await this.fetchId();
    this.fetchPosts();
  },
  methods: {
    relativeTime(dateString) {
      const date = moment(dateString);
      return date.fromNow();
    },
    openModal(PostId) {
      if (this.userId === null) {
        alert('You cannot interact without logging in.');
      } else {
        this.currentPostId = PostId;
        this.isModalOpen = true;
        this.fetchComments(PostId);
        console.log(this.userId +"")
      }
    },
    openFileModal(postFile){
      this.FileModal=true;
      this.ShownFile=postFile;
    },
    
    async fetchId() {
  this.userId = await getUserID();
  console.log("User ID after fetch:", this.userId); // This should log the fetched ID
}
,
isVideo(file) {
    // Adjusting regex to account for Firebase Storage URL format and encoded spaces
    const isVideoFile = /\.mp4(%20|\?|$)/i.test(file);
    return isVideoFile;

  },
    closeModal() {
      this.isModalOpen = false;
      this.currentPostId = null;
    },
    closeModalFile(){
      this.FileModal=false;
    },
    async fetchPosts() {
  try {
    const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/post/getAll`);
    const posts = response.data.data;
    // Initialize userData with an empty object for each post
    const userDataPromises = posts.map(post => {
      this.userData[post.FarmerUserID] = {}; // Initialize with an empty object
      return this.SuitUserData(post.FarmerUserID);
    });

    // Fetch user data for each post
    const usersData = await Promise.all(userDataPromises);
    usersData.forEach((data, index) => {
      const userId = posts[index].FarmerUserID;
      this.userData[userId] = data;
    });

    this.posts = posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
},

    async fetchComments(postId) {
      const api = `${process.env.VUE_APP_BASE_URL}/postdiscussions/getByPostID/` + postId;
      try {
        const response = await axios.get(api);
        this.Comments = response.data.data;
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    async addComment() {
      const api = `${process.env.VUE_APP_BASE_URL}/discussion/add` ;
      try {
        const response = await axios.post(api,{
          Topic:'any',
          content:this.comment,
          UserID:this.userId,
        });
        return response.data.DiscussionId;
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    },
    async addCommentPost() {
      const descId = await this.addComment();
      const api = `${process.env.VUE_APP_BASE_URL}/postdiscussions/add` ;
      try {
        const response = await axios.post(api,{
          PostId:this.currentPostId,
          DiscussionID:descId,
        });
console.log(response)
this.fetchComments(this.currentPostId);

} catch (error) {
        console.error('Error adding comment:', error);
      }
    },
    async SuitUserData(userId) {
  const api = `${process.env.VUE_APP_BASE_URL}/user/getByID/` + userId;
  try {
    const response = await axios.get(api);
    return {
      name: response.data.data.FullName,
      image: response.data.data.image,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {};
  }
},
  },
};
</script>


<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
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
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow-y: auto;
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
  margin-bottom: 15px;
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

input {
  border: none;
  text-align: center;
  
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
  width:30px;
  height:30px;
}
.fileModalContent{
  width: 80%;
  height: 80%;
}
.ShownFile{
  width: 100%;
  height: 100%;
}

@media screen and (min-width: 360px) and (max-width: 480px) {
    .modalContent{
      width: 70%;
    }
    .CommentContainer{
      width: 90%;
    }
    input{
      width: 80%;
    }
    form{
      width: 80%;
    }
    .AddCommentSection{
      width: 80%;
    }
  }
  @media screen and (min-width: 481px) and (max-width: 1024px) {
     
  }

</style>
