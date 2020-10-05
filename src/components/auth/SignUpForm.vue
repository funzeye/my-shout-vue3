<template>
  <form @submit.prevent="onSubmit">
    <ion-item lines="none" class="input">
    <ion-label position="stacked" for="firstName">First name <ion-text color="danger">*</ion-text></ion-label>
    <ion-input-vue
            type="text"
            id="firstName"
            @ionBlur="$v.firstName.$touch(true)"
            v-model="firstName"></ion-input-vue>
    <ion-note v-if="$v.firstName.$invalid && $v.firstName.$dirty" class="error ion-padding" color="danger">Valid name required</ion-note>
    </ion-item>
    <ion-item lines="none" class="input">
    <ion-label position="stacked" for="surname">Surname <ion-text color="danger">*</ion-text></ion-label>
    <ion-input-vue
            type="text"
            inputmode="text"
            id="surname"
            @ionBlur="$v.surname.$touch(true)"
            v-model="surname"></ion-input-vue>
    <ion-note v-if="$v.surname.$invalid && $v.surname.$dirty" class="error ion-padding" color="danger">Valid name required</ion-note>
    </ion-item>

    <ion-item lines="none" class="input">
    <ion-label position="stacked" for="phone">Phone <ion-text color="danger">*</ion-text></ion-label>
    <ion-input-vue
            type="tel"
            inputmode="tel"
            id="phone"
            @ionBlur="$v.phone.$touch(true)"
            v-model="phone"></ion-input-vue>
    <ion-note v-if="$v.phone.$invalid && $v.phone.$dirty" class="error ion-padding" color="danger">Valid number required</ion-note>
    </ion-item>

    <ion-item lines="none">
    <ion-label position="stacked">I'm a: <ion-text color="danger">*</ion-text></ion-label>
    <ion-select-vue @ionBlur="$v.userRole.$touch(true)" interface="action-sheet" placeholder="Publican or Patron" name="userRole"
    v-model="userRole">
        <ion-select-option value="punter">Patron / Pub goer</ion-select-option>
        <ion-select-option value="publican">Publican</ion-select-option>
        <ion-select-option v-if="user.userRoles.admin" value="admin">Admin</ion-select-option>

    </ion-select-vue>
    <ion-note v-if="$v.userRole.$invalid && $v.userRole.$dirty" class="error ion-padding" color="danger">required</ion-note>
    </ion-item>
    <ion-item lines="none" class="input">
    <ion-label position="stacked" for="email">Email <ion-text color="danger">*</ion-text></ion-label>
    <ion-input-vue
            type="email"
            inputmode="email"
            id="email"
            @ionBlur="setEmailLostFocus"
            v-model="email"
            @ionFocus="email_not_focused = false"></ion-input-vue>
    <ion-note v-if="!$v.email.email && email_not_focused" class="error ion-padding" color="danger">Valid Email Required</ion-note>
    <ion-note v-if="!$v.email.unique && !$v.email.$pending" class="error ion-padding" color="danger">Email Already Taken</ion-note>
    </ion-item>
    <ion-item lines="none" class="input">
    <ion-label position="stacked" for="password">Password <ion-text color="danger">*</ion-text></ion-label>
    <ion-input-vue
            type="password"
            id="password"
            @ionBlur="$v.password.$touch(true)"
            v-model="password"></ion-input-vue>
    <ion-note v-if="!$v.password.minLen" class="error ion-padding" color="danger">Must be at least 8 characters long</ion-note>
    <ion-note v-if="!$v.password.containsUppercase && $v.password.$dirty" class="error ion-padding" color="danger">Must contain an upper case character</ion-note>
    <ion-note v-if="!$v.password.containsLowercase && $v.password.$dirty" class="error ion-padding" color="danger">Must contain a lower case character</ion-note>
    <ion-note v-if="!$v.password.containsNumber && $v.password.$dirty" class="error ion-padding" color="danger">Must contain a number</ion-note>
    <ion-note v-if="!$v.password.containsSpecial && $v.password.$dirty" class="error ion-padding" color="danger">Must contain a special character</ion-note>
    </ion-item>
    <ion-item lines="none" class="input">
    <ion-label position="stacked" for="confirm-password">Confirm Password <ion-text color="danger">*</ion-text></ion-label>
    <ion-input-vue
            type="password"
            id="confirm-password"
            @ionBlur="$v.confirmPassword.$touch(true)"
            v-model="confirmPassword"></ion-input-vue>
    <ion-note v-if="!$v.confirmPassword.sameAs && $v.password.$dirty" class="error ion-padding" color="danger">Passwords do not match</ion-note>
    </ion-item>

    <!--<ion-item class="input">
    <ion-label>Accept Terms of Use</ion-label>
    <ion-checkbox slot="start" color="primary" id="terms" v-model="terms"></ion-checkbox>
    </ion-item>-->

    <div class="ion-padding">
    <ion-button type="submit" :disabled="$v.$invalid">Submit</ion-button>
    </div>
  </form>
</template>

<script>
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import axios from '@/axios-auth'
import { mapGetters } from 'vuex'

export default {
  props: ['signInNewUser'],
  data () {
    return {
      firstName: '',
      surname: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      userRole: '',
      terms: false,
      email_not_focused: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'userModule/userDetails'
    })
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
    },
    password: {
      required,
      minLen: minLength(8),
      containsUppercase: function (value) {
        return /[A-Z]/.test(value)
      },
      containsLowercase: function (value) {
        return /[a-z]/.test(value)
      },
      containsNumber: function (value) {
        return /[0-9]/.test(value)
      },
      containsSpecial: function (value) {
        // return !/[#?!@$%^&*-]/.test(value)
        return /\W|_/.test(value)
      }
    },
    confirmPassword: {
      sameAs: sameAs('password')
    },
    userRole: {
      required
    },
    firstName: {
      required,
      minLen: minLength(2)
    },
    surname: {
      required,
      minLen: minLength(2)
    },
    phone: {
      required
    }
  },
  methods: {
    onSubmit () {
      const formData = {
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
        terms: this.terms,
        firstName: this.firstName,
        surname: this.surname,
        userRole: this.userRole,
        phone: this.phone,
        signInNewUser: this.signInNewUser
      }
      console.log(formData)
      this.$store.dispatch('userModule/signup', formData)
    },
    setEmailLostFocus () {
      console.log('email lost focus')
      this.$v.email.$touch(true)
      this.email_not_focused = true
    }
  }
}
</script>

<style>

</style>
