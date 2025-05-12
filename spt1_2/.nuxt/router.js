import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _8e73b9b6 = () => interopDefault(import('../pages/callback.vue' /* webpackChunkName: "pages/callback" */))
const _3a2add38 = () => interopDefault(import('../pages/dashboard.vue' /* webpackChunkName: "pages/dashboard" */))
const _769ae3ea = () => interopDefault(import('../pages/library.vue' /* webpackChunkName: "pages/library" */))
const _dc96008e = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _713a71b7 = () => interopDefault(import('../pages/rechercher.vue' /* webpackChunkName: "pages/rechercher" */))
const _3545ddf0 = () => interopDefault(import('../pages/search.vue' /* webpackChunkName: "pages/search" */))
const _6fe546bc = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
const _e05e4a46 = () => interopDefault(import('../pages/playlist/_id.vue' /* webpackChunkName: "pages/playlist/_id" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/callback",
    component: _8e73b9b6,
    name: "callback"
  }, {
    path: "/dashboard",
    component: _3a2add38,
    name: "dashboard"
  }, {
    path: "/library",
    component: _769ae3ea,
    name: "library"
  }, {
    path: "/login",
    component: _dc96008e,
    name: "login"
  }, {
    path: "/rechercher",
    component: _713a71b7,
    name: "rechercher"
  }, {
    path: "/search",
    component: _3545ddf0,
    name: "search"
  }, {
    path: "/",
    component: _6fe546bc,
    name: "index"
  }, {
    path: "/playlist/:id?",
    component: _e05e4a46,
    name: "playlist-id"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
