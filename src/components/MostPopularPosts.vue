<template>
  <div id="MostPopularPostsContainer">
    <p class="PostsTitle">Most Popular Posts</p>
    <div class="SubPostsContainer">
      <div v-for="post in mostPopularPosts" :key="post.id">


        
        <video v-if="isVideo( post.File)" class="PostsImg" controls >
    <source :src=" post.File" type="video/mp4"> <!-- You may need to adjust the MIME type -->
    Your browser does not support the video tag.
  </video>

  <!-- Render image tag if the file is not a video -->
  <img v-else :src=" post.File" alt="post" class="PostsImg"  >
        <p class="PostTitle"> Title</p>
        <p class="PostText">{{ post.translatedContent }}</p>
        <p class="discussionNumber">{{ post.DiscussionCount }} discussions</p>
      </div>
    </div>
    <button class="ProductsButton" @click="goToProducts">View All Posts</button>

  </div>
</template>

<script>
import axios from 'axios';
import '../CSS/MostPopularPosts.css';


export default {
  name: 'MostPopularPostsContainer',
  data() {
    return {
      mostPopularPosts: [],
    };
  },
  watch: {
    '$i18n.locale': function(newLang, oldLang) {
      if (newLang !== oldLang) {
        this.fetchMostPopularPosts();
      }
    }},
  created() {
    this.fetchMostPopularPosts();
  },
  methods: {
    async fetchMostPopularPosts() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/postdiscussions/getMost`);
        const postsWithTranslations = await Promise.all(response.data.data.map(async (post) => {
          const translatedContent = await this.translateTexts(post.Content);
          return {
            ...post,
            translatedContent,
            fileType: post.File.toLowerCase().endsWith('.mp4') ? 'video' : 'image',
          };
        }));
        this.mostPopularPosts = postsWithTranslations;
      } catch (error) {
        console.error('Error fetching most popular posts:', error);
      }
    }, 
    async translateTexts(message) {
  const langCode = this.$i18n.locale;
  console.log(`Translating to: ${langCode}`);
  const translatedText = await this.translate(message, langCode);
  console.log(`Original: ${message}, Translated: ${translatedText}`);
  return translatedText;
},
isVideo(file) {
    // Adjusting regex to account for Firebase Storage URL format and encoded spaces
    const isVideoFile = /\.mp4(%20|\?|$)/i.test(file);
    return isVideoFile;

  },
    async translate(msg, to) {
    try {
        const response = await axios.post(`${process.env.VUE_APP_BASE_URL}/translate`, {
            msg: msg,
            to: to
        });
        // Assuming the translated text is in the response
        console.log(response.data.translation)
        return response.data.translation;
    } catch (error) {
        console.error('Error translating:', error);
        return msg; // Return the original message if translation fails
    }
}
  },
};
</script>

<style scoped>
/* Add any scoped styles here if needed */
</style>
