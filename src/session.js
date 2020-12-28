import { FormSubmitObserver } from "./observers/form_submit_observer"
import { LinkClickObserver } from "./observers/link_click_observer"
import { ScrollObserver } from "./observers/scroll_observer"

import { History } from "./history"
import { Location } from "./location"
import { Navigator } from "./navigator"
import { dispatch } from "./util"
import { View } from "./view"

export class Session {
  navigator = new Navigator(this)
  history = new History(this)
  view = new View(this)

  linkClickObserver = new LinkClickObserver(this)
  formSubmitObserver = new FormSubmitObserver(this)
  scrollObserver = new ScrollObserver(this)

  enabled = true
  progressBarDelay = 500
  started = false

  start() {
    if (!this.started) {
      this.linkClickObserver.start()
      this.formSubmitObserver.start()
      this.scrollObserver.start()
      this.history.start()
      this.started = true
      this.enabled = true
    }
  }

  disable() {
    this.enabled = false
  }

  stop() {
    if (this.started) {
      this.linkClickObserver.stop()
      this.formSubmitObserver.stop()
      this.scrollObserver.stop()
      this.history.stop()
      this.started = false
    }
  }

  visit(location, options) {
    this.navigator.proposeVisit(Location.wrap(location), options)
  }

  clearCache() {
    this.view.clearSnapshotCache()
  }

  setProgressBarDelay(delay) {
    this.progressBarDelay = delay
  }

  get location() {
    return this.history.location
  }

  get restorationIdentifier() {
    return this.history.restorationIdentifier
  }

  // History delegate

  historyPopped(location) {
    if (this.enabled) {
      this.navigator.proposeVisit(location, { action: "restore", historyChanged: true })
    } else {
      this.adapter.pageInvalidated()
    }
  }

  // Scroll observer delegate

  scrollPositionChanged(position) {
    this.history.updateRestorationData({ scrollPosition: position })
  }

  // Link click observer delegate

  willFollowLinkToLocation(link, location) {
    return this.linkIsVisitable(link)
      && this.locationIsVisitable(location)
      && this.applicationAllowsFollowingLinkToLocation(link, location)
  }

  followedLinkToLocation(link, location) {
    const action = this.getActionForLink(link)
    this.visit(location, { action })
  }

  // Navigator delegate

  allowsVisitingLocation(location) {
    return this.applicationAllowsVisitingLocation(location)
  }

  visitProposedToLocation(location, options) {
    this.adapter.visitProposedToLocation(location, options)
  }

  visitStarted(visit) {
    this.notifyApplicationAfterVisitingLocation(visit.location)
  }

  visitCompleted(visit) {
    this.notifyApplicationAfterPageLoad(visit.getTimingMetrics())
  }

  // Form submit observer delegate

  willSubmitForm(form, submitter) {
    return true
  }

  formSubmitted(form, submitter) {
    this.navigator.submitForm(form, submitter)
  }

  // View delegate

  viewWillRender(newBody) {
    this.notifyApplicationBeforeRender(newBody)
  }

  viewRendered() {
    this.view.lastRenderedLocation = this.history.location
    this.notifyApplicationAfterRender()
  }

  viewInvalidated() {
    this.pageObserver.invalidate()
  }

  viewWillCacheSnapshot() {
    this.notifyApplicationBeforeCachingSnapshot()
  }

  // Application events

  applicationAllowsFollowingLinkToLocation(link, location) {
    const event = this.notifyApplicationAfterClickingLinkToLocation(link, location)
    return !event.defaultPrevented
  }

  applicationAllowsVisitingLocation(location) {
    const event = this.notifyApplicationBeforeVisitingLocation(location)
    return !event.defaultPrevented
  }

  notifyApplicationAfterClickingLinkToLocation(link, location) {
    return dispatch("turbo:click", { target: link, detail: { url: location.absoluteURL }, cancelable: true })
  }

  notifyApplicationBeforeVisitingLocation(location) {
    return dispatch("turbo:before-visit", { detail: { url: location.absoluteURL }, cancelable: true })
  }

  notifyApplicationAfterVisitingLocation(location) {
    return dispatch("turbo:visit", { detail: { url: location.absoluteURL } })
  }

  notifyApplicationBeforeCachingSnapshot() {
    return dispatch("turbo:before-cache")
  }

  notifyApplicationBeforeRender(newBody) {
    return dispatch("turbo:before-render", { detail: { newBody }})
  }

  notifyApplicationAfterRender() {
    return dispatch("turbo:render")
  }

  notifyApplicationAfterPageLoad(timing) {
    return dispatch("turbo:load", { detail: { url: this.location.absoluteURL, timing }})
  }

  // Private

  getActionForLink(link) {
    const action = link.getAttribute("data-turbo-action")
    return isAction(action) ? action : "advance"
  }

  linkIsVisitable(link) {
    const container = link.closest("[data-turbo]")
    if (container) {
      return container.getAttribute("data-turbo") != "false"
    } else {
      return true
    }
  }

  locationIsVisitable(location) {
    return location.isPrefixedBy(this.view.getRootLocation()) && location.isHTML()
  }
}
