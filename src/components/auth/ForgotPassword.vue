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
            <h1 class="ion-padding-start">Reset Password</h1>
            <form @submit.prevent="onSubmit">
              <ion-item lines="none" class="input">
                <ion-label position="stacked" for="email">Email:</ion-label>
                <ion-input-vue
                        type="email"
                        id="email"
                        @ionBlur="setEmailLostFocus"
                        v-model="email"
                        @ionFocus="email_not_focused = false"></ion-input-vue>
              </ion-item>
              <ion-note v-if="!$v.email.email && email_not_focused" class="error ion-padding" color="danger">Valid Email Required</ion-note>

              <div class="ion-padding">
                <ion-button type="submit" :disabled="$v.$invalid">Send Password Reset Email</ion-button>
              </div>
            </form>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-grid>
      <ion-row class="ion-justify-content-center ion-padding-vertical">
      <ion-router-link href="/#/signin">
        Sign In
      </ion-router-link>
      </ion-row>
      <ion-row class="ion-justify-content-center ion-padding-top">
      <ion-router-link href="/#/signup">
        Sign Up
      </ion-router-link>
      </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import { required, email } from '@vuelidate/validators'

export default {
  data () {
    return {
      email: '',
      email_not_focused: false
    }
  },
  validations: {
    email: {
      required,
      email
    }
  },
  methods: {
    onSubmit () {
      const formData = {
        email: this.email
      }
      console.log(formData)
      this.$store.dispatch('userMdoule/sendPasswordEmailReset', this.email)
    },
    setEmailLostFocus () {
      this.$v.email.$touch(true)
      this.email_not_focused = true
    }
  }
}
</script>
