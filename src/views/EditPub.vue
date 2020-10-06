<template>
  <ion-page>
     <ion-header>
      <ion-toolbar>
        <ion-title>Edit Pub</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="backToPubDetails">
            <ion-icon :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <ion-button @click="editPubTables">Edit Pub Tables</ion-button>
        <ion-button @click="editPubDetails">Edit Pub Details</ion-button>
        <ion-button @click="addPubPhoto">Add Photo of Pub</ion-button>

    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/vue';

import { arrowBack } from 'ionicons/icons'

export default {
  data () {
    return {
      arrowBack
    }
  },
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon
  },
  computed: {
    pub: {
      get () {
        return this.$store.getters['pubModule/pub']
      }
    }
  },
  methods: {
    backToPubDetails () {
      this.$router.replace({ name: 'pub-details', params: { id: this.pub.key } })
    },
    editPubTables () {
      this.$router.push({ name: 'edit-pub-tables', params: { id: this.pub.key } })
    },
    editPubDetails () {
      this.$router.push({ name: 'edit-pub-details', params: { id: this.pub.key } })
    },
    addPubPhoto () {
      this.$router.push({ name: 'add-pub-photo', params: { id: this.pub.key } })
    }
  }
}
</script>
