import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VueScrollTo from 'vue-scrollto';
import { createI18n } from 'vue-i18n'; // Correct import statement

// Define your translations
const messages = {
  en: {
    message: {
      home: 'Home',
      posts: 'Posts',
      category:'Category',
      about:'About',
      products:'Products',
      contactus:'Contact Us',
      login:'login',
      logout:'logout',
      heroTitle:'Welcome To AgriConnect',
      heroText:'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam , quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' ,
      ReadMore:'Read More',
      ManageAccount:'Manage Your Account',
      cart:'Cart',
      aboutText:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum' 
      

    }
  },
  ar: {
    message: {
      aboutText:'من المهم الاعتناء بالمريض، وأن يتبعه المريض، لكن ذلك سيحدث في وقت يكون فيه الكثير من العمل والألم. فبالنسبة لأدق التفاصيل، لا يجوز لأحد أن يمارس أي عمل إلا إذا استفاد منه بعض الشيء. ولا تغضب من الألم في التوبيخ في لذة يريد أن يكون من الألم شعرة على أمل أن لا يكون هناك تكاثر. إلا إذا أعمتهم الشهوة فلا يخرجون، فإنهم مخطئون في ترك واجباتهم، تلين النفس، أي التعب.',
      cart:'السلة',
      ManageAccount:'ادارة حسابك',
      ReadMore:'قرائة المزيد',
      home: 'الرئيسية',
      posts: 'المنشورات',
      category:'الفائمة',
      about:'عنا',
      products:'المنجات',
      contactus:'تواصل معنا',
      login:'تسجيل دخول',
      logout:'تسجيل خروج',
      heroTitle: 'AgriConnect اهلا بك في ' ,
      heroText:'سيكون من الممكن للطالب أن يتعلم، لكن ذلك سيحدث في وقت سيكون فيه بعض العمل العظيم والألم. لأنني سوف أتطرق إلى أدق التفاصيل، من لا يمارس أي نوع من الرياضة إلا إذا استفاد منها.'
    }
  }
  // ...add other languages
};

// Initialize Vue I18n
const i18n = createI18n({
  locale: 'en', // default locale
  fallbackLocale: 'en',
  messages,
});

const app = createApp(App);

// Use Vue I18n
app.use(i18n);
app.use(router);
app.use(VueScrollTo);

app.mount('#app');
