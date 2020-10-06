<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Edit Tables</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="backToEditPub">
            <ion-icon :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
         <ion-grid style="max-width:1200px;">
          <ion-row>
            <ion-col size="12" size-md="6" size-lg="4" v-for="pt in sortedTables" :key="pt['.key']">
              <table-card :pubTable="pt" :pubFloors="pub.floors" />
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-list>
      <form @submit.prevent="submitted" style="max-width:1200px; margin:0 auto;">
        <div class="ion-padding">
          <ion-button expand="block" class="ion-no-margin" type="submit">Done For Now</ion-button>
        </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/vue';

import TableCard from '../components/TableCardEdit.vue'
import { arrowBack } from 'ionicons/icons'

export default {
  name: 'edit-pub-tables',
  components: {
    TableCard,
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonGrid, IonRow, IonCol, IonIcon
  },
  data () {
    return {
      arrowBack
    }
  },
  methods: {
    submitted () {
      this.$router.replace({ name: 'pub-details', params: { id: this.pub.key } })
    },
    backToEditPub () {
      this.$router.replace({ name: 'edit-pub', params: { id: this.pub.key } })
    }
  },
  computed: {
    pubTables () {
      return this.$store.getters['pubModule/pubTables']
    },
    pub: {
      get () {
        return this.$store.getters['pubModule/pub']
      },
      set (pub) {
        this.$store.dispatch('pubModule/updatePub', pub)
      }
    },
    sortedTables () {
      var items = this.pubTables
      return items.sort((a, b) => a.tableNum - b.tableNum)
    }
  },
  watch: {
    pubTables () {
      console.log('pubTables is updated')
    }
  },
  created () {
    console.log(this.$route)
    console.log('current route param id ', this.$route.params.id)
    if (!this.pub || (this.$route.params.id !== undefined && this.pub.key !== this.$route.params.id)) {
      console.log('fecthing pub linked to pub id of: ', this.$route.params.id)
      this.$store.dispatch('pubModule/fetchPubByPubId', this.$route.params.id)
    } else {
      console.log('current pub key: ', this.pub.key)
      console.log('current pub in state matches current pub on screen - not retreiving data from db')
    }
    if (!this.pubTables.length === 0) {
      console.log('fecthing pub tables for pub with key of: ', this.$route.params.id)
      this.$store.dispatch('pubModule/fetchPubTables', this.$route.params.id)
    }
  }
}
</script>
