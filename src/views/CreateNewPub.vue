<template>
    <ion-page>
    <the-header />
    <ion-content class="ion-padding">
      <h1 class="ion-padding-start">Create Your Pub</h1>
      <pub-details-form mode="create"/>

    </ion-content>
  </ion-page>
</template>

<script>
import TheHeader from '../components/TheHeader.vue'
import PubDetailsForm from '../components/PubDetailsForm.vue'

export default {

  components: {
    TheHeader,
    PubDetailsForm
  }
}
</script>
