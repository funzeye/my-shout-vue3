<template>
    <div>
      <h1 class="ion-padding-start">Sign In</h1>
      <form @submit.prevent="onSubmit">
        <ion-item lines="none" class="input">
          <ion-label position="stacked" for="email">Email: <ion-text color="danger">*</ion-text></ion-label>
          <ion-input
                  type="email" id="email" @ionBlur="setEmailLostFocus"
                  v-model="email" @ionFocus="setEmailHasFocus"></ion-input>
          <ion-note v-if="!$v.email.email && email_not_focused" class="error ion-padding" color="danger">Valid Email Required</ion-note>
          <ion-note v-if="!emailExists" class="error ion-padding" color="danger">Email Address does not exist</ion-note>

        </ion-item>
        <ion-item lines="none" class="input">
          <ion-label  position="stacked" for="password">Password: <ion-text color="danger">*</ion-text></ion-label>
          <ion-input
                  type="password"
                  id="password"
                  v-model="password"
                  @ionFocus="passwordCorrect = true"></ion-input>
            <ion-note v-if="!passwordCorrect" class="error ion-padding" color="danger">Incorrect Password Entered</ion-note>
            <ion-note v-if="tooManyAttempts" class="error ion-padding" color="danger">Too Many Attempts - Login temporarily disabled for this user - Please try again later</ion-note>
        </ion-item>
        <div class="ion-padding">
          <ion-button type="submit" :disabled="$v.$invalid || tooManyAttempts">Submit</ion-button>

        </div>
      </form>
    </div>
</template>

<script>
import { IonButton, IonItem, IonInput, IonText, IonNote, IonLabel } from '@ionic/vue';
import { required, email } from "@vuelidate/validators";

export default {
  name: 'signInForm',
  components: {
    IonInput,
    IonItem,
    IonButton, IonText, IonNote, IonLabel
  },
  props: ['modalCloseParent', 'isModal'],
  data () {
    return {
      email: '',
      password: '',
      email_not_focused: false,
      emailExists: true,
      passwordCorrect: true,
      tooManyAttempts: false
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  },
  methods: {
    onSubmit () {
      this.emailExists = true
      this.passwordCorrect = true
      const formData = {
        email: this.email,
        password: this.password
      }
      console.log(formData)
      this.$store.dispatch('userModule/signin', { authData: formData, noRedirect: this.isModal })
        .catch(error => {
          console.log(error.code)
          // console.log(error.response.data.error.message)
          if (error.code.toUpperCase().includes('WRONG-PASSWORD') || error.code.toUpperCase().includes('INVALID_PASSWORD')) {
            this.passwordCorrect = false
          } else if (error.code.toUpperCase().includes('EMAIL_NOT_FOUND') || error.code.toUpperCase().includes('USER-NOT-FOUND')) {
            this.emailExists = false
          } else if (error.code.toUpperCase().includes('TOO-MANY-REQUESTS')) {
            this.tooManyAttempts = true
          }
        })

      console.log('isModal', this.isModal)
      if (this.isModal) this.modalCloseParent()
    },
    setEmailLostFocus () {
      this.$v.email.$touch(true)
      this.email_not_focused = true
    },
    setEmailHasFocus () {
      this.email_not_focused = false
      this.emailExists = true
    }
  }
}
</script>
