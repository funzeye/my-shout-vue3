<template>
    <ion-page>
      <ion-header>
      <ion-toolbar>
        <ion-title>Add Pub Photo</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="backToEditPub">
            <ion-icon :src="i.arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="image-wrapper">
        <img v-if="imageElementSrc" :src="imageElementSrc.dataUrl"/>
      </div>
      <ion-toolbar>
        <ion-button slot="start" @click="takePicture">Take Picture</ion-button>
        <ion-button v-if="enableUpload" slot="end" @click="uploadImage()">UPLOAD</ion-button>
      </ion-toolbar>
    </ion-content>
  </ion-page>
</template>

<script>
import { Plugins, CameraSource, CameraResultType } from '@capacitor/core'
import * as allIcons from 'ionicons/icons'
import firebase from 'firebase/app'
import { toastController } from '@ionic/core'

const { Camera } = Plugins

const handleToast = (message, isError = false) => {
  toastController
    .create({
      message: message,
      position: 'top',
      color: isError ? 'danger' : 'success',
      duration: 2000
    })
    .then((t) => t.present())
}

export default {
  name: 'add-pub-photo',
  data () {
    return {
      imageElementSrc: null,
      enableUpload: false,
      i: allIcons
    }
  },
  methods: {
    async takePicture () {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Prompt
        })
        // image.webPath will contain a path that can be set as an image src.
        // You can access the original file using image.path, which can be
        // passed to the Filesystem API to read the raw data of the image,
        // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
        // Can be set to the src of an image now
        this.imageElementSrc = image
        this.enableUpload = true
        console.log('image:', image)
      } catch (err) {
        console.log('error taking photo:', err)
      }
    },
    async uploadImage () {
      if (!this.imageElementSrc) return
      try {
        console.log('starting upload...', this.imageElementSrc)
        // const user = firebase.auth().currentUser
        const name = 'profile.' + this.imageElementSrc.format
        //  const { dataUrl = '', path = name } = this.imageElementSrc?.value

        var storageRef = firebase.storage().ref(this.$route.params.id + '/pubPicture/' + name)
        const task = storageRef.putString(this.imageElementSrc.dataUrl, 'data_url', {
          contentType: 'image/png'
        })

        const vueInstance = this

        task.on('state_changed',
          function progess (snapshot) {
            console.log('image upload state changed snapshot:', snapshot)
            var percentageComplete = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('percentage complete:', percentageComplete)
          },
          function error (err) {
            console.log('error uploading', err)
            handleToast('Error Uploading!', true)
          },
          function complete () {
            console.log('upload complete')
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
              console.log('File available at', downloadURL)
              vueInstance.$store.dispatch('pubModule/updatePubProfilePictureUrl', { pubKey: vueInstance.$route.params.id, downloadUrl: downloadURL })
              // user.updateProfile({
              //  photoURL: downloadURL
              // })
            })
            handleToast('File Uploaded!!', false)
          })

        // const r = await uploadData(dataUrl, path)
        // console.log(r)
        this.enableUpload = false

        // return r
      } catch (error) {
        console.log(error)
        console.log(error.message)
      }
    },
    backToEditPub () {
      this.$router.replace({ name: 'edit-pub', params: { id: this.$route.params.id } })
    }
  }
}

</script>

<style scoped>
.image-wrapper {
  text-align: center;
  padding: 6px;
  background: whitesmoke;
}
img {
  object-fit: contain;
  max-height: 70vh !important;
}
</style>
