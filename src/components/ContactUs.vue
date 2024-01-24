<template>
  <div id="contactContainer">
      <p class="ContactTitle">Contact Us</p>
    <div class="contact-container">
      <div class="inside-contact-container">
        <div class="message-form" action="">
          <p class="SubContctTitle">Send A Message</p>
          <div class="text">
            <input
              type="text"
              class="name contact-inp"
              placeholder="Your Name"
              v-model="sender_name"            />
            <input
              type="text"
              class="email contact-inp"
              placeholder="Your Email"
              v-model="sender_email"            />
            <textarea
              class="message-box contact-inp"
              placeholder="Message"
              v-model="message"
            ></textarea>
            <br />
            <button class="contact-button" @click="sendEmail">
              Send Message
            </button>
          </div>
        </div>
      </div>
      <div class="inside-contact-container">
        <div class="get-in-touch-message">
          <p class="SubContctTitle">Get in Touch</p>
          <div class="text">
            <p class="in-touch-message">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
              dolorum dolorem soluta quidem expedita aperiam aliquid at. Totam
              magni ipsum suscipit amet? Autem nemo esse laboriosam ratione nobis
              mollitia inventore?
            </p>

            <div class="info-container">
              <div class="info">
                <img src="../images/Location.png" class="svgs" />
                <p class="get-in-info"> Beirut, Lebanon </p>
              </div>

              <div class="info">
                <img src="../images/Email.png" class="svgs" />
                <a href="mailto:zaiteralaa29@gmail.com" >
zaiteralaa29@gmail.com                </a>
              </div>

              
              <div class="info">
                <img src="../images/Call.png" class="svgs" />
                <p class="get-in-info"> +961 71 729 503</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../CSS/ContactUs.css';
import emailjs from "@emailjs/browser";

export default {
  data() {
    return {
      sender_name: '',
      sender_email: '',
      message: '',      
    };
  },
  mounted() {
    emailjs.init("sEFemlWmIkQoje02F"); // Replace with your actual key
  },
  methods: {
    sendEmail() {
      const templateParams = {
        sender_name: this.sender_name,
        sender_email: this.sender_email,
        message: this.message,
      };

      emailjs.send('service_niyaivm', 'template_l2qsnkh', templateParams)
        .then(response => {
          alert('SUCCESS!', response.status, response.text);
          this.resetForm();
        }, error => {
          alert('FAILED...', error);
        });
    },
    resetForm() {
      this.sender_name = '';
      this.sender_email = '';
      this.message = '';
    }
  },
  }
;
</script>

<style scoped>
/* Include the relevant styles from your CSS here */
</style>
