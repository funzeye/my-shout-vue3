<template>
  <ion-page>
    <ion-header>
          <ion-toolbar>
              <ion-title>Your Profile</ion-title>
              <ion-buttons slot="end">
                <ion-button v-if="isAuthenticated" @click="onLogout">
                  Logout
                </ion-button>
              </ion-buttons>
          </ion-toolbar>
      </ion-header>
    <ion-content class="ion-padding">
      <ion-text><h2 style="padding-left:16px">{{ userDetails.email }}</h2></ion-text>
      <ion-item lines="none">
         <ion-button style="margin-bottom:16px" @click="changeEmail">Change Email</ion-button>
      </ion-item>
      <ion-item lines="none">
         <ion-button style="margin-top:16px; margin-bottom:16px" @click="editUserDetails">Edit Your Details</ion-button>
      </ion-item>
      <ion-item lines="none">
        <ion-button style="margin-top:16px; margin-bottom: 16px" @click="changePassword">Send Password Reset Email</ion-button>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script>
import { alertController, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonButtons, IonButton, IonItem } from '@ionic/vue';

import { mapGetters } from 'vuex'

export default {

  name: 'profile',
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonButtons, IonButton, IonItem
  },
  computed: {
    ...mapGetters('userModule', [
      'userId',
      'userDetails',
      'isAuthenticated'
    ])
  },
  methods: {
    changeEmail () {
      this.$router.push({ name: 'change-email', params: { userId: this.userId } })
    },
    editUserDetails () {
      this.$router.push({ name: 'edit-user-details', params: { userId: this.userId } })
    },
    changePassword () {
      return alertController
        .create({
          cssClass: 'alert-cancel-res',
          header: 'Password Reset Request',
          subHeader: this.userDetails.email,
          message: 'Clicking "Confirm" will log you out and an email will be sent to the above address',
          buttons: [
            {
              text: 'Back',
              role: 'cancel',
              // cssClass: 'secondary',
              handler: () => {
                console.log('password reset abandoned.')
              }
            },
            {
              text: 'Confirm',
              handler: () => {
                console.log('password reset Confirmed')
                this.$store.dispatch('userModule/sendPasswordEmailReset', this.userDetails.email)
              }
            }
          ]
        })
        .then(a => a.present())
    },
    onLogout: function () {
      this.$store.dispatch('userModule/logout')
    }
  }
}
</script>
