<template>
  <ion-page>
    <the-header />
    <ion-content class="ion-padding">
      <ion-grid fixed>
        <ion-row>
          <ion-col  size="12" offset-md="2" size-md="8" offset-lg="3" size-lg="6">
            <h1 class="ion-padding-start">Edit Table Details</h1>
            <h2 class="ion-padding-start">Table #{{ pubTable.tableNum }}</h2>
            <form @submit.prevent="submitted">
              <ion-item lines="none">
                  <ion-label position="stacked">Located In Area <ion-text color="danger">*</ion-text></ion-label>
                  <ion-select value="" interface="action-sheet" placeholder="e.g. Lounge" name="pubFloorArea" v-model="pubTable.pubFloorArea">
                      <ion-select-option v-for="pfa in pubFloorAreas" :key="pfa['.key']" :value="pfa.name">{{ pfa.name }}</ion-select-option>
                  </ion-select>
              </ion-item>

              <ion-item lines="none">
                <ion-label position="stacked">Seats <b>{{ pubTable.seats }}</b></ion-label>
                <ion-range name="seats" ref="seats" pin snaps debounce="200" min="1" max="12" v-model="pubTable.seats"
                  @ionChange="pubTable.seats = $event.target.value">
                  <ion-icon slot="start" :icon="people"></ion-icon>
                  <ion-icon slot="end" :icon="people"></ion-icon>
                </ion-range>
              </ion-item>

              <ion-item lines="none" v-if="pubFloors.lower !== pubFloors.upper">
                <ion-label position="stacked">Located on Floor # <b>{{ pubTable.floor }}</b></ion-label>
                <ion-range name="floor" ref="floor" pin snaps debounce="200" :min="pubFloors.lower" :max="pubFloors.upper" v-model="pubTable.floor"
                  @ionChange="updateTableFloors">
                  <ion-icon slot="start" :icon="layers"></ion-icon>
                  <ion-icon slot="end" :icon="layers"></ion-icon>
                </ion-range>
              </ion-item>
              <ion-item lines="none" v-else>
                <ion-label ref="floor" position="stacked">Located on Floor # {{ pubFloors.lower }}</ion-label>
              </ion-item>

              <div class="ion-padding">
                  <ion-button expand="block" class="ion-no-margin" type="submit">Save Table Details</ion-button>
              </div>
            </form>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonIcon, 
          IonRange, IonSelect, IonSelectOption, IonButton, IonText } from '@ionic/vue';

import TheHeader from '../components/TheHeader.vue'
import { people, layers } from 'ionicons/icons'

export default {
  data () {
    return {
      people, layers
    }
  },
  components: {
    TheHeader,
    IonPage, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonIcon, IonRange, IonSelect, IonSelectOption,
    IonButton, IonText
  },
  methods: {
    submitted () {
      this.$store.dispatch('pubModule/updatePubTable', this.pubTable)
      this.$router.replace({ name: 'edit-pub-tables', params: { id: this.pubTable.pubId } })
    },
    updateTableFloors (e) {
      console.log('updating table floors:', e)
      this.pubTable.floor = e.target.value
    }
  },
  computed: {
    pub () {
      return this.$store.getters['pubModule/pub']
    },
    pubFloors () {
      return this.pub.floors
    },
    pubFloorAreas () {
      return this.$store.getters['pubModule/pubFloorAreas']
    },
    pubTable: {
      get () {
        console.log('getting pubTable from getter')
        return this.$store.getters['pubModule/pubTable']
      },
      set (pubTable) {
        console.log('updating pubTable in setter:', pubTable)
        this.$store.dispatch('pubModule/setSelectedPubTable', pubTable)
      }
    }
  },
  created () {
    this.$store.dispatch('pubModule/fetchPubFloorAreas')
    console.log('pubTable key:', this.pubTable.key)
    this.$store.dispatch('pubModule/fetchPubTable', this.pubTable.key)
  },
  mounted () {
    this.$refs.seats.value = this.pubTable.seats
    this.$refs.floor.value = this.pubTable.floor
  }
}
</script>
