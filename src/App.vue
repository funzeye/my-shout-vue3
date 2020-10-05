<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  }
});
</script>

<style lang="scss">

ion-searchbar {
  --background: #fff !important;
}

ion-card {
  --ion-item-background: #fff;
}
ion-card ion-card-header {
  --background: #406c6c;
}

ion-card ion-card-title {
  --color: #fff;
}

ion-card-header ion-text {
  --background: #406c6c;
  color: #eee;
}

ion-card ion-card-subtitle {
  --color: #88b4b3
}

ion-card-header+.card-content-md {
    padding-top: 16px;
}

ion-card-content ion-label{
  color: #666 !important
}

:root {
    form ion-item:not(:first-child){
      padding-top: 16px;
    }
    form ion-label{
      text-transform: uppercase;
      padding-bottom:6px
    }
    ion-input, ion-select, ion-range {
        --background: #f4f2f7;
        border-radius: 5px;
        margin-top:6px;
        --padding-start: 12px !important;
    }

    ion-input:disabled, ion-input.disabled {
      --background: white;
    }

    ion-range, .arrival-limit-container{
      border: 2px solid #f4f2f7;
      border-radius: 5px;
      padding-top: 6px;
    }

    ion-note {
      padding-left: 0;
      padding-top: 6px !important;
      padding-bottom:6px;
    }

    ion-select {
        background: #f4f2f7;
        --color: black !important;
        --padding-start: 12px;
        --placeholder-opacity: 0.5 !important;
    }
}

</style>
