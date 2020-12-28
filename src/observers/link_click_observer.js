import { Location } from "../core/location"
import { required } from "../utils"

const interface = {
  willFollowLinkToLocation(link, location) { return true },
  followedLinkToLocation(link, location) { required() }
}

export class LinkClickObserver {
  delegate = null
  started = false

  constructor(delegate) {
    delegate.willFollowLinkToLocation ||= interface.willFollowLinkToLocation
    delegate.followedLinkToLocation ||= interface.followedLinkToLocation
    this.delegate = delegate
  }

  start() {
    if (!this.started) {
      addEventListener("click", this.clickCaptured, true)
      this.started = true
    }
  }

  stop() {
    if (this.started) {
      removeEventListener("click", this.clickCaptured, true)
      this.started = false
    }
  }

  clickCaptured = () => {
    removeEventListener("click", this.clickBubbled, false)
    addEventListener("click", this.clickBubbled, false)
  }

  clickBubbled = (event) => {
    if (this.clickEventIsSignificant(event)) {
      const link = this.findLinkFromClickTarget(event.target)
      if (link) {
        const location = this.getLocationForLink(link)
        if (this.delegate.willFollowLinkToLocation(link, location)) {
          event.preventDefault()
          this.delegate.followedLinkToLocation(link, location)
        }
      }
    }
  }

  clickEventIsSignificant(event) {
    return !(
      (event.target && event.target.isContentEditable)
      || event.defaultPrevented
      || event.which > 1
      || event.altKey
      || event.ctrlKey
      || event.metaKey
      || event.shiftKey
    )
  }

  findLinkFromClickTarget(target) {
    if (target instanceof Element) {
      return target.closest("a[href]:not([target^=_]):not([download])")
    }
  }

  getLocationForLink(link) {
    return new Location(link.getAttribute("href") || "")
  }
}
