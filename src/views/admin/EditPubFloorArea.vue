<template>
    <ion-page>
    <ion-header>
        <ion-toolbar>
            <ion-title>Edit Pub Floor Area</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content>
        <form @submit.prevent="submitted">
        <ion-item lines="none">
            <ion-label position="stacked">Pub Floor Area Name <ion-text color="danger">*</ion-text></ion-label>
            <ion-input-vue type="text" placeholder="e.g. Lounge" clear-input name="pubFloorArea" v-model="pubFloorArea.name"></ion-input-vue>
        </ion-item>

        <div class="ion-padding">
            <ion-button expand="block" class="ion-no-margin" type="submit">Save & Close</ion-button>
        </div>
      </form>
    </ion-content>
    </ion-page>
</template>

<script>
export default {
  data () {
    return {
      pubFloorArea: {
        name: ''
      }
    }
  },
  computed: {
    pubFloorAreas () {
      return this.$store.getters['pubModule/pubFloorAreas']
    }
  },
  created () {
    if (this.pubFloorAreas.length === 0) {
      this.$store.dispatch('pubModule/fetchPubFloorAreas')
    }

    this.pubFloorArea = this.pubFloorAreas.find(el => el.key === this.$route.params.key)
  },
  methods: {
    submitted () {
      var pubFloorArea = this.pubFloorArea
      console.log('submitted updated pub floor area details...')
      console.log(pubFloorArea)
      this.$store.dispatch('pubModule/updatePubFloorArea', pubFloorArea)
      this.$router.push({ name: 'create-new-pub-floor-area' })
    }
  }
}
</script>
