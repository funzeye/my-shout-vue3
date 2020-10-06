import router from '../../router'
import firebase from 'firebase/app'

const getDefaultState = () => {
  return {
    user: null,
    isPublican: false,
    isPunter: false,
    userDetails: {
      email: '',
      firstName: '',
      surname: '',
      userRoles: [],
      phone: ''
    },
    userRoles: []
  }
}
const state = getDefaultState()

const mutations = {
  resetUserModuleState (state) {
    Object.assign(state, getDefaultState())
  },
  setUser (state, userData) {
    state.user = userData
  },
  clearUser (state) {
    state.user = null
  },
  setUserType (state, userRoles) {
    console.log('setUserType userRoles', userRoles)
    state.isPublican = userRoles.isPublican
    state.isPunter = userRoles.isPunter
  },
  storeUserDetails (state, userData) {
    state.userDetails.email = userData.email
    state.userDetails.phone = userData.phone
    state.userDetails.firstName = userData.firstName
    state.userDetails.surname = userData.surname
    state.userDetails.userRoles = userData.userRoles
  },
  storeUserDetailsEmail (state, email) {
    state.userDetails.email = email
  },
  storeUserDetailsUserRole (state, userRole) {
    state.userDetails.userRoles = userRole
  },
  storeUserRoles (state, userRoles) {
    state.userRoles = userRoles
  },
  addNewUserRoleToCollection (state, userRole) {
    state.userRoles.push(userRole)
  }
}

const actions = {
  async checkAuth ({ commit, dispatch }) {
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged(async (_user) => {
        if (_user) {
          commit('setUser', _user)
          await dispatch('fetchUserDetails')
        } else {
          commit('setUser', null)
        }
        console.log('current user in checkAuth action:', _user)
        resolve(true)
      })
    })
  },
  signup ({ dispatch }, authData) {
    firebase.auth().createUserWithEmailAndPassword(authData.email, authData.password)
      .then(response => {
        console.log('sign in new user?', authData.signInNewUser)
        if (authData.signInNewUser) {
          console.log('response:', response)
          console.log('storing user details in DB')
          dispatch('storeUserDetails', {
            email: authData.email,
            firstName: authData.firstName,
            surname: authData.surname,
            phone: authData.phone,
            userRoles: { [authData.userRole]: true }
          }).then(() => {
            console.log('add user id to user roles in DB')
            dispatch('addUserToUserRolesMembers', {
              userRole: authData.userRole
            })
          })

          console.log('calling router for #/tabs/search-for-pub')
          router.replace({ name: 'search-for-pub' })
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  async signin (context, { authData, noRedirect }) {
    await firebase.auth().signInWithEmailAndPassword(authData.email, authData.password)
      .then(function (response) {
        console.log('response:', response)
        console.log('noRedirect:', noRedirect)
        if (!noRedirect) router.replace({ name: 'search-for-pub' })
      })
  },
  async changeEmail ({ state, dispatch }, newData) {
    const user = firebase.auth().currentUser

    const credential = firebase.auth.EmailAuthProvider.credential(
      state.user.email,
      newData.userProvidedPassword
    )

    await user.reauthenticateWithCredential(credential).then(function () {
      user.updateEmail(newData.newEmail).then(function () {
        // Update successful.
        console.log('email updated successfully')
        dispatch('storeUserDetailsEmail', { email: newData.newEmail })
      })
    })
  },
  sendPasswordEmailReset ({ dispatch }, emailToSendTo) {
    // axios.post(':sendOobCode?key=AIzaSyB8-xAjyYMTR0Jt1-H-ayS9FDINW4JdAhQ',
    //  { requestType: 'PASSWORD_RESET', email: emailToSendTo })
    firebase.auth().sendPasswordResetEmail(emailToSendTo)
      .then(res => {
        console.log('response:', res)
        dispatch('logout')
      })
      .catch(error => {
        console.log(error)
      })
  },
  logout ({ commit }) {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        router.replace({ name: 'home'})
        commit('resetUserModuleState')
        commit('reservationModule/resetReservationModuleState', null, { root: true })
        commit('pubModule/resetPubModuleState', null, { root: true })
        localStorage.removeItem('isPublican')
        localStorage.removeItem('isPunter')
      })
  },
  async fetchUserDetails ({ commit, state }) {
    console.log('state.user', state.user)
    if (!state.user) {
      console.log('No User - Exiting')
      return
    }
    // const user = firebase.auth().currentUser
    console.log('fecthing user details data from the DB')
    console.log('for user details with user id:', state.user.uid)
    return new Promise((resolve) => {
      firebase.database().ref('/usersDetails/' + state.user.uid)
        .on('value', function (snapshot) {
          console.log('fetchUserDetails response: ', snapshot)
          const data = snapshot.val()
          console.log('data:', data)
          if (data) {
            const foundUser = data
            console.log('foundUser.userRoles', foundUser.userRoles)
            commit('storeUserDetails', foundUser)
            commit('setUserType', {
              isPublican: foundUser.userRoles.publican !== undefined && foundUser.userRoles.publican !== false,
              isPunter: foundUser.userRoles.punter !== undefined && foundUser.userRoles.punter !== false
            })
            if (foundUser.userRoles.punter !== undefined && foundUser.userRoles.punter !== false) {
              localStorage.setItem('isPunter', true)
            } else {
              localStorage.setItem('isPunter', false)
            }

            if (foundUser.userRoles.publican !== undefined && foundUser.userRoles.publican !== false) {
              localStorage.setItem('isPublican', true)
            } else {
              localStorage.setItem('isPublican', false)
            }
            console.log('fetchUserDetails complete...')
            resolve(snapshot)
          }
        }, error => {
          console.log(error)
        })
    })
  },
  fetchUserRoles ({ commit }) {
    console.log('fecthing User Roles from the DB and updating List')
    // globalAxios.get('userRoles.json' + '?auth=' + state.idToken)
    firebase.database().ref('userRoles')
      .on('value', function (snapshot) {
        console.log('fetchUserDetails response: ', snapshot)
        const data = snapshot.val()
        const resultArray = []
        for (const key in data) {
          console.log('data:', data)
          console.log('data[key]:', data[key])
          console.log('key:', key)
          resultArray.push(data[key])
        }
        commit('storeUserRoles', resultArray)
      }, error => {
        console.log(error)
      })
  },
  storeUserDetails ({ commit }, userData) {
    var user = firebase.auth().currentUser
    if (!user) {
      console.log('No user Id - Exiting')
      return
    }
    firebase.database().ref('usersDetails/' + user.uid).set(userData)
      .then(() => {
        commit('storeUserDetails', {
          email: userData.email,
          firstName: userData.firstName,
          surname: userData.surname,
          phone: userData.phone,
          userRoles: userData.userRoles
        })
      })
      .catch(error => console.log(error))
  },
  storeUserDetailsEmail ({ commit, state }, userData) {
    if (!state.user) {
      console.log('No user - Exiting')
      return
    }
    // globalAxios.patch('usersDetails/' + state.userId + '.json' + '?auth=' + state.idToken, userData)
    firebase.database().ref('usersDetails/' + state.user.uid).update({ email: userData.email })
      .then(() => {
        commit('storeUserDetailsEmail', userData.email)
      })
      .catch(error => {
        console.log(error.message)
      })
  },
  addRoleToUsersDetails ({ commit }, userData) {
    var user = firebase.auth().currentUser
    if (!user) {
      console.log('No user Id - Exiting')
      return
    }
    console.log('adding role to userDetails', userData)
    const userRole = userData.userRole
    // globalAxios.patch('usersDetails/' + userData.userId + '/userRoles.json' + '?auth=' + state.idToken, { [userRole]: true })
    firebase.database().ref('usersDetails/' + user.uid + '/userRoles').set({ [userRole]: true })
      .then(() => {
        // console.log('addRoleToUsersDetails response:', res)
        commit('storeUserDetailsUserRole', [userRole])
      })
      .catch(error => console.log(error))
  },
  addUserToUserRolesMembers (context, userData) {
    var user = firebase.auth().currentUser
    if (!user) {
      console.log('No user - Exiting')
      return
    }
    var userId = user.uid
    console.log('addUserToUserRolesMembers data:', userData)
    const userRole = userData.userRole
    // globalAxios.patch('userRoles/' + userRole + '/members.json' + '?auth=' + state.idToken, { [userId]: true })
    firebase.database().ref('userRoles/' + userRole + '/members').update({ [userId]: true })
      .then(() => {
        console.log('addUserToUserRolesMembers response:', userData)
      })
      .catch(error => console.log(error))
  },
  storeUserRole ({ commit }, userRole) {
    console.log('adding new user role area to DB: ', userRole)
    firebase.database().ref('userRoles/' + userRole.roleId).set({ roleName: userRole.roleName })
      .then(() => {
        commit('addNewUserRoleToCollection', userRole)
        console.log('user role successfully saved to DB: ', userRole.roleName)
      })
      .catch(error => console.log(error))
  }
}

const getters = {
  userDetails (state) {
    console.log('calling user getter')
    return state.userDetails
  },
  userId (state) {
    console.log('calling user id getter')
    if (state.user) {
      return state.user.uid
    }
  },
  userPhotoUrl (state) {
    console.log('calling user photo url getter for user:', state.user)
    if (state.user) {
      return state.user.photoURL
    }
  },
  isAuthenticated (state) {
    return state.user !== null
  },
  isPublican (state) {
    console.log('calling isPublican getter')
    return state.isPublican
  },
  isPunter (state) {
    console.log('calling isPunter getter')
    return state.isPunter
  },
  userRoles (state) {
    console.log('calling user roles getter')
    console.log(state)
    return state.userRoles
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
