<template>
  <ion-header>
      <ion-toolbar>
        <ion-title>My Shout!</ion-title>
        <ion-router-link href="#/signup" v-if="!auth" slot="end">
          Sign Up
        </ion-router-link>
        <ion-router-link href="#/signin" v-if="!auth" slot="end">
          Log In
        </ion-router-link>
      </ion-toolbar>
    </ion-header>
</template>

<script>
import { IonHeader, IonToolbar, IonTitle, IonRouterLink } from '@ionic/vue';
import { mapGetters } from 'vuex'

export default {
  components:{
    IonHeader,
    IonRouterLink,
    IonTitle,
    IonToolbar
  },
  computed: {
     ...mapGetters('userModule', {
       auth: 'isAuthenticated'
     })
  }
}
</script>

<style lang="scss" scoped>

ion-router-link {
  margin-right: 16px;
}

</style>
