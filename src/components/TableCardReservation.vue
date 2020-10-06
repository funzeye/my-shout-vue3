<template>
      <table-card-base :pubTable="pubTable" :pubFloors="pubFloors">
          <template v-slot:table-card-other-details>
            <div>
              <ion-item lines="none" v-if="!reservation.isCancelled && reservation.reservedBy && !reservation.reservedByOwner && ((reservation.reservedBy === loggedInUserId) || userIsOwner)">
                <ion-label position="stacked">Reserved By Patron:</ion-label>
                <ion-text v-if="reservation.patronDetails">{{ reservation.patronDetails.patronName }}</ion-text>
              </ion-item>
              <ion-item  lines="none" v-if="!reservation.isCancelled && reservation.reservedBy && !reservation.reservedByOwner && ((reservation.reservedBy === loggedInUserId) || userIsOwner)">
                <ion-label position="stacked">Phone Number:</ion-label>
                <ion-text v-if="reservation.patronDetails">{{ reservation.patronDetails.patronPhone }}</ion-text>
              </ion-item>
              <ion-item  lines="none" v-if="!reservation.isCancelled && reservation.reservedBy && reservation.reservedByOwner && userIsOwner">
                <ion-label position="stacked">Reserved By Publican For:</ion-label>
                <ion-text>{{ reservation.patronDetails.patronName }}</ion-text>
              </ion-item>
              <ion-item  lines="none" v-if="!reservation.isCancelled && reservation.reservedBy && reservation.reservedByOwner && userIsOwner">
                <ion-label position="stacked">Phone Number:</ion-label>
                <ion-text>{{ reservation.patronDetails.patronPhone }}</ion-text>
              </ion-item>
              <ion-item  lines="none" v-if="!reservation.isCancelled && reservation.reservedBy ">
                <ion-label position="stacked">Reserved At:</ion-label>
                <ion-text>{{ formatDate }}</ion-text>
              </ion-item>
              <ion-item  lines="none" v-if="!reservation.isCancelled && reservation.reservedBy ">
                <ion-label position="stacked">Reserved Until:</ion-label>
                <ion-text>No Limit</ion-text>
              </ion-item>
            </div>
          </template>
          <template v-slot:table-card-action-button>
            <div v-if="(reservation.isCancelled !== true && reservation.reservedBy === loggedInUserId) ||
            (!reservation.isCancelled && userIsOwner && reservation.reservedBy && reservation.timeToArrivalLimit && new Date(reservation.timeToArrivalLimit).getTime() < new Date().getTime()) ||
            (!reservation.isCancelled && userIsOwner && reservation.reservedBy && !reservation.timeToArrivalLimit)"  class="ion-padding-vertical">
              <ion-button color="danger" expand="block" size="default" fill="outline" @click.prevent="cancelTableReservation">Cancel</ion-button>
            </div>
            <div v-else-if="!reservation.isCancelled && reservation.reservedBy && reservation.reservedBy !== loggedInUserId" class="ion-padding-vertical">
              <ion-button expand="block" size="default" fill="outline" color="success" disabled>Reserved</ion-button>
            </div>
            <div v-else class="ion-padding-vertical">
              <ion-button slot="start" expand="block" size="default" fill="outline" @click.prevent="reserveTable">Reserve</ion-button>
            </div>
          </template>
          <template v-slot:table-card-action-button-info>
            <div class="info-text ion-text-center ion-text-sm-start" v-if="!reservation.isCancelled && !reservation.reservedBy  && !userIsOwner">
              Clicking 'Reserve' will reserve this table and cancel any other active reservations you currently have
            </div>
            <div class="info-text ion-text-center ion-text-sm-start" v-if="!reservation.isCancelled && !reservation.reservedBy && userIsOwner">
              Clicking 'Reserve' will reserve this table on behalf of your customer
            </div>
            <div class="info-text ion-text-center ion-text-sm-start" v-if="!reservation.isCancelled && reservation.reservedBy === loggedInUserId">
              Clicking 'Cancel' will cancel this reservation and allow it to be reserved by others
            </div>
            <div class="info-text ion-text-center ion-text-sm-start" v-if="!reservation.isCancelled && reservation.reservedBy && reservation.reservedBy !== loggedInUserId  && !userIsOwner">
              Table currently unavailable.
            </div>
            <div class="info-text ion-text-center ion-text-sm-start" v-if="!reservation.isCancelled && reservation.reservedBy && reservation.reservedBy !== loggedInUserId && userIsOwner">
              Table currently unavailable. If 'time to arrival' limit has passed you can 'Cancel' this booking to free up the table for others. Otherwise you must wait.
            </div>
          </template>
      </table-card-base>
</template>

<script>
import { alertController, IonItem, IonLabel, IonText, IonButton } from '@ionic/vue';

import TableCardBase from '../components/TableCardBase.vue'
import { mapGetters } from 'vuex'

export default {
  props: ['pubTable', 'pubFloors', 'loggedInUserId', 'userIsOwner'],
  data () {
    return {
      reservedButUnlocked () {
        // 1 check that logged in user is onwer of pub
        if (this.userIsOwner) {
          // 2 check that reservation exists for this table
          if (this.reservation.reservedBy !== null && this.reservation.reservedBy !== '') {
            // 3 check arrival limit has passed
            return this.reservation.timeToArrivalLimit > new Date()
          }
        }
        return false
      }
    }
  },
  components: {
    IonItem, IonLabel, IonText, IonButton,
    TableCardBase
  },
  computed: {
    formatDate () {
      if (this.reservation.reservedAtDate) {
        return new Date(this.reservation.reservedAtDate).toLocaleTimeString() + ' (' + new Date(this.reservation.reservedAtDate).toDateString() + ')'
      }
      return null
    },
    // isReserved () {
    //  const reservations = this.$store.getters.reservations
    //  return reservations.some(item => item.tableId === this.pubTable.key)
    // },
    ...mapGetters('reservationModule', [
      'allTodaysReservationsForPub'
    ]),
    reservation () {
      console.log('checking if reservation exists for current table #', this.pubTable.tableNum)
      const reservations = this.allTodaysReservationsForPub
      if (reservations && reservations.length > 0) {
        const reservationsWithThisTableKey = reservations.filter(item => item.table.tableId === this.pubTable.key)
        if (reservationsWithThisTableKey.length === 1) {
          return reservationsWithThisTableKey[0]
        } else if (reservationsWithThisTableKey.length > 1) {
          console.log('Error: 2 active reservations found for same table')
        }
      }
      return {
        reservedBy: '',
        patronDetails: {
          patronName: '',
          patronPhone: ''
        }
      }
    }
  },
  methods: {
    reserveTable () {
      this.$store.dispatch('userModule/fetchUserDetails')
      this.$store.dispatch('pubModule/setSelectedPubTable', this.pubTable)
      this.$router.push({ name: 'reserve-table', params: { id: this.pubTable.key }, query: { pubId: this.pubTable.pubId } })
    },
    cancelTableReservation () {
      console.log('cancelling reservation...')
      return alertController
        .create({
          cssClass: 'alert-cancel-res',
          header: 'Cancel Reservation',
          // subHeader: 'Subtitle',
          message: 'Are you sure you wish to cancel this reservation?',
          buttons: [
            {
              text: 'Back',
              role: 'cancel',
              // cssClass: 'secondary',
              handler: () => {
                console.log('Cancellation abandoned.')
              }
            },
            {
              text: 'Confirm',
              handler: () => {
                console.log('Cancellation Confirmed')
                this.$store.dispatch('reservationModule/cancelReservationForCurrentlySelectedTable', this.reservation.key)
              }
            }
          ]
        })
        .then(a => a.present())
    }
  }
}
</script>
