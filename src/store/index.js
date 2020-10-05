import { createStore } from 'vuex';

import userModule from './modules/userModule'
import pubModule from './modules/pubModule'
import reservationModule from './modules/reservationModule'


const store = createStore({
  modules: {
    userModule,
    pubModule,
    reservationModule
  }
})

export default store

// export default new Vuex.Store({
//   modules: {
//     userModule,
//     pubModule,
//     reservationModule
//   }
// })
