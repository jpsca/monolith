const POPUP_SELECTOR = "[data-popup]"
const TOGGLE_SELECTOR = "[data-toggle]"
const HIDE_CLASS = "hide"

export class Session {
  started = false

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

  // Private

  clickCaptured(event) {
    if (this.clickEventIsSignificant(event)) {
      this.onClick(event)
    }
  }

  clickEventIsSignificant(event) {
    return !(
      !event.target
      || event.defaultPrevented
      || event.which > 1
      || event.altKey
      || event.ctrlKey
      || event.metaKey
      || event.shiftKey
    )
  }

  onClick(event) {
    const inPopup = event.target.closest(POPUP_SELECTOR)
    if (!inPopup) {
      this.closePopups()
    }

    const clickedToggler = event.target.closest(TOGGLE_SELECTOR)
    if (clickedToggler) {
      this.onToggle(event, clickedToggler)
    }
  }

  closePopups() {
    document.querySelectorAll(POPUP_SELECTOR).forEach(node => {
      node.classList.add(HIDE_CLASS)
    })
  }

  onToggle(event, toggler) {
    const id = toggler.getAttribute(TOGGLE_SELECTOR)
    const target = document.getElementById(id)
    if (!target) { return }

    if (target.classList.contains(HIDE_CLASS)) {
      target.classList.remove(HIDE_CLASS)
    } else {
      event.preventDefault()
      target.classList.add(HIDE_CLASS)
    }
  }
}
