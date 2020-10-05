<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>My Shout!</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="12" offset-md="3" size-md="6" offset-xl="4" size-xl="4">
            <h1 class="ion-padding-start">Sign Up</h1>
            <sign-up-form signInNewUser='true'/>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-row class="ion-justify-content-center ion-padding-top">
      <ion-router-link href="/#/signin" style="padding-bottom:100px;">
        Already have an account? Sign In
      </ion-router-link>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script>
import SignUpForm from './SignUpForm'

export default {
  name: 'signup',
  components: {
    SignUpForm
  }
}
</script>

<style scoped>

</style>
