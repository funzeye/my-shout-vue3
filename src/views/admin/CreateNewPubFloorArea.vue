<template>
  <ion-page>
    <the-header />
    <ion-content class="ion-padding">
      <h1>Create New Pub Floor Area</h1>

      <form @submit.prevent="submitted">
        <ion-item>
            <ion-label position="stacked">Pub Floor Area Name <ion-text color="danger">*</ion-text></ion-label>
            <ion-input-vue type="text" placeholder="e.g. Lounge" clear-input name="pubFloorArea" v-model="pubFloorArea.name"></ion-input-vue>
        </ion-item>

        <div class="ion-padding">
            <ion-button expand="block" class="ion-no-margin" type="submit">Create Pub Floor Area</ion-button>
        </div>
      </form>

      <ion-list>
        <ion-item v-for="pfa in pubFloorAreas" :key="pfa['.key']">
          <ion-label>Area Name: {{ pfa.name }}</ion-label>
          <ion-button fill="clear" shape="round" @click="editPubFloorAreaDetails(pfa.key)">
            Edit
          </ion-button>
          <ion-button fill="clear" shape="round" @click="deletePubFloorArea(pfa.key)">
            <ion-icon :src="i.closeCircle" slot="icon-only" color="danger" name="star" ></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue'
import * as allIcons from 'ionicons/icons'

export default {
  data () {
    return {
      i: allIcons,
      pubFloorArea: {
        name: ''
      }
    }
  },
  components: {
    TheHeader
  },
  computed: {
    pubFloorAreas () {
      return this.$store.getters['pubModule/pubFloorAreas']
    }
  },
  methods: {
    submitted () {
      var newPubFloorArea = this.pubFloorArea
      console.log('submitted new pub floor area details:')
      console.log(newPubFloorArea)
      this.$store.dispatch('pubModule/storePubFloorArea', newPubFloorArea)
      this.pubFloorArea.name = ''
    },
    editPubFloorAreaDetails (areaKey) {
      this.$router.push({ name: 'edit-pub-floor-area', params: { key: areaKey } })
    },
    deletePubFloorArea (areaKey) {
      this.$store.dispatch('pubModule/deletePubFloorArea', areaKey)
    }
  },
  created () {
    this.$store.dispatch('pubModule/fetchPubFloorAreas')
  }
}
</script>
