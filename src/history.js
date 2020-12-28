import { Location } from "./location"
import { nextMicrotask, uuid, required } from "./utils"

const interface = {
  historyPopped(location, restorationIdentifier) { required() }
}

export class History {
  delegate = null
  location = null
  restorationIdentifier = uuid()
  restorationData = {}
  started = false
  pageLoaded = false
  previousScrollRestoration = null

  constructor(delegate) {
    delegate.historyPopped ||= interface.historyPopped
    this.delegate = delegate
  }

  start() {
    if (!this.started) {
      this.previousScrollRestoration = history.scrollRestoration
      history.scrollRestoration = "manual"
      addEventListener("popstate", this.onPopState, false)
      addEventListener("load", this.onPageLoad, false)
      this.started = true
      this.replace(Location.currentLocation)
    }
  }

  stop() {
    if (this.started) {
      history.scrollRestoration = this.previousScrollRestoration ?? "auto"
      removeEventListener("popstate", this.onPopState, false)
      removeEventListener("load", this.onPageLoad, false)
      this.started = false
    }
  }

  push(location, restorationIdentifier) {
    this.update(history.pushState, location, restorationIdentifier)
  }

  replace(location, restorationIdentifier) {
    this.update(history.replaceState, location, restorationIdentifier)
  }

  update(method, location, restorationIdentifier = uuid()) {
    const state = { turbo: { restorationIdentifier } }
    method.call(history, state, "", location.absoluteURL)
    this.location = location
    this.restorationIdentifier = restorationIdentifier
  }

  // Restoration data

  getRestorationDataForIdentifier(restorationIdentifier) {
    return this.restorationData[restorationIdentifier] || {}
  }

  updateRestorationData(additionalData) {
    const { restorationIdentifier } = this
    const restorationData = this.restorationData[restorationIdentifier]
    this.restorationData[restorationIdentifier] = { ...restorationData, ...additionalData }
  }

  // Event handlers

  onPopState = (event) => {
    if (this.shouldHandlePopState()) {
      const { turbo } = event.state || {}
      if (turbo) {
        const location = Location.currentLocation
        this.location = location
        const { restorationIdentifier } = turbo
        this.restorationIdentifier = restorationIdentifier
        this.delegate.historyPoppedToLocationWithRestorationIdentifier(location, restorationIdentifier)
      }
    }
  }

  onPageLoad = async (event) => {
    await nextMicrotask()
    this.pageLoaded = true
  }

  // Private

  shouldHandlePopState() {
    // Safari dispatches a popstate event after window's load event, ignore it
    return this.pageIsLoaded()
  }

  pageIsLoaded() {
    return this.pageLoaded || document.readyState == "complete"
  }
}
