<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>My Shout!</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col size="12" offset-md="3" size-md="6" offset-xl="4" size-xl="4">
            <sign-in-form :isModal="false"/>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-grid>
        <ion-row class="ion-justify-content-center ion-padding-vertical">
        <ion-router-link href="/signup">
          Not signed up? Sign up here
        </ion-router-link>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-padding-top">
        <ion-router-link href="/forgotpassword">
          Forgot password?
        </ion-router-link>
      </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonRouterLink, IonGrid, IonRow, IonCol } from '@ionic/vue';

import SignInForm from './SignInForm'

export default {
  name: 'login',
  components: {
    IonRouterLink,
    IonPage,
    IonHeader,
    IonContent,
    SignInForm, IonGrid, IonRow, IonCol,
    IonToolbar, IonTitle
  }
}
</script>
