import { loadingController } from '@ionic/core'
import firebase from 'firebase/app'

const getDefaultState = () => {
  return {
    activeReservationForPunter: {
      key: '',
      tableId: '',
      reservedBy: '',
      reservedByOwner: false,
      reservedAtDate: '',
      patronDetails: null
    },
    previousReservationsForPunter: [],
    allReservationsForPub: []
  }
}
const state = getDefaultState()

const mutations = {
  resetReservationModuleState (state) {
    Object.assign(state, getDefaultState())

    // Object.assign(state, initialState())

    // acquire initial state
    // const s = initialState()
    // Object.keys(s).forEach(key => {
    //   state[key] = s[key]
    // })
  },
  removeReservationFromCollection (state, reservationKey) {
    console.log('removing reservation from collection:', reservationKey)
    console.log('reservation collection before:', state.allReservationsForPub)
    state.allReservationsForPub = state.allReservationsForPub.filter(item => item.key !== reservationKey)
    console.log('reservation collection after:', state.allReservationsForPub)
  },
  addReservationToCollection (state, reservation) {
    console.log('reservation saved to state collection:', reservation)
    state.allReservationsForPub.push(reservation)
  },
  updateReservationInCollection (state, reservation) {
    console.log('updating reservation in reservation array with key:', reservation.key)
    console.log('current list of reservations for pub:', state.allReservationsForPub)
    var foundIndex = state.allReservationsForPub.findIndex(x => x.key === reservation.key)
    console.log('foundIndex: ', foundIndex)
    console.log('updated reservation details: ', reservation)
    state.allReservationsForPub[foundIndex] = reservation
  },
  updatePatronDetailsForReservationInCollection (state, reservationPatronDetails) {
    console.log('updating reservation in reservation array with key:', reservationPatronDetails.key)
    console.log('current list of reservations for pub:', state.allReservationsForPub)
    var foundIndex = state.allReservationsForPub.findIndex(x => x.key === reservationPatronDetails.key)
    if (foundIndex >= 0) {
      console.log('foundIndex: ', foundIndex)
      state.allReservationsForPub[foundIndex].patronDetails = reservationPatronDetails.patronDetails
      // state.allReservationsForPub[foundIndex].patronDetails = reservationPatronDetails.patronDetails // not reactive
    }
  },
  setCurrentReservation (state, reservation) {
    state.reservation = reservation
  },
  setCurrentReservationForPunter (state, reservation) {
    state.activeReservationForPunter = reservation
  },
  setPreviousReservationsForPunter (state, reservations) {
    state.previousReservationsForPunter = reservations
  },
  setReservationsForPub (state, reservations) {
    console.log('parameter:', reservations)
    state.allReservationsForPub = reservations
    console.log('state.allReservationsForPub:', state.allReservationsForPub)
  },
  resetReservationsForPubCollection (state) {
    state.allReservationsForPub = []
  },
  resetCurrentReservationForPunter (state) {
    state.activeReservationForPunter = {
      key: '',
      tableId: '',
      reservedBy: '',
      reservedByOwner: false,
      reservedAtDate: '',
      patronDetails: null
    }
  }
}

const actions = {

  fetchReservationsForPub ({ commit, rootState }, pubKey) {
    console.log('fecthing pub table reservation data from the DB and updating List')
    console.log('for pub with key:', pubKey)
    commit('resetReservationsForPubCollection')
    // globalAxios.get('reservations.json' + '?orderBy="pub/pubId"&equalTo="' + pubKey + '"')
    const reservationsRef = firebase.database().ref('reservations').orderByChild('pub/pubId').equalTo(pubKey)

    reservationsRef.on('child_changed', function (snapshot) {
      console.log('reservation changed with key:', snapshot.key)
      const reservation = snapshot.val()
      reservation.key = snapshot.key

      commit('updateReservationInCollection', reservation)
      commit('removeReservationFromCollection', reservation.key)
    })

    reservationsRef.on('child_added', function (snapshot) {
      const data = snapshot.val()
      data.key = snapshot.key
      // .then(response => {
      console.log('fetchReservationsForPub snapshot val:', data)
      // for (const key in data) {
      if (!data.isCancelled) {
        commit('addReservationToCollection', data)

        if (!rootState.userModule.user) {
          console.log('No User State - Exiting')
        } else if (data.reservedByOwner && rootState.pubModule.pub.ownerId !== rootState.userModule.user.uid) {
          console.log('reserved by owner but you are not the owner')
          console.log('Cannot add user details as logged in user does not have permission to view this users details')
        } else if (data.reservedByOwner === false && data.reservedBy !== rootState.userModule.user.uid && rootState.pubModule.pub.ownerId !== rootState.userModule.user.uid) {
          console.log('it was not reserved by the owner and you also didnt reserve it and you are also not the onwer')
          console.log('Cannot add user details as logged in user does not have permission to view this users details')
        } else {
          const resDetails = firebase.database().ref('reservationsPatronDetails/' + data.key)

          resDetails.on('value', function (snapshot2) {
            if (snapshot2.val()) {
              const userDetailsObject = { key: snapshot2.key, patronDetails: { patronName: snapshot2.val().patronName, patronPhone: snapshot2.val().patronPhone } }
              commit('updatePatronDetailsForReservationInCollection', userDetailsObject)
            } else {
              console.log('snapshot2 is null')
            }
          })
        }
      } else if (data.isCancelled) {
        console.log('reservation not added as it is a cancelled reservation')
      } else {
        console.log('reservation not added for unknown reason')
      }
      // }
    })

    // no need to track changes - only change is cancellation and that removal from collection mutation is already
    // triggered by the cancalReservation action below
    // reservationsRef.on('child_changed', function(snapshot) {
    //  setCommentValues(postElement, data.key, data.val().text, data.val().author);
    // });
  },
  fetchReservationsForPunter ({ commit }, userId) {
    console.log('executing fetchReservationsForPunter')

    console.log('localStorage.getItem("isPunter")', localStorage.getItem('isPunter'))
    if (localStorage.getItem('isPunter') === null || localStorage.getItem('isPunter') === 'false') {
      console.log('current user is not a punter - Exiting')
      return
    } else {
      console.log('isPunter:', localStorage.getItem('isPunter'))
    }
    console.log('fecthing reservations from the DB for punter')
    console.log('for user id:', userId)
    // globalAxios.get('reservations.json' + '?auth=' + rootState.userModule.idToken +
    // '&orderBy="reservedBy"&equalTo="' + userId + '"')
    firebase.database().ref('reservations').orderByChild('reservedBy').equalTo(userId)
      .on('value', function (snapshot) {
        const data = snapshot.val()
        console.log('fetchReservationsForPunter response: ', data)
        const resultArray = []
        const previousReservationsForPunterArray = []
        const todaysDate = new Date()

        for (const key in data) {
          console.log('reserved at date:', data[key].reservedAtDate)
          const reservedAtDateStringAsDate = new Date(data[key].reservedAtDate)
          const reservationIsToday = todaysDate.getDate() === reservedAtDateStringAsDate.getDate() &&
          todaysDate.getMonth() === reservedAtDateStringAsDate.getMonth() &&
          todaysDate.getFullYear() === reservedAtDateStringAsDate.getFullYear()
          if (!data[key].isCancelled && reservationIsToday) {
            console.log('adding active reservation for punter - fetchReservationsForPunter key: ', key)
            data[key].key = key
            console.log('adding active reservation for punter - fetchReservationsForPunter data[key]: ', data[key])
            resultArray.push(data[key])
          } else if (!data[key].isCancelled) {
            console.log('adding previous reservation for punter - fetchReservationsForPunter key: ', key)
            data[key].key = key
            console.log('adding previous reservation for punter - fetchReservationsForPunter data[key]: ', data[key])
            previousReservationsForPunterArray.push(data[key])
          }
        }
        if (resultArray.length > 0) {
          commit('setCurrentReservationForPunter', resultArray[0])
        } else {
          commit('resetCurrentReservationForPunter')
        }
        if (previousReservationsForPunterArray.length > 0) {
          commit('setPreviousReservationsForPunter', previousReservationsForPunterArray)
        }
      }, error => {
        console.log(error)
      })
  },
  cancelOtherReservationForPunterAndReserveNew ({ dispatch }, { userId, tableToIgnoreId, patronDetails }) {
    console.log('cancelling reservations using cancelOtherReservationForPunterAndReserveNew for user: ', userId)
    console.log(loadingController)
    return loadingController
      .create({
        message: 'Reserving...'
      })
      .then(loading => {
        loading.present()
        // globalAxios.get('reservations.json' + '?auth=' + rootState.userModule.idToken +
        //   '&orderBy="reservedBy"&equalTo="' + userId + '"')
        firebase.database().ref('reservations').orderByChild('reservedBy').equalTo(userId)
          .once('value', function (snapshot) {
            const data = snapshot.val()
            console.log('fetchReservationForPunter response: ', data)
            const resultArray = []
            const todaysDate = new Date()
            for (const key in data) {
              const reservedAtDateStringAsDate = new Date(data[key].reservedAtDate)
              const reservationIsToday = todaysDate.getDate() === reservedAtDateStringAsDate.getDate() &&
              todaysDate.getMonth() === reservedAtDateStringAsDate.getMonth() &&
              todaysDate.getFullYear() === reservedAtDateStringAsDate.getFullYear()
              if (!data[key].isCancelled === true && reservationIsToday && data[key].tableId !== tableToIgnoreId) {
                console.log('fetchReservationForPunter key: ', key)
                data[key].key = key
                console.log('fetchReservationForPunter data[key]: ', data[key])
                resultArray.push(data[key])
              } else {
                console.log('not cancelling reservation - data[key]:', data[key])
                console.log('not cancelling reservation - tableToIgnoreId:', tableToIgnoreId)
              }
            }

            console.log('resFromArray: ', resultArray)
            resultArray.forEach((res) => {
              console.log('res: ', res)
              console.log('cancelling reservation in DB for table: ', res.tableId)
              dispatch('cancelReservation', res)
            })
            dispatch('createReservation', patronDetails)
          })
        setTimeout(function () {
          loading.dismiss()
        }, 1500)
      })
  },
  cancelReservationForCurrentlySelectedTable ({ commit }, reservationKey) {
    console.log('cancelling reservation in DB with res key id: ', reservationKey)

    const resFromArray = state.allReservationsForPub.filter(res => res.key === reservationKey)[0]
    console.log('resFromArray:', resFromArray)
    const reservation = {
      table: {
        seats: resFromArray.table.seats,
        tableId: resFromArray.table.tableId,
        tableNum: resFromArray.table.tableNum,
        floor: resFromArray.table.floor,
        pubFloorArea: resFromArray.table.pubFloorArea === undefined ? null : resFromArray.table.pubFloorArea
      },
      isCancelled: true,
      cancelledAtDate: new Date(),
      key: null,
      pub: {
        pubId: resFromArray.pub.pubId,
        pubName: resFromArray.pub.pubName
      },
      reservedAtDate: resFromArray.reservedAtDate,
      reservedBy: resFromArray.reservedBy,
      reservedByOwner: resFromArray.reservedByOwner,
      patronDetails: null
    }

    // update record but don't delete it
    // globalAxios.patch('reservations/' + reservationKey + '.json' + '?auth=' + rootState.userModule.idToken, reservation)
    //  .then(res => {
    firebase.database().ref('reservations/' + reservationKey).update(reservation)
      .then(() => {
        console.log('reservation successfully cancelled in DB.')
        console.log('about to reset reservation...')
        commit('resetCurrentReservationForPunter')
      })
      .catch(error => console.log(error))
  },
  cancelReservation (context, reservationData) {
    console.log('cancelling reservation in DB for table: ', reservationData)

    const reservation = {
      table: {
        seats: reservationData.table.seats,
        tableId: reservationData.table.tableId,
        tableNum: reservationData.table.tableNum,
        floor: reservationData.table.floor,
        pubFloorArea: reservationData.table.pubFloorArea === undefined ? null : reservationData.table.pubFloorArea
      },
      isCancelled: true,
      cancelledAtDate: new Date(),
      key: null,
      pub: {
        pubId: reservationData.pub.pubId,
        pubName: reservationData.pub.pubName
      },
      reservedAtDate: reservationData.reservedAtDate,
      reservedBy: reservationData.reservedBy,
      reservedByOwner: reservationData.reservedByOwner,
      patronDetails: null
    }

    const resKey = reservationData.key

    // update record but don't delete it
    // globalAxios.patch('reservations/' + resKey + '.json' + '?auth=' + rootState.userModule.idToken, reservation)
    //  .then(res => {
    firebase.database().ref('reservations/' + resKey).update(reservation)
      .then(() => {
        console.log('reservation successfully cancelled in DB.')
        console.log('about to reset reservation...')
        // commit('removeReservationFromCollection', resKey)
      })
      .catch(error => console.log(error))
  },
  createReservation ({ commit, rootState }, patronDetails) {
    let arrivalLimitTime = null
    if (rootState.pubModule.pub.timeToArrivalLimitOn) {
      console.log('setting time to arrival limit on')
      arrivalLimitTime = new Date()
      arrivalLimitTime.setMinutes(arrivalLimitTime.getMinutes() + rootState.pubModule.pub.timeToArrivalLimitInMinutes)
    }
    const reservation = {
      table: {
        tableId: rootState.pubModule.pubTable.key,
        tableNum: rootState.pubModule.pubTable.tableNum,
        seats: rootState.pubModule.pubTable.seats,
        floor: rootState.pubModule.pubTable.floor,
        pubFloorArea: rootState.pubModule.pubTable.pubFloorArea === undefined ? null : rootState.pubModule.pubTable.pubFloorArea
      },
      pub: {
        pubId: rootState.pubModule.pubTable.pubId,
        pubName: rootState.pubModule.pub.pubName
      },
      reservedBy: rootState.userModule.user.uid,
      reservedByOwner: rootState.pubModule.pub.ownerId === rootState.userModule.user.uid,
      reservedAtDate: Date(),
      timeToArrivalLimit: arrivalLimitTime !== null ? arrivalLimitTime.toString() : null
    }

    const reservationsPatronDetails = {
      patronName: patronDetails.patronName,
      patronPhone: patronDetails.patronPhone
    }

    try {
      console.log('adding new reservation to DB: ', reservation)
      // globalAxios.post('reservations.json' + '?auth=' + rootState.userModule.idToken, reservation)
      //  .then(res => {
      firebase.database().ref('reservations').push(reservation)
        .then(snapshot => {
          console.log('new reservation snapshot data:', snapshot)
          reservation.key = snapshot.key
          console.log('res key:', reservation.key)
          // commit('addReservationToCollection', reservation)
        })
        .then(() => {
          // globalAxios.put('reservationsPatronDetails/' + reservation.key + '.json' + '?auth='
          // + rootState.userModule.idToken, reservationsPatronDetails)
          firebase.database().ref('reservationsPatronDetails/' + reservation.key).update(reservationsPatronDetails)
            .then(() => {
            // .then(res => {
              // update reservation with guest user details for reservation
              reservation.patronDetails = { patronName: reservationsPatronDetails.patronName, patronPhone: reservationsPatronDetails.patronPhone }
              commit('updateReservationInCollection', reservation)
            })
        })
        .catch(error => console.log(error))
    } catch (ex) {
      console.log('error:', ex)
      alert('Could not reserve Table - Refresh page and try again.')
    }
  }
}

const getters = {
  activeReservationForPunter (state) {
    console.log('calling activeReservationForPunter getter')
    return state.activeReservationForPunter
  },
  previousReservationsForPunter (state) {
    console.log('calling previousReservationsForPunter getter')
    return state.previousReservationsForPunter
  },
  allReservationsForPub (state) {
    console.log('calling allReservationsForPub getter')
    return state.allReservationsForPub
  },
  allTodaysReservationsForPub (state) {
    console.log('calling allTodaysReservationsForPub getter')
    const todaysDate = new Date()
    return state.allReservationsForPub.filter(p => {
      const reservedAtDateStringAsDate = new Date(p.reservedAtDate)
      const reservationIsToday = todaysDate.getDate() === reservedAtDateStringAsDate.getDate() &&
      todaysDate.getMonth() === reservedAtDateStringAsDate.getMonth() &&
      todaysDate.getFullYear() === reservedAtDateStringAsDate.getFullYear()
      return reservationIsToday
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
