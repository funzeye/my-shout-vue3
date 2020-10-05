<template>
  <ion-page>
    <the-header />
    <ion-content class="ion-padding">
      <template v-if="isLoading">
      </template>
      <template v-else>
      <template v-if="user.userRoles && user.userRoles.publican === true">
        <ion-text>
          <h1 class="ion-padding">Your Pub</h1>
        </ion-text>
        <template v-if="publicansPub && publicansPub.key !== ''">
          <ion-grid fixed>
            <ion-row class="ion-justify-content-center">
              <ion-col size="12" size-sm="6" size-md="6" size-lg="3" size-xl="2">
                <pub-card :i="i" :pub="publicansPub" actionName="Manage" />
              </ion-col>
            </ion-row>
          </ion-grid>
        </template>
        <template v-else>
          <ion-grid class="publican-pub-grid">
            <ion-row class="ion-justify-content-center">
              <ion-col size="8" size-md="4">
                <ion-label>
                  You have no pub of your own added.
                </ion-label>
              </ion-col>
            </ion-row>
            <ion-row class="ion-justify-content-center">
              <ion-col size="8" size-md="4">
                <!--<ion-button expand="block" @click="createNewPub">
                <ion-icon :src="i.addOutline" slot="start"></ion-icon>
                Add New Pub
                </ion-button>-->
                  <ion-button expand="block" @click="createNewPub">
                    Add New Pub
                  </ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </template>
        </template>
      </template>
      <ion-item-divider v-if="user.userRoles && user.userRoles.punter === true && user.userRoles.publican === true">
      </ion-item-divider>
      <template v-if="auth != true || (user.userRoles && user.userRoles.punter === true)">
        <ion-grid fixed>
          <ion-row class="ion-justify-content-center">
            <ion-col size="12" size-md="6" size-lg="4">
              <ion-searchbar show-cancel-button="focus"
        debounce="300" @ionChange="filterSearchItems($event.target)"></ion-searchbar>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-grid style="max-width:1200px;">
          <ion-row class="ion-justify-content-center">
            <ion-col size="12" size-sm="6" size-md="6" size-lg="3" size-xl="2" animated="true" v-show="!p.hidePub" v-for="p in pubs" :key="p['.key']">
              <div>
                  <pub-card :pub="p" actionName="Select" />
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </template>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonText, IonGrid, IonButton, IonCol, IonSearchbar, IonItemDivider, IonRow, IonLabel } from '@ionic/vue';
import TheHeader from '../components/TheHeader.vue'
import PubCard from '../components/PubCard.vue'
import * as allIcons from 'ionicons/icons'
import { mapGetters } from 'vuex'

export default {
  name: 'search-for-pub',
  data () {
    return {
      i: allIcons,
      isLoading: true
    }
  },
  components: {
    IonPage,
    IonContent,
    TheHeader,
    IonText, IonGrid, IonButton, IonCol, IonRow, IonLabel, 
    IonSearchbar, IonItemDivider,
    PubCard
  },
  computed: {
    ...mapGetters({
      user: 'userModule/userDetails',
      auth: 'userModule/isAuthenticated',
      pubs: 'pubModule/pubs',
      publicansPub: 'pubModule/publicansPub'
    }),
    publicansPub: {
      get () {
        console.log('search-for-pub publicansPub Getter')
        return this.$store.getters['pubModule/publicansPub']
      }
    }
  },
  watch: {
    pubs () {
      console.log('pubs property has changed')
      this.isLoading = false
    }
  },
  created () {
    console.log('search-for-pub created method called')

    // if (!this.pubs || this.pubs.length === 0) {
    //  console.log('calling fetchPubs from SearchForPubs')
    this.$store.dispatch('pubModule/fetchPubs')
    // }
    if (!this.user || this.user.email === '') {
      this.$store.dispatch('userModule/fetchUserDetails')
    }
  },
  methods: {
    filterSearchItems (eTarget) {
      console.log('target:', eTarget)
      const valueToFilter = eTarget.value.toLowerCase()
      requestAnimationFrame(() => {
        console.log('this.pubs:', this.pubs)
        this.pubs.forEach((item, index) => {
          console.log('item:', item)
          const shouldShow = item.pubName.toLowerCase().indexOf(valueToFilter) > -1
          console.log('item.pubName.indexOf(valueToFilter):', item.pubName.toLowerCase().indexOf(valueToFilter))
          console.log('shouldShow:', shouldShow)
          console.log('!shouldShow:', !shouldShow)
          console.log('item.hidePub:', item.hidePub)
          item.hidePub = !shouldShow
          this.$set(this.pubs, index, item)
          console.log('item.hidePub:', item.hidePub)
        })
        console.log('pubs:', this.pubs)
      })
    },
    createNewPub () {
      this.$router.push({ name: 'create-new-pub' })
    }
  }
}
</script>

<style lang="scss" scoped>
h1{
  text-align:center;
}
.publican-pub-grid{
  text-align: center;
}
</style>
