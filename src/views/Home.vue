<template>
  <ion-page>
    <the-header/>   
    <ion-content>
        <header>
        <div class="main-image">
        </div>
        <div class="main-message">
            <div class="main-message_flexbox">
              <div class="main-message_flexbox_item">
                <h1>Patron</h1>
                <h2>Discover and book your table in one of our pubs</h2>
                <div class="message-button_container">
                  <div>
                    <ion-button @click="onSearch" class="ion-margin-top" expand="block" size="large" v-if="!auth">
                        Find a table
                    </ion-button>
                    <ion-button @click="onSignup" color="secondary" fill="outline" class="ion-margin-top" expand="block" size="large" v-if="!auth">
                        Sign up
                    </ion-button>
                  </div>
                </div>
              </div>
              <div class="main-message_divider">
              </div>
              <div class="main-message_flexbox_item">
                <h1>Publican</h1>
                <h2>Manage the reservations you get from your patrons</h2>
                <div class="message-button_container">
                  <div>
                    <ion-button @click="onLogin" class="ion-margin-top" expand="block" size="large" v-if="!auth">
                        Manage Pub
                    </ion-button>
                    <ion-button @click="onSignup" color="secondary" fill="outline" class="ion-margin-top" expand="block" size="large" v-if="!auth">
                        Sign up
                    </ion-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="message-button_container">
              <div>
                <ion-button @click="onSearch" class="ion-margin-top" expand="block" size="large" v-if="auth">
                    Let's Go!
                </ion-button>
              </div>
            </div>
        </div>
        </header>
        <main>
          <div style="text-align:center; padding:24px">
          <ion-text>
          This app is currently still being tested. All information will be wiped before the official release.
          </ion-text>
          </div>
        </main>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonButton, IonText } from '@ionic/vue';
import TheHeader from '../components/TheHeader.vue'
import { useRouter } from "vue-router";
import { mapGetters } from 'vuex'
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'home',
  setup() {
    const router = useRouter()
    const onLogin = () => {
      router.push('signin')
    }
    const onSignup = () => {
      router.push('signup')
    }
    const onSearch = () => {
      router.push({ name: 'search-for-pub' })
    }
    return{
      onLogin, onSignup, onSearch
    }
  },
  components: {
    IonPage,
    IonContent,
    IonButton,
    IonText,
    TheHeader
  },
  computed: {
    ...mapGetters('userModule', {
      auth: 'isAuthenticated'
    })
  }
})

</script>

<style lang="scss" scoped>

header {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background-size: cover;
    background-position: 50%;
    min-height: 500px;
    position: relative;
}

.main-image{
    display:flex;
    background-image: linear-gradient(90deg,rgba(47,45,65,.7),rgba(47,45,65,.7)), url('../assets/pexels-pixabay-63633.jpg');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.main-message{
    z-index: 1;
    max-width:800px;
    @media (min-width: 1000px) {
      max-width:900px;
    }
    @media (min-width: 1200px) {
      max-width:1200px;
    }
    h1 {
        font-weight: bold;
        color: #fff;
        text-align: center;
        @media (min-width: 600px) {
          font-size: 34px;
        }
    }
    h2 {
        font-weight: 400;
        color: #fff;
        text-align: center;
    }
}

ion-button {
    --margin-top: 1em;
}

.message-button_container {
  max-width: 400px;
  margin: auto;
  padding: 0px 24px 24px 24px;

  @media (min-width: 600px) {
    padding: 24px;
  }
}

.main-message_flexbox {
    display: flex;
    flex-direction: column;
    padding: 24px;
    @media (min-width: 600px) {
      flex-direction: row;
    }
}

.main-message_flexbox_item {
  flex: 1;
  h2{
    @media (max-width: 600px) {
      font-size: 16px;
    }
  }
}

.main-message_divider {
  border-bottom: 2px solid white;
  margin-top: 16px;

  @media (min-width: 600px) {
    flex-direction: row;
    border-bottom: none;
    border-left: 2px solid white;
    margin-left: 24px;
    margin-right: 24px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  @media (min-width: 1200px) {
    margin-left: 48px;
    margin-right: 48px;
  }
}

</style>