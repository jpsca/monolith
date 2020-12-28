import { required } from "../utils"

const interface = {
  scrollPositionChanged(position){ required() }
}

export class ScrollObserver {
  delegate = null
  started = false

  constructor(delegate) {
    delegate.scrollPositionChanged ||= interface.scrollPositionChanged
    this.delegate = delegate
  }

  start() {
    if (!this.started) {
      addEventListener("scroll", this.onScroll, false)
      this.onScroll()
      this.started = true
    }
  }

  stop() {
    if (this.started) {
      removeEventListener("scroll", this.onScroll, false)
      this.started = false
    }
  }

  onScroll = () => {
    this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset })
  }

  // Private

  updatePosition(position) {
    this.delegate.scrollPositionChanged(position)
  }
}
