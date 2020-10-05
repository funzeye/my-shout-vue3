import firebase from 'firebase/app'

const getDefaultState = () => {
  return {
    pubs: [],
    pubTables: [],
    pubTable: {
      key: '',
      seats: 4,
      tableNum: null,
      pubFloorArea: '',
      floor: null
    },
    pub: {
      key: '',
      hidePub: false,
      ownerId: '',
      pubName: '',
      addressLine1: '',
      addressLine2: '',
      townCity: '',
      county: '',
      eircode: '',
      numOfTables: '',
      photoUrl: '',
      floors: { lower: 0, upper: 0 },
      timeToArrivalLimitOn: true,
      timeToArrivalLimitInMinutes: 30
    },
    pubFloorAreas: []
  }
}

const state = getDefaultState()

const mutations = {
  resetPubModuleState (state) {
    Object.assign(state, getDefaultState())
  },
  storePubTable (state, user) {
    state.pubTable = user
  },
  storePubTables (state, pubTables) {
    state.pubTables = pubTables
  },
  updatePubPhotoUrl (state, downloadUrl) {
    state.pub.photoUrl = downloadUrl
  },
  updatePubTableInPubTables (state, { pubTable, key }) {
    console.log('updating pub table in pubTables array with key:', key)
    var foundIndex = state.pubTables.findIndex(x => x.key === key)
    console.log('foundIndex: ', foundIndex)
    console.log('updated pubTable details: ', pubTable)
    state.pubTables[foundIndex] = pubTable
    console.log('state.pubTables: ', state.pubTables)
  },
  updatePubInPubsCollection (state, pub) {
    console.log('updating pub in pubs array with key:', pub.key)
    var foundIndex = state.pubs.findIndex(x => x.key === pub.key)
    console.log('foundIndex: ', foundIndex)
    console.log('updated pubTable details: ', pub)
    state.pubs[foundIndex] = pub
    console.log('state.pubs: ', state.pubs)
  },
  storePubs (state, pubs) {
    state.pubs = pubs
  },
  storePubFloorAreas (state, pubFloorAreas) {
    state.pubFloorAreas = pubFloorAreas
  },
  addNewPubToPubsCollection (state, pub) {
    state.pubs.push(pub)
  },
  addNewPubFloorArea (state, pub) {
    state.pubFloorAreas.push(pub)
  },
  addNewPubTable (state, pubTable) {
    state.pubTables.push(pubTable)
  },
  updatePub (state, pub) {
    state.pub = pub
  },
  setSelectedPubTable (state, pubTable) {
    console.log('calling setSelectedPubTable mutation in index.js')
    state.pubTable = pubTable
  },
  resetPub (state) {
    state.pub = {
      key: '',
      ownerId: '',
      pubName: '',
      hidePub: false,
      addressLine1: '',
      addressLine2: '',
      townCity: '',
      county: '',
      eircode: '',
      numOfTables: '',
      floors: { lower: 0, upper: 0 },
      timeToArrivalLimitOn: true,
      timeToArrivalLimitInMinutes: 30
    }
  }
}

const actions = {
  fetchPubs ({ commit }) {
    console.log('fecthing pub data from the DB and updating List')
    firebase.database().ref('pubs')
      .on('value', function (snapshot) {
        const response = snapshot.val()
        const resultArray = []
        for (const key in response) {
          response[key].key = key
          resultArray.push(response[key])
        }
        commit('storePubs', resultArray)
      }, function (error) {
        console.log('Error: ', error.code)
      })
  },
  fetchPubTables ({ commit }, pubKey) {
    console.log('fecthing pub tables data from the DB and updating List')
    console.log('for pub with key:', pubKey)
    // globalAxios.get('pubTables.json' + '?&orderBy="pubId"&equalTo="' + pubKey + '"')
    firebase.database().ref('pubTables').orderByChild('pubId').equalTo(pubKey)
      .on('value', function (snapshot) {
        const response = snapshot.val()
        console.log('fetchPubTables snapshot:', response)
        const resultArray = []
        for (const key in response) {
          response[key].key = key
          resultArray.push(response[key])
        }
        commit('storePubTables', resultArray)
      }, error => {
        console.log(error)
      })
  },
  fetchPubByPubId ({ commit, dispatch }, pubId) {
    console.log('fecthing pub data from the DB')
    console.log('for pub with pub id:', pubId)
    // globalAxios.get('pubs.json' + '?&orderBy="$key"&equalTo="' + pubId + '"')
    firebase.database().ref('pubs').orderByKey().equalTo(pubId)
      .on('value', function (snapshot) {
        const data = snapshot.val()
        console.log('fetchPubByPubId snapshot val: ', snapshot.val())
        const resultArray = []
        for (const key in data) {
          console.log('fetchPubByPubId key: ', key)
          data[key].key = key
          console.log('fetchPubByPubId data[key]: ', data[key])
          resultArray.push(data[key])
        }
        if (resultArray.length > 0) {
          commit('updatePub', resultArray[0])
          dispatch('fetchPubTables', state.pub.key)
          dispatch('reservationModule/fetchReservationsForPub', state.pub.key, { root: true })
        }
      }, error => {
        console.log(error)
      })
  },
  fetchPubByOwnerId ({ commit, dispatch }, ownerId) {
    console.log('fecthing pub data from the DB')
    console.log('for pub with owner id:', ownerId)
    // globalAxios.get('pubs.json' + '?&orderBy="ownerId"&equalTo="' + ownerId + '"')
    firebase.database().ref('pubs').orderByChild('ownerId').equalTo(ownerId)
      .on('value', function (snapshot) {
        const data = snapshot.val()
        console.log('fetchPubByPubId snapshot val: ', snapshot.val())
        const resultArray = []
        for (const key in data) {
          console.log('fetchPubByPubId key: ', key)
          data[key].key = key
          console.log('fetchPubByPubId data[key]: ', data[key])
          resultArray.push(data[key])
        }
        if (resultArray.length > 0) {
          commit('updatePub', resultArray[0])
          dispatch('fetchPubTables', state.pub.key)
          dispatch('reservationModule/fetchReservationsForPub', state.pub.key, { root: true })
        }
      }, error => {
        console.log(error)
      })
  },
  fetchPubFloorAreas ({ commit }) {
    console.log('fecthing pub data from the DB and updating List')
    // globalAxios.get('pubFloorAreas.json' + '?auth=' + rootState.userModule.idToken)
    firebase.database().ref('pubFloorAreas')
      .on('value', function (snapshot) {
        console.log('snapshot', snapshot)
        console.log('snapshot.val()', snapshot.val())
        console.log('snapshot.key', snapshot.key)
        const resultArray = []
        for (const key in snapshot.val()) {
          const itemForArray = snapshot.val()[key]
          itemForArray.key = key
          resultArray.push(itemForArray)
        }
        commit('storePubFloorAreas', resultArray)
      }, error => {
        console.log(error)
      })
  },
  storePub ({ commit, dispatch }, pubData) {
    console.log('adding new pub to DB: ', pubData)
    const pub = {
      ownerId: pubData.ownerId,
      pubName: pubData.pubName,
      addressLine1: pubData.addressLine1,
      addressLine2: pubData.addressLine2,
      townCity: pubData.townCity,
      county: pubData.county,
      eircode: pubData.eircode,
      numOfTables: pubData.numOfTables,
      floors: { lower: pubData.floors.lower, upper: pubData.floors.upper },
      timeToArrivalLimitOn: pubData.timeToArrivalLimitOn,
      timeToArrivalLimitInMinutes: pubData.timeToArrivalLimitInMinutes
    }
    // globalAxios.post('pubs.json' + '?auth=' + rootState.userModule.idToken, pub)
    firebase.database().ref('pubs').push(pub)
      .then(snapshot => {
        console.log('adding new pub snapshot:', snapshot)
        console.log('adding new pub snapshot key:', snapshot.key)

        pub.key = snapshot.key
        commit('updatePub', pub)
        commit('addNewPubToPubsCollection', pub)
        console.log('pub successfully saved to DB: ', snapshot)
        dispatch('storePubTables', pub.key)
        // commit('resetPub') // no longer need to reset as we immediately go to a new page
      })
      .catch(error => console.log(error))
  },
  updatePubDetailsInDb ({ commit }, pubData) {
    console.log('updating pub in DB: ', pubData)
    const key = pubData.key
    pubData.key = null

    // globalAxios.patch('pubs/' + pubData.key + '/.json' + '?auth=' + rootState.userModule.idToken, pubData)
    firebase.database().ref('pubs/' + key).update(pubData)
      .then(() => {
        commit('updatePubInPubsCollection', pubData)
        console.log('pub successfully updated in DB')
        // dispatch('storePubTables', res.data.name)
        // commit('resetPub') // no longer need to reset as we immediately go to a new page
      })
      .catch(error => console.log(error))
  },
  storePubFloorArea (context, pubFloorAreaData) {
    console.log('adding new pub floor area to DB: ', pubFloorAreaData)
    // globalAxios.post('pubFloorAreas.json' + '?auth=' + rootState.userModule.idToken, pubFloorAreaData)
    firebase.database().ref('pubFloorAreas').push(pubFloorAreaData)
      .then(snapshot => {
        console.log(snapshot)
        // commit('addNewPubFloorArea', pubFloorAreaData)
      })
      .catch(error => console.log(error))
  },
  updatePubFloorArea (context, pubFloorAreaData) {
    const pubFloorArea = {
      name: pubFloorAreaData.name
    }
    firebase.database().ref('pubFloorAreas/' + pubFloorAreaData.key).update(pubFloorArea)
      .then(() => {
        console.log('pub floor area successfully updated in DB')
        // commit('updatePubFloorAreaInPubFloorAreas', {
        //  pubFloorArea: pubFloorAreaData
        // })
      })
      .catch(error => console.log(error))
  },
  updatePubTable ({ commit }, pubTable) {
    const table = {
      pubId: pubTable.pubId,
      tableNum: pubTable.tableNum,
      seats: pubTable.seats,
      pubFloorArea: pubTable.pubFloorArea,
      floor: pubTable.floor
    }
    console.log('updating existing pub table in DB: ', table)
    // globalAxios.patch('pubTables/' + pubTable.key + '.json' + '?auth=' + rootState.userModule.idToken, table)
    firebase.database().ref('pubTables/' + pubTable.key).update(table)
      .then(() => {
        console.log('pub table successfully saved to DB')
        console.log('about to update pub table in pub tables from action with key:', pubTable.key)
        commit('updatePubTableInPubTables', {
          pubTable: pubTable,
          key: pubTable.key
        })
      })
      .catch(error => console.log(error))
  },
  storePubTables ({ commit }, pubId) {
    console.log('adding new tables to DB')
    console.log('number of tables to add:', state.pub.numOfTables)

    let defaultFloor = 0
    if (state.pub.floors.lower > 0) {
      defaultFloor = state.pub.floors.lower
    } else if (state.pub.floors.upper < 0) {
      defaultFloor = state.pub.floors.upper
    }

    for (var index = 1; index <= state.pub.numOfTables; index++) {
      const table = {
        pubId: pubId,
        tableNum: index,
        seats: 4,
        floor: defaultFloor
      }
      console.log('adding new table:', table)
      // globalAxios.post('pubTables.json' + '?auth=' + rootState.userModule.idToken, table)
      firebase.database().ref('pubTables').push(table)
        .then(snapshot => {
          console.log(snapshot)
          table.key = snapshot.key
          commit('addNewPubTable', table)
          console.log('table successfully saved to DB.')
        })
        .catch(error => console.log(error))
    }
  },
  fetchPubTable ({ commit }, pubTableKey) {
    console.log('fecthing pub table data from the DB')
    // globalAxios.get('pubTables.json' + '?auth=' + rootState.userModule.idToken + '&orderBy="$key"&equalTo="' + pubTableKey + '"')
    firebase.database().ref('pubTables').orderByKey().equalTo(pubTableKey)
      .on('value', function (snapshot) {
        const data = snapshot.val()
        // .then(response => {
        console.log('Successful response upon getting single pub table data from the DB')
        const pubTables = []
        for (const key in data) {
          console.log('looping through keys found in data for fecthPubTable call')
          const pubTable = data[key]
          console.log('pubTable:', pubTable)
          pubTable.key = key
          pubTables.push(pubTable)
        }
        commit('storePubTable', pubTables[0])
      }, error => {
        console.log('Error response while getting single pub table data from the DB')
        console.log(error)
      })
  },
  updatePubProfilePictureUrl ({ commit }, payload) {
    firebase.database().ref('pubs/' + payload.pubKey).update({ photoUrl: payload.downloadUrl })
      .then(() => {
        commit('updatePubPhotoUrl', payload.downloadUrl)
      })
      .catch(error => {
        console.log(error.message)
      })
  },
  deletePubFloorArea (context, areaKey) {
    firebase.database().ref('pubFloorAreas/' + areaKey).remove()
      .then(() => {
        // commit('updatePubPhotoUrl', payload.downloadUrl)
      })
      .catch(error => {
        console.log(error.message)
      })
  },
  updatePub ({ commit }, payload) {
    commit('updatePub', payload)
  },
  setPubs ({ commit }, payload) {
    commit('storePubs', payload)
  },
  setSelectedPubTable ({ commit }, payload) {
    console.log('calling setSelectedPubTable action in index.js')
    commit('setSelectedPubTable', payload)
  }
}

const getters = {
  pubs (state) {
    console.log('calling pubs getter')
    console.log(state)
    return state.pubs
  },
  pubTables (state) {
    console.log('calling pubTables getter')
    console.log(state)
    return state.pubTables
  },
  publicansPub (state, getters, rootState, rootGetters) {
    console.log('executing publicansPub getter')

    console.log('rootGetters[userModule/userId] found?:', rootGetters['userModule/userId'] !== '')
    console.log('state.pubs:', state.pubs)
    var publicansPub = state.pubs.find(p => p.ownerId === rootGetters['userModule/userId'])
    console.log('publicansPub found in getter:', publicansPub)

    return publicansPub
  },
  pubTable (state) {
    console.log('calling pubTable getter in index.js')
    console.log(state)
    return state.pubTable
  },
  pub (state) {
    console.log('calling pub getter')
    console.log(state)
    return state.pub
  },
  pubFloorAreas (state) {
    console.log('calling pub floor areas getter')
    console.log(state)
    return state.pubFloorAreas
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
