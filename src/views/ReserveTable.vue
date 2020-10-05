<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Reserve Table</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="backToPubDetails">
            <ion-icon :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-sm="8" size-md="6" size-xl="4">
            <form @submit.prevent="reserve">
              <ion-item lines="none">
                  <ion-label position="stacked">Table # To Reserve:</ion-label>
                  <ion-input class="disabled" disabled>{{ pubTable.tableNum }}</ion-input>
              </ion-item>
              <ion-item lines="none">
                  <ion-label position="stacked">Name on Reservation: <ion-text v-if="pub.ownerId === userId" color="danger">*</ion-text></ion-label>
                  <ion-input v-if="pub.ownerId !== userId" type="text" class="disabled" disabled>{{userDetails.firstName}} {{userDetails.surname}}</ion-input>
                  <ion-input v-else autofocus="true" type="text" inputmode="text" v-model="ownerReservedOnBehalfOf" placeholder="Please add name of person here"></ion-input>
              </ion-item>
              <ion-item lines="none" v-if="pub.ownerId === userId">
                  <ion-label position="stacked">Their Phone Number: <ion-text color="danger">*</ion-text></ion-label>
                  <ion-input inputmode="tel" type="tel" v-model="ownerReservedOnBehalfOfPhone" placeholder="Please add number of person here"></ion-input>
              </ion-item>
              <ion-item lines="none">
                  <ion-label position="stacked">In Pub:</ion-label>
                  <ion-input class="disabled" disabled>{{ pub.pubName }}</ion-input>
              </ion-item>
              <ion-item lines="none">
                  <ion-label position="stacked">On date:</ion-label>
                  <ion-input class="disabled" disabled>Today</ion-input>
              </ion-item>

              <p class="info-text">
                <ion-text color="secondary">
                There is NO time limit on this reservation. Once Reserved it will stay reserved unless freed by the patron or publican. You can stay at table until closing.
                </ion-text>
              </p>

              <div v-if="!isAuthenticated" class="ion-padding">
                  <ion-button expand="block" class="ion-no-margin" @click.prevent="login">Sign In To Reserve</ion-button>
              </div>
              <div v-else class="ion-padding">
                  <ion-button expand="block" class="ion-no-margin" :disabled="$v.$invalid && pub.ownerId === userId" type="submit">Confirm Reservation</ion-button>
              </div>
              <div class="ion-padding">
                  <ion-button expand="block" color="secondary" class="ion-no-margin" @click.prevent="cancel">Cancel</ion-button>
              </div>
            </form>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import { modalController, alertController, IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol,
          IonIcon, IonButton, IonButtons, IonLabel, IonInput, IonItem, IonText  } from '@ionic/vue';

import { arrowBack } from 'ionicons/icons'
import { required } from '@vuelidate/validators'
import { mapGetters } from 'vuex'
import Modal from '../components/auth/SignInModal.vue'

export default {
  name: 'reserve-table',
  components: {
    IonIcon, IonButton, IonButtons, IonLabel, IonInput, IonItem, IonText,
    IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol
  },
  data () {
    return {
      ownerReservedOnBehalfOf: null,
      ownerReservedOnBehalfOfPhone: null,
      arrowBack
    }
  },
  validations: {
    ownerReservedOnBehalfOf: {
      required
    },
    ownerReservedOnBehalfOfPhone: {
      required
    }
  },
  computed: {
    ...mapGetters('pubModule', [
      'pubTable',
      'pub'
    ]),
    ...mapGetters('userModule', [
      'isAuthenticated',
      'userDetails',
      'userId'
    ])
  },
  methods: {
    backToPubDetails () {
      this.$router.replace({ name: 'pub-details', params: { id: this.pub.key } })
    },
    cancel () {
      console.log('reserveTable.vue: cancel button clicked')
      this.$router.replace({ name: 'pub-details', params: { id: this.pub.key } })
    },
    reserve () {
      if (this.pub.ownerId === this.userId) {
        this.reserveTable()
      } else if (!this.pub.timeToArrivalLimitOn) {
        return alertController
          .create({
            cssClass: 'confirm-res',
            header: 'Confirm Reservation',
            // subHeader: 'Subtitle',
            message: 'Please note that the pub can cancel your reservation at any time without notice if they believe that you have not arrived (or will not arrive) within a reasonable time.',
            buttons: [
              {
                text: 'Back',
                role: 'cancel',
                // cssClass: 'secondary',
                handler: () => {
                  console.log('Reservation abandoned.')
                }
              },
              {
                text: 'Confirm',
                handler: () => {
                  this.reserveTable()
                }
              }
            ]
          })
          .then(a => a.present())
      } else {
        return alertController
          .create({
            cssClass: 'alert-cancel-res',
            header: 'Confirm Reservation',
            // subHeader: 'Subtitle',
            message: 'Please note that if you do not arrive to your table within ' + this.pub.timeToArrivalLimitInMinutes + ' minutes then the pub can cancel your reservation without notice.',
            buttons: [
              {
                text: 'Back',
                role: 'cancel',
                // cssClass: 'secondary',
                handler: () => {
                  console.log('Reservation abandoned.')
                }
              },
              {
                text: 'Confirm',
                handler: () => {
                  this.reserveTable()
                }
              }
            ]
          })
          .then(a => a.present())
      }
    },
    reserveTable () {
      console.log('Reservation Confirmed')
      console.log('reserveTable.vue: confirm reservation button clicked. submitting a new reservation')
      if (this.pub.ownerId !== this.userId) {
        console.log('cancelling all existing reservations for punter')
        this.$store.dispatch('reservationModule/cancelOtherReservationForPunterAndReserveNew', { userId: this.userId, tableToIgnoreId: this.pubTable.key, patronDetails: { patronName: this.userDetails.firstName + ' ' + this.userDetails.surname, patronPhone: this.userDetails.phone } })
      } else { // owner allowed make as many reservation as they wish in their own pub
        console.log('reserveTable.vue: creating reservation')
        this.$store.dispatch('reservationModule/createReservation', { patronName: this.ownerReservedOnBehalfOf, patronPhone: this.ownerReservedOnBehalfOfPhone })
      }
      this.$router.replace({ name: 'pub-details', params: { id: this.pub.key } })
    },
    login () {
      return modalController
        .create({
          component: Modal,
          // cssClass: 'my-custom-class',
          componentProps: {
            parent: this,
            store: this.$store,
            router: this.$router,
            data: {
              // content: 'New Content'
            },
            propsData: {
              title: 'Sign In'
            }
          }
        })
        .then(m => m.present())
    }
  },
  created () {
    if (!this.userDetails || this.userDetails.email === '') {
      this.$store.dispatch('userModule/fetchUserDetails')
    }
    if (!this.pub.key || this.pub.key !== this.$route.query.pubId) {
      console.log('this.$route.query:', this.$route.query)
      console.log('no pub state - fetching from DB')
      this.$store.dispatch('pubModule/fetchPubByPubId', this.$route.query.pubId)
    }
    if (!this.pubTable || this.pubTable.key !== this.$route.params.id) {
      console.log('this.$route.params:', this.$route.params)
      console.log('no pubTable state - fetching from DB')
      this.$store.dispatch('pubModule/fetchPubTable', this.$route.params.id)
    }
  }

}
</script>

<style lang="scss" scoped>
.info-text{
  font-size:12px;
  padding-left:16px
}

ion-content{
  --background: #f4f2f7;
}

form{
  background: white;
  padding: 24px;
}

</style>
