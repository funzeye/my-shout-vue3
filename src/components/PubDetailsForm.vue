<template>
  <ion-grid fixed>
    <ion-row>
      <ion-col size="12" offset-md="2" size-md="8" offset-lg="3" size-lg="6">
        <form @submit.prevent="submitted">
          <ion-item lines="none">
            <ion-label class="pub-details-label" position="stacked">Pub Name <ion-text color="danger">*</ion-text></ion-label>
            <ion-input @ionBlur="$v.pub.pubName.$touch(true)" type="text" placeholder="e.g. Walsh's Public House" clear-input name="pubName" v-model="pub.pubName"></ion-input>
          </ion-item>

          <ion-item lines="none">
            <ion-label position="stacked">Address <ion-text color="danger">*</ion-text></ion-label>
            <ion-input @ionBlur="$v.pub.addressLine1.$touch(true)" placeholder="Address Line 1" v-model="pub.addressLine1"></ion-input>
            <ion-input placeholder="Address Line 2 (Optional)" v-model="pub.addressLine2"></ion-input>
            <ion-input @ionBlur="$v.pub.townCity.$touch(true)" placeholder="Town/City" v-model="pub.townCity"></ion-input>
            <ion-select @ionBlur="$v.pub.county.$touch(true)" value="" interface="action-sheet" placeholder="County" name="county" v-model="pub.county">
              <ion-select-option value="carlow">Carlow</ion-select-option>
              <ion-select-option value="cavan">Cavan</ion-select-option>
              <ion-select-option value="cork">Cork</ion-select-option>
              <ion-select-option value="clare">Clare</ion-select-option>
              <ion-select-option value="donegal">Donegal</ion-select-option>
              <ion-select-option value="dublin">Dublin</ion-select-option>
              <ion-select-option value="galway">Galway</ion-select-option>
              <ion-select-option value="kerry">Kerry</ion-select-option>
              <ion-select-option value="kildare">Kildare</ion-select-option>
              <ion-select-option value="kilkenny">Kilkenny</ion-select-option>
              <ion-select-option value="laois">Laois</ion-select-option>
              <ion-select-option value="leitrim">Leitrim</ion-select-option>
              <ion-select-option value="limerick">Limerick</ion-select-option>
              <ion-select-option value="longford">Longford</ion-select-option>
              <ion-select-option value="louth">Louth</ion-select-option>
              <ion-select-option value="mayo">Mayo</ion-select-option>
              <ion-select-option value="meath">Meath</ion-select-option>
              <ion-select-option value="monaghan">Monaghan</ion-select-option>
              <ion-select-option value="offaly">Offaly</ion-select-option>
              <ion-select-option value="roscommon">Roscommon</ion-select-option>
              <ion-select-option value="sligo">Sligo</ion-select-option>
              <ion-select-option value="tipperary">Tipperary</ion-select-option>
              <ion-select-option value="waterford">Waterford</ion-select-option>
              <ion-select-option value="westmeath">Westmeath</ion-select-option>
              <ion-select-option value="wexford">Wexford</ion-select-option>
              <ion-select-option value="wicklow">Wicklow</ion-select-option>
            </ion-select>
            <ion-input placeholder="Eircode (Optional)" v-model="pub.eircode"></ion-input>
            <ion-note v-if="$v.pub.county.$invalid && $v.pub.county.$dirty" class="error ion-padding" color="danger">county is required</ion-note>

          </ion-item>

          <ion-item lines="none" :disabled="allTodaysReservationsForPub && allTodaysReservationsForPub.length > 0">
            <ion-label position="stacked">Number of Reservable Tables<ion-text color="danger">*</ion-text></ion-label>
            <ion-input
              @ionBlur="$v.pub.numOfTables.$touch(true)"
              type="number"
              clear-input
              placeholder="e.g. 12" v-model.number="pub.numOfTables">
            </ion-input>
            <ion-note v-if="allTodaysReservationsForPub && allTodaysReservationsForPub.length > 0" class="error ion-padding" color="danger">Cannot change number of tables while some tables are currently reserved</ion-note>
            <ion-note v-if="!$v.pub.numOfTables.minVal" class="error ion-padding" color="danger">Must add at least 1 table</ion-note>
          </ion-item>
          <ion-item lines="none">
              <ion-label position="stacked">Floors (drag blue dot left or right to update)</ion-label>
              <ion-note v-if="mode === 'edit'">If you change floor numbers - dont forget to also update the floor numbers assigned to your individual tables
                as they could now be incorrect. You can do this on the "Edit Pub Tables" page</ion-note>
              <ion-range ref="floors" id="dual-range"
                dual-knobs pin snaps debounce="200" min="-5" max="10" v-model="pub.floors"
                @ionChange="pub.floors = $event.target.value">
                <ion-icon slot="start" :icon="layers"></ion-icon>
                <ion-icon slot="end" :icon="layers"></ion-icon>
              </ion-range>
              <ion-note v-if="pub.floors.lower === pub.floors.upper" class="floor-details ion-padding" color="secondary">&#10004; 1 Floor Selected</ion-note>
              <ion-note v-if="pub.floors.lower === pub.floors.upper && pub.floors.upper !== 0" class="floor-details ion-padding" color="secondary">&#10004; Floor #: {{ pub.floors.lower }}</ion-note>
              <ion-note v-if="pub.floors.lower === pub.floors.upper && pub.floors.upper === 0" class="floor-details ion-padding" color="secondary">&#10004; Ground Floor Only</ion-note>

              <ion-note v-if="pub.floors.lower !== pub.floors.upper" class="floor-details ion-padding" color="secondary">&#10004; {{ pub.floors.upper - pub.floors.lower + 1 }} Floors Selected</ion-note>
              <ion-note v-if="pub.floors.lower !== pub.floors.upper" class="floor-details ion-padding" color="secondary">&#10004; Lowest floor #: {{ pub.floors.lower }}</ion-note>
              <ion-note v-if="pub.floors.lower !== pub.floors.upper" class="floor-details ion-padding" color="secondary">&#10004; Highest floor #: {{ pub.floors.upper }}</ion-note>
          </ion-item>

          <ion-item-group>
            <ion-item lines="none">
                <ion-label position="stacked">Time to Arrival Limit</ion-label>
                  <ion-toggle slot="end"
                    @ionChange="changeTimeArrivalLimitOn"
                    :value="pub.timeToArrivalLimitOn"
                    :checked="pub.timeToArrivalLimitOn">
                  </ion-toggle>
                  <ion-note>Allows you, the publican, to cancel a reservation ONLY if the patron has not arrived within the below time limit</ion-note>
                  <ion-note>If turned off then you may cancel a reservation at any time.</ion-note>
                  <ion-note v-if="mode === 'edit'">Any changes to arrival limit will only apply to future reservations, not past.</ion-note>

            </ion-item>
            <ion-item lines="none" :disabled="!pub.timeToArrivalLimitOn">
                <ion-label position="stacked">Set Time to Arrival Limit: <b>{{ pub.timeToArrivalLimitInMinutes }} minutes</b></ion-label>
                <ion-range name="limitToArrival" ref="limitToArrival" pin snaps debounce="200"
                    min="15" max="120" step="15" :value="pub.timeToArrivalLimitInMinutes" :v-model="pub.timeToArrivalLimitInMinutes" @ionChange="pub.timeToArrivalLimitInMinutes = $event.target.value">
                    <ion-icon slot="start" :icon="alarm"></ion-icon>
                    <ion-icon slot="end" :icon="alarm"></ion-icon>
                </ion-range>
              </ion-item>
          </ion-item-group>

          <div class="ion-padding">
            <ion-button expand="block" class="ion-no-margin" :disabled="$v.$invalid" type="submit">Save Pub Details</ion-button>
          </div>
        </form>
      </ion-col>
    </ion-row>
  </ion-grid>

</template>

<script>
import { IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItem, IonItemGroup, IonLabel, 
          IonNote, IonInput, IonSelect, IonSelectOption, IonRange, IonText, IonToggle } from '@ionic/vue';

import { required, numeric, minValue } from '@vuelidate/validators'
import { layers, alarm } from 'ionicons/icons'

export default {
  data () {
    return {
      layers, alarm
    }
  },
  components: {
    IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItem, IonItemGroup, IonLabel, IonNote, 
    IonInput, IonSelect, IonSelectOption, IonRange, IonText, IonToggle
  },
  props: ['mode'],
  validations: {
    pub: {
      numOfTables: {
        required,
        numeric,
        minVal: minValue(1)
      },
      pubName: { required },
      addressLine1: { required },
      townCity: { required },
      county: { required }
    }
  },
  computed: {
    pub: {
      get () {
        return this.$store.getters['pubModule/pub']
      },
      set (pub) {
        this.$store.dispatch('pubModule/updatePub', pub)
      }
    },
    allTodaysReservationsForPub () {
      return this.$store.getters['reservationModule/allTodaysReservationsForPub']
    },
    userId () {
      return this.$store.getters['userModule/userId']
    }
  },
  methods: {
    async submitted () {
      var pubDetails = this.pub
      if (this.mode === 'create') {
        console.log('submitted pub details for creation of new pub.')
        pubDetails.ownerId = this.userId
        this.$store.dispatch('pubModule/storePub', pubDetails)
        this.$router.replace({ name: 'edit-pub-tables' })
      } else {
        console.log('submitted pub details for update of existing pub.')
        console.log('updating pub in DB')
        this.$store.dispatch('pubModule/updatePubDetailsInDb', pubDetails)
        this.$router.replace({ name: 'edit-pub', params: { id: this.pub.key } })
      }
    },
    changeTimeArrivalLimitOn () {
      this.pub.timeToArrivalLimitOn = !this.pub.timeToArrivalLimitOn
    }
  },
  created () {
    // this.$store.dispatch('fetchUser')
    // this.$store.dispatch('fetchPubs')
  },
  mounted () {
    this.$refs.floors.value = this.pub.floors
  }
}
</script>

<style lang="css" scoped>
 .floor-details {
   padding-top: 0;
 }
 ion-item{
   --background: white;
 }

 form {
   border-radius: 5px;
 }
</style>
