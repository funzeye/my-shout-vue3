<template>
  <div>
      <ion-card class="table-card">
        <ion-card-header>
          <ion-card-subtitle>{{ pubTable.pubFloorArea }}</ion-card-subtitle>
          <ion-card-title>Table # {{ pubTable.tableNum }}</ion-card-title>
          <ion-grid>
            <ion-row class="ion-justify-content-start ion-padding-top">
                <div>
                  <ion-text v-if="pubTable.floor === 0">Ground Floor</ion-text>
                  <ion-text v-else>Floor #: {{ pubTable.floor }}</ion-text>
                </div>
            </ion-row>
            <ion-row>
                <div>
                  <ion-text>No. of Seats: {{ pubTable.seats }}</ion-text>
                </div>
            </ion-row>
          </ion-grid>
        </ion-card-header>
        <ion-card-content>
          <slot name="table-card-other-details"></slot>
          <slot name="table-card-action-button"></slot>
          <slot name="table-card-action-button-info"></slot>
        </ion-card-content>
      </ion-card>
  </div>
</template>

<script>
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonGrid, IonRow, IonText } from '@ionic/vue';

export default {
  props: ['pubTable', 'pubFloors'],
  components: {
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, 
    IonCardTitle, IonGrid, IonRow, IonText
  }
}
</script>

<style lang="css">
.info-text {
  font-size: smaller;
}

</style>
