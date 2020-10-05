<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Pub Details</ion-title>
                <ion-buttons slot="start">
                <ion-button @click="backToEditPub">
                    <ion-icon :src="i.arrowBack"></ion-icon>
                </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <pub-details-form mode="edit"/>
        </ion-content>
    </ion-page>
</template>

<script>
import * as allIcons from 'ionicons/icons'
import PubDetailsForm from '../components/PubDetailsForm.vue'

export default {
  components: {
    PubDetailsForm
  },
  data () {
    return {
      i: allIcons
    }
  },
  methods: {
    backToEditPub () {
      this.$router.replace({ name: 'edit-pub', params: { id: this.$route.params.id } })
    }
  }
}
</script>

<style lang="scss" scoped>
 ion-content, ion-item{
   --background: white;
 }
</style>
