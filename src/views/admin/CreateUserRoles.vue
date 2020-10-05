<template>
   <ion-page>
    <the-header />
    <ion-content class="ion-padding">
      <h1>Create New Role</h1>

      <form @submit.prevent="submitNewRole">
      <ion-item>
        <ion-label position="stacked">Role DB Name <ion-text color="danger">*</ion-text></ion-label>
        <ion-input-vue name="userRole" v-model="userRole.roleId"></ion-input-vue>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Role Display Name <ion-text color="danger">*</ion-text></ion-label>
        <ion-input-vue name="userRole" v-model="userRole.roleName"></ion-input-vue>
      </ion-item>

      <div class="ion-padding">
        <ion-button expand="block" class="ion-no-margin" type="submit">Create Role</ion-button>
      </div>
      </form>

      <ion-list>
        <ion-item v-for="ur in userRoles" :key="ur['.key']">
          <ion-label>Role Name: {{ ur.roleName }}</ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue'

export default {
  name: 'create-user-roles',
  data () {
    return {
      userRole: {
        roleName: '',
        roleId: ''
      }
    }
  },
  components: {
    TheHeader
  },
  computed: {
    userRoles () {
      return this.$store.getters['userModule/userRoles']
    }
  },
  methods: {
    submitNewRole () {
      this.$store.dispatch('userModule/storeUserRole', this.userRole)
      this.userRole = { roleId: '', roleName: '' }
    }
  },
  created () {
    return this.$store.dispatch('userModule/fetchUserRoles')
  }
}
</script>
