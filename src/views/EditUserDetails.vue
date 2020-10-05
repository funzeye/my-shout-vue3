<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Edit User Details</ion-title>
                <ion-buttons slot="start">
                <ion-button @click="backToProfile">
                    <ion-icon :icon="arrowBack"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
        <ion-grid>
            <ion-row>
            <ion-col size="12" offset-md="3" size-md="6" offset-xl="4" size-xl="4">
                <h1 class="ion-padding-start">Edit User Details</h1>
            </ion-col>
            </ion-row>
        </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/vue';

import { arrowBack } from 'ionicons/icons'

export default {
  name: 'edit-user-details',
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonGrid, IonRow, IonCol
  },
  data () {
    return {
      arrowBack
    }
  },
  methods: {
    backToProfile () {
      this.$router.replace({ name: 'profile' })
    }
  }
}
</script>

<style scoped>

</style>
