<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title>My Shout!</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="modalClose" color="danger" style="padding-right:12px;">
            <ion-icon :src="i.closeCircle"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="12">
            <sign-in-form :modalCloseParent="modalClose" :isModal="true"></sign-in-form>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-grid>
        <ion-row class="ion-justify-content-center ion-padding-vertical">
        <ion-router-link href="/#/signup" @click="modalClose">
          Not signed up? Sign up here
        </ion-router-link>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding-top">
        <ion-router-link href="/#/forgotpassword" @click="modalClose">
          Forgot password?
        </ion-router-link>
      </ion-row>
      </ion-grid>
    </ion-content>
  </div>
</template>

<script>
import SignInForm from './SignInForm'
import * as allIcons from 'ionicons/icons'

export default {
  name: 'modal',
  data () {
    return {
      i: allIcons
    }
  },
  components: {
    SignInForm
  },
  methods: {
    modalClose: function () {
      this.$ionic.modalController.dismiss()
    }
  }
}
</script>
