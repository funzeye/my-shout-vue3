<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ pub.pubName }}</ion-title>
        <ion-buttons v-if="pub.ownerId === userId" slot="end">
          <ion-button @click="editPub">
            <ion-icon :icon="settingsOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div v-if="pub.photoUrl" class="image-container">
        <div class="image" :style="'background-image:url(' + pub.photoUrl + ')'"></div>
      </div>
      <ion-list>
        <ion-grid style="max-width:1200px;">
          <ion-row>
            <ion-col size="12" size-md="6" size-lg="4" v-for="pt in sortedTables" :key="pt['.key']">
                <table-card :pubTable="pt" :loggedInUserId="userId" :pubFloors="pub.floors"
                :userIsOwner="pub.ownerId === userId"/>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonTitle, IonIcon, IonContent, IonList, IonGrid, IonRow, IonCol, IonToolbar, IonButtons, IonButton } from '@ionic/vue';
import TableCard from '../components/TableCardReservation.vue'
import { settingsOutline } from 'ionicons/icons'
import { mapGetters } from 'vuex'

export default {

  name: 'pub-details',
  data () {
    return {
      pubImg: null
    }
  },
  setup() {
    return{
      settingsOutline
    }
  },
  components: {
    TableCard,
    IonPage, IonHeader, IonTitle, IonIcon, IonContent, IonList, IonGrid, IonRow, IonCol, IonToolbar, IonButtons, IonButton
  },
  computed: {
    ...mapGetters('pubModule', [
      'pubTables',
      'pub'
    ]),
    ...mapGetters('userModule', [
      'userId'
    ]),
    sortedTables () {
      var items = this.pubTables
      return items.sort((a, b) => a.tableNum - b.tableNum)
    }
  },
  created () {
    console.log(this.$route)
    console.log('current route param id ', this.$route.params.id)
    if (!this.pub || this.pub.key !== this.$route.params.id) {
      console.log('fecthing pub linked to pub id of: ', this.$route.params.id)
      this.$store.dispatch('pubModule/fetchPubByPubId', this.$route.params.id)
    } else {
      console.log('current pub key: ', this.pub.key)
      console.log('current pub in state matches current pub on screen - not retreiving data from db')
    }
  },
  methods: {
    editPub () {
      this.$router.push({ name: 'edit-pub', params: { id: this.pub.key } })
    }
  }
}

</script>

<style lang="scss" scoped>
.image-container{
  height: 40vh;
  max-height: none;
  position: relative;
  overflow: hidden;
  color: #fff;
}
.image{
  background-position: 50%;
  background-size: cover;
  background-attachment: scroll;
  background-repeat: no-repeat;
  z-index: 0;
  display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
</style>
