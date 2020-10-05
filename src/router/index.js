import { createRouter, createWebHistory } from '@ionic/vue-router';
// import { RouteRecordRaw } from 'vue-router';
import CreateNewPub from '../views/CreateNewPub.vue'
import Privacy from '../views/Privacy.vue'
import Home from '../views/Home.vue'
import CreateUserRoles from '../views/admin/CreateUserRoles.vue'
import CreateNewPubFloorArea from '../views/admin/CreateNewPubFloorArea.vue'
import EditPubFloorArea from '../views/admin/EditPubFloorArea.vue'
import TabRoot from '../components/TabRoot.vue'
import SignUpPage from '../components/auth/SignUp.vue'
import ForgotPassword from '../components/auth/ForgotPassword.vue'
import SignInPage from '../components/auth/SignIn.vue'

import store from '../store'


const checkIfPublican = function (next) {
  const roles = store.state.userModule.userDetails.userRoles
  if (!roles || !roles.publican) {
    console.log('not publican - re-directing to home page')
    next('/')
  } else {
    next()
  }
}

const checkIfAdmin = function (next) {
  const roles = store.state.userModule.userDetails.userRoles
  if (!roles || !roles.admin) {
    console.log('not admin - re-directing to home page')
    next('/')
  } else {
    next()
  }
}

const routes = [
  { 
    path: '/', 
    name: 'home', 
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    name: 'home',
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/tabs/',
    component: TabRoot,
    children: [
      {
        path: '',
        redirect: 'search-for-pub'
      },
      {
        path: 'search-for-pub',
        component: () => import('@/views/SearchForPub.vue'),
        name: 'search-for-pub',
        meta: {
          requiresAuth: false
        },
        children: [
          {
            path: ':id/pub-details',
            component:  () => import('@/views/PubDetails.vue'),
            name: 'pub-details',
            meta: {
              requiresAuth: false
            }
          },
          {
            path: ':id/reserve-table',
            component: () => import('@/views/ReserveTable.vue'),
            name: 'reserve-table',
            meta: {
              requiresAuth: false
            }
          },
          {
            path: ':id/edit-pub',
            component: () => import('@/views/EditPub.vue'),
            name: 'edit-pub',
            beforeEnter (to, from, next) {
              console.log('navigating to edit-pub page.')
              const pub = store.state.pubModule.pub
              if (!pub.pubName) {
                console.log('pub name not found - re-directing to home page')
                next('/')
              } else {
                console.log('pub name found - continuing to pub tables page')
                next()
              }
            }
          },
          {
            path: ':id?/edit-pub-tables',
            component: () => import('@/views/EditPubTables.vue'),
            name: 'edit-pub-tables',
            beforeEnter (to, from, next) {
              console.log('navigating to edit-pub-tables page.')
              const pub = store.state.pubModule.pub
              if (!pub.pubName) {
                console.log('pub name not found - re-directing to home page')
                next('/')
              } else {
                console.log('pub name found - continuing to pub tables page')
                next()
              }
            }
          },
          {
            path: ':id/edit-pub-details',
            component: () => import('@/views/EditPubDetails.vue'),
            name: 'edit-pub-details',
            beforeEnter (to, from, next) {
              console.log('navigating to edit-pub-details page.')
              const pub = store.state.pubModule.pub
              if (!pub.pubName) {
                console.log('pub name not found - re-directing to home page')
                next('/')
              } else {
                console.log('pub name found - continuing to pub tables page')
                next()
              }
            }
          },
          {
            path: ':id/add-pub-photo',
            component: () => import('@/views/AddPubPhoto.vue'),
            name: 'add-pub-photo',
            beforeEnter (to, from, next) {
              console.log('navigating to add-pub-photo page.')
              const pub = store.state.pubModule.pub
              if (!pub.pubName) {
                console.log('pub name not found - re-directing to home page')
                next('/')
              } else {
                console.log('pub name found - continuing to pub tables page')
                next()
              }
            }
          },
          {
            path: ':id/edit-table-details',
            component: () => import('@/views/EditTableDetails.vue'),
            name: 'edit-table-details',
            beforeEnter (to, from, next) {
              console.log('navigating to edit-table-details page.')
              const pub = store.state.pubModule.pub
              if (!pub.pubName) {
                console.log('pub name not found - re-directing to home page')
                next('/')
              } else {
                console.log('pub name found - continuing to edit table page')
                next()
              }
            }
          }
        ]  
      },
      // {
      //   path: ':id/pub-details',
      //   component:  () => import('@/views/PubDetails.vue'),
      //   name: 'pub-details',
      //   meta: {
      //     requiresAuth: false
      //   }
      // },
      {
        path: 'profile',
        component: () => import('@/views/Profile.vue'),    
        name: 'profile',
        children: [
          {
            path: ':userId/change-email',
            component: () => import('@/views/ChangeEmail.vue'),
            name: 'change-email'
          },
          {
            path: ':userId/edit-user-details',
            component: () => import('@/views/EditUserDetails.vue'),
            name: 'edit-user-details'
          }
        ]
      },
      {
        path: 'booked-tables',
        component: () => import('@/views/BookedTables.vue'),
        name: 'booked-tables'
      }
    ]
  },
  {
    path: '/create-new-pub-floor-area',
    component: CreateNewPubFloorArea,
    name: 'create-new-pub-floor-area',
    beforeEnter (to, from, next) {
      checkIfAdmin(next)
    }
  },
  {
    path: '/:key/edit-pub-floor-area',
    component: EditPubFloorArea,
    name: 'edit-pub-floor-area',
    beforeEnter (to, from, next) {
      checkIfAdmin(next)
    }
  },
  {
    path: '/create-new-pub',
    component: CreateNewPub,
    name: 'create-new-pub',
    beforeEnter (to, from, next) {
      checkIfPublican(next)
    }
  },
  {
    path: '/create-user-roles',
    component: CreateUserRoles,
    name: 'create-user-roles',
    beforeEnter (to, from, next) {
      checkIfAdmin(next)
    }
  },
  {
    path: '/privacy',
    component: Privacy,
    name: 'privacy',
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/signup',
    component: SignUpPage,
    beforeEnter (to, from, next) {
      const user = store.state.userModule.user
      if (user) {
        next('tabs/search-for-pub')
      } else {
        next()
      }
    },
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/forgotpassword',
    component: ForgotPassword,
    beforeEnter (to, from, next) {
      const user = store.state.userModule.user
      if (user) {
        next('/')
      } else {
        next()
      }
    },
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/signin',
    component: SignInPage,
    meta: {
      requiresAuth: false
    },
    beforeEnter (to, from, next) {
      const user = store.state.userModule.user
      if (user) {
        next('tabs/search-for-pub')
      } else {
        next()
      }
    }
  },
  //{ path: '/*', redirect: 'home' }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const currentUser = store.state.userModule.user
  const userRoles = store.state.userModule.userDetails.userRoles
  if (userRoles === null) {
    console.log('NO USER ROLES FOUND...')
  }

  const doesntRequireAuth = to.matched.some(record => record.meta && record.meta.requiresAuth === false)
  if (doesntRequireAuth === false && !currentUser) {
    console.log('redirect to home page as user not authorised to view this page...')
    // try auto login
    next('/home')
  } else {
    next()
  }
})

export default router
