<template>
  <ion-page>
      <ion-header>
          <ion-toolbar>
              <ion-title>Bookings</ion-title>
          </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-grid>
          <ion-row v-if="activeReservation && activeReservation.pub">
            <ion-col size="12" offset-md="3" size-md="6">
              <ion-card>
                <ion-card-header>
                    <ion-card-title>Active Booking</ion-card-title>
                </ion-card-header>

                <ion-card-content>
                    <ion-item class="booking-item" lines="none">
                        <ion-label>
                            <h2>{{ activeReservation.pub.pubName }}</h2>
                            <h3>{{ activeReservation.table.seats }} seats &#64; table &#35; {{ activeReservation.table.tableNum }}</h3>
                            <h3>on Floor # {{ activeReservation.table.floor }}<span v-show="activeReservation.table.pubFloorArea !== undefined"> ({{ activeReservation.table.pubFloorArea }})</span></h3>
                            <p>on {{ new Date(activeReservation.reservedAtDate).toDateString() }}</p>
                        </ion-label>
                    </ion-item>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
          <ion-row v-if="isPublican && allReservationsForPubSorted && allReservationsForPubSorted.length > 0">
            <ion-col size="12" offset-md="3" size-md="6">
              <ion-card >
                <ion-card-header>
                    <ion-card-title>Bookings</ion-card-title>
                </ion-card-header>

                <ion-card-content>
                <ion-list v-for="ar in allReservationsForPubSorted" :key="ar['.key']">
                    <ion-item class="booking-item">
                        <ion-label>
                            <ion-label>
                            <div>
                              <h2>{{ ar.patronDetails.patronName }}</h2>
                              <h2>{{ ar.patronDetails.patronPhone }}</h2>
                            </div>
                            <h3>{{ ar.table.seats }} seats &#64; table &#35; {{ ar.table.tableNum }}</h3>
                            <h3>on Floor # {{ ar.table.floor }}<span v-if="ar.table.pubFloorArea !== undefined"> ({{ ar.table.pubFloorArea }})</span></h3>
                            <p>on {{ new Date(ar.reservedAtDate).toDateString() }}</p>
                        </ion-label>
                        </ion-label>
                    </ion-item>
                </ion-list>
                </ion-card-content>
            </ion-card>
            </ion-col>
          </ion-row>
          <ion-row v-if="previousReservations && previousReservations.length > 0">
            <ion-col  size="12" offset-md="3" size-md="6">
              <ion-card>
                  <ion-card-header>
                      <ion-card-title>Previous Bookings</ion-card-title>
                  </ion-card-header>

                  <ion-card-content>
                  <ion-list v-for="pr in previousReservations" :key="pr['.key']">
                      <ion-item class="booking-item">
                          <ion-label>
                              <ion-label>
                              <h2>{{ pr.pub.pubName }}</h2>
                              <h3>{{ pr.table.seats }} seats &#64; table &#35; {{ pr.table.tableNum }}</h3>
                              <h3>on Floor # {{ pr.table.floor }}<span v-show="pr.table.pubFloorArea !== undefined"> ({{ pr.table.pubFloorArea }})</span></h3>
                              <p>on {{ new Date(pr.reservedAtDate).toDateString() }}</p>
                          </ion-label>
                          </ion-label>
                      </ion-item>
                  </ion-list>
                  </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol,
          IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonItem, IonList } from '@ionic/vue';

import { mapGetters } from 'vuex'

export default {
  name: 'booked-tables',
  components: {
    IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonItem, IonList
  },
  computed: {

    ...mapGetters('userModule', [
      'userId',
      // 'user',
      'isPublican',
      'isPunter'
    ]),

    ...mapGetters('pubModule', [
      'publicansPub'
    ]),

    ...mapGetters('reservationModule', {
      activeReservation: 'activeReservationForPunter',
      previousReservations: 'previousReservationsForPunter',
      allReservationsForPub: 'allReservationsForPub'
    }),

    allReservationsForPubSorted () {
      var items = this.allReservationsForPub
      if (items && items.length > 1) {
        return items.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.reservedAtDate) - new Date(a.reservedAtDate)
        })
      }
      return items
    }
  },
  created () {
    console.log('bookedTables created method called')

    if (this.isPunter === true || this.isPunter === 'true') {
      console.log('fetching all reservations for patron...')
      this.$store.dispatch('reservationModule/fetchReservationsForPunter', this.userId)
    } else if (this.publican === true || this.isPublican === 'true') {
      console.log('fetching all reservations for pub...')
      this.$store.dispatch('pubModule/fetchPubByOwnerId', this.userId)
    }
  }
}
</script>

<style lang="scss" scoped>
.booking-item{
   margin-right: 16px;
   h2{
     font-weight:bold;
     font-size:20px;
     padding-bottom:10px;
   }
   h3{
     padding-bottom:3px;
   }
 }
</style>
