<template>
  <div>
      <ion-card button="true" @click.prevent="viewPub">
        <ion-img class="pub-card-image" :src="pub.photoUrl"></ion-img>
        <ion-card-header>
          <ion-card-subtitle>Pub</ion-card-subtitle>
          <ion-card-title>{{ pub.pubName }}</ion-card-title>
        </ion-card-header>
        <ion-card-content class="ion-text-capitalize">
          <div>
          {{pub.addressLine1 }}, {{ pub.townCity }}, {{ pub.county }}
          </div>
        </ion-card-content>
      </ion-card>
  </div>
</template>

<script>
import { IonCard, IonImg, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from '@ionic/vue';
import * as allIcons from 'ionicons/icons'

export default {
  props: ['pub', 'actionName'],
  components: {
    IonCard, IonImg, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent
  },
  data () {
    return {
      i: allIcons
    }
  },
  methods: {
    viewPub () {
      this.$router.push({ name: 'pub-details', params: { id: this.pub.key } })
    }
  }
}
</script>

<style lang="scss" scoped>
.pub-card-image {
  padding: 16px;
  padding-bottom: 0;
  background: #406c6c;
}
</style>
