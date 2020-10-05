<template>
  <table-card-base :pubTable="pubTable" :pubFloors="pubFloors">
      <ion-button size="default" fill="outline" slot="table-card-action-button" @click.prevent="editTableDetails">Edit</ion-button>
  </table-card-base>
</template>

<script>
import { IonButton } from '@ionic/vue';
import TableCardBase from '../components/TableCardBase.vue'

export default {
  props: ['pubTable', 'pubFloors'],
  components: {
    IonButton,
    TableCardBase
  },
  methods: {
    editTableDetails () {
      console.log('setting selected pub table:', this.pubTable)
      this.$store.dispatch('pubModule/setSelectedPubTable', this.pubTable)
      this.$router.push({ name: 'edit-table-details', params: { id: this.pubTable.pubId } })
    }
  }
}
</script>
