<template>
  <ion-page>
    <ion-content>
      <ion-tabs>
        <!-- <ion-tab tab="search-for-pub" :routes="['search-for-pub']">
          <ion-router-outlet name="searchRoute"></ion-router-outlet>
        </ion-tab> -->

        <!-- <ion-tab tab="booked-tables" :routes="['booked-tables']" id="booked-tables">
          <ion-router-outlet name="bookedTablesRoute"></ion-router-outlet>
        </ion-tab>

        <ion-tab tab="profile" :routes="['profile', 'change-email', 'edit-user-details']" id="profile">
          <ion-router-outlet name="profileRoute"></ion-router-outlet>
        </ion-tab> -->

        <ion-tab-bar slot="bottom">
            <ion-tab-button tab="search-for-pub" href="/tabs/search-for-pub">
              <ion-icon :icon="home"></ion-icon>
              <ion-label>Pub</ion-label>
            </ion-tab-button>

            <ion-tab-button v-if="auth" tab="booked-tables" href="/tabs/booked-tables">
              <ion-icon :icon="beer"></ion-icon>
              <ion-label>Bookings</ion-label>
            </ion-tab-button>

            <ion-tab-button v-if="auth" tab="profile"  href="/tabs/profile">
              <ion-icon :icon="person"></ion-icon>
              <ion-label>Profile</ion-label>
            </ion-tab-button>

          </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<script>
import { 
  IonTabs, 
  IonTabBar, 
  IonTabButton, 
  IonContent,
  IonIcon, 
  IonLabel,
  IonPage
  } from '@ionic/vue';

import { home, beer, person } from 'ionicons/icons'
import { mapGetters } from 'vuex'

export default {
  name: 'Tabs',
  setup() {
    return {
      home, person, beer
    }
  },
  components: {
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonContent,
    IonPage
  },
  computed: {
    ...mapGetters('userModule', {
      auth: 'isAuthenticated'
    })
  }
}
</script>
