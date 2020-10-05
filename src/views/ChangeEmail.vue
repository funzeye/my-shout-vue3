<template>
    <ion-page>
    <ion-header>
          <ion-toolbar>
              <ion-title>Change Email</ion-title>
              <ion-buttons slot="start">
                <ion-button @click="backToProfile">
                    <ion-icon :icon="arrowBack"></ion-icon>
                </ion-button>
              </ion-buttons>
          </ion-toolbar>
      </ion-header>
    <ion-content class="ion-padding">
      <ion-grid fixed>
        <ion-row>
          <ion-col size="12" offset-md="3" size-md="6" offset-xl="4" size-xl="4">
            <form @submit.prevent="onSubmit">
              <ion-item lines="none" class="ion-padding-bottom">
                  <ion-label position="stacked">Current Email:</ion-label>
                  <ion-text><b>{{ userDetails.email }}</b></ion-text>
              </ion-item>
              <ion-item lines="none" class="input">
                <ion-label position="stacked" for="email">New Email <ion-text color="danger">*</ion-text></ion-label>
                <ion-input
                        type="email" id="email" inputmode="email"
                        debounce="300" @ionBlur="setEmailLostFocus"
                        v-model="email" @ionFocus="email_not_focused = false"></ion-input>
                <ion-note v-if="!$v.email.email && email_not_focused" class="error ion-padding" color="danger">Valid Email Required</ion-note>
                <ion-note v-if="!$v.email.unique && !$v.email.$pending" class="error ion-padding" color="danger">Email Already Taken</ion-note>
              </ion-item>
              <ion-item lines="none" class="ion-padding-bottom">
                  <ion-label position="stacked">Current Password:</ion-label>
                  <ion-input @ionFocus="passwordCorrect = true" type="password" id="userProvidedPassword" v-model="userProvidedPassword"></ion-input>
                  <ion-note v-if="!passwordCorrect" class="error ion-padding" color="danger">Incorrect Password Entered</ion-note>
                 <ion-note v-if="tooManyAttempts" class="error ion-padding" color="danger">Too Many Attempts - 'Change Email' is temporarily disabled for this user - Please try again later</ion-note>
              </ion-item>
              <div class="ion-padding">
                <ion-button type="submit" :disabled="$v.$invalid || tooManyAttempts">Submit</ion-button>
              </div>
            </form>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonButtons, 
        IonButton, IonGrid, IonRow, IonCol, IonInput,
        IonItem, IonLabel, IonNote, IonIcon } from '@ionic/vue';

import { required, email } from '@vuelidate/validators'
import axios from '@/axios-auth'
import { arrowBack } from 'ionicons/icons'
import { mapGetters } from 'vuex'
import { toastController } from '@ionic/core'

const handleToast = (message, isError = false) => {
  toastController
    .create({
      message: message,
      position: 'top',
      color: isError ? 'danger' : 'success',
      duration: 2000
    })
    .then((t) => t.present())
}

export default {
  name: 'change-email',
  components:{
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonText, IonButtons, IonButton, IonGrid, IonRow, IonCol, IonInput, IonNote,
    IonItem, IonLabel, IonIcon
  },
  data () {
    return {
      email: '',
      userProvidedPassword: '',
      email_not_focused: false,
      passwordCorrect: true,
      tooManyAttempts: false,
      arrowBack,
    }
  },
  validations: {
    email: {
      required,
      email,
      async unique (val) {
        if (val.trim().length === 0) return true
        let isUnique = true
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (emailRegex.test(val)) {
          console.log('is a valid email, checking if unique')

          const response = await axios.post(':createAuthUri?key=AIzaSyB8-xAjyYMTR0Jt1-H-ayS9FDINW4JdAhQ', {
            identifier: val,
            continueUri: window.location.href
          })
            .catch((ex) => {
              console.log('error:', ex)
              return true
            })

          console.log('response:', response)
          isUnique = !response.data.registered
        }
        return await Boolean(isUnique)
      }
    }
  },
  computed: {
    ...mapGetters('userModule', [
      'userDetails',
      'userId'
    ])
  },
  methods: {
    onSubmit () {
      this.passwordCorrect = true

      const newData = { newEmail: this.email, userProvidedPassword: this.userProvidedPassword }
      console.log('new email:', newData.newEmail)
      this.$store.dispatch('userModule/changeEmail', newData)
        .then(() => {
          handleToast('Email Changed Successfully!', false)
          this.userProvidedPassword = ''
        })
        .catch(error => {
          if (error.code.toUpperCase().includes('WRONG-PASSWORD') || error.code.toUpperCase().includes('INVALID_PASSWORD')) {
            this.passwordCorrect = false
          } else if (error.code.toUpperCase().includes('TOO-MANY-REQUESTS')) {
            this.tooManyAttempts = true
          }
          handleToast('Email not changed', true)
        })
    },
    setEmailLostFocus () {
      console.log('email lost focus')
      this.$v.email.$touch(true)
      this.email_not_focused = true
    },
    backToProfile () {
      this.$router.replace({ name: 'profile' })
    }
  },
  created () {
    if (this.userDetails.email === '') {
      this.$store.dispatch('userModule/fetchUserDetails', this.userId)
    }
  }
}
</script>
