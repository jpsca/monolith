import { required } from "../utils"

const interface = {
  willSubmitForm(form, submitter) { return true },
  formSubmitted(form, submitter) { required() }
}

export class FormSubmitObserver {
  delegate = null
  started = false

  constructor(delegate) {
    delegate.willSubmitForm ||= interface.willSubmitForm
    delegate.formSubmitted ||= interface.formSubmitted
    this.delegate = delegate
  }

  start() {
    if (!this.started) {
      addEventListener("submit", this.submitCaptured, true)
      this.started = true
    }
  }

  stop() {
    if (this.started) {
      removeEventListener("submit", this.submitCaptured, true)
      this.started = false
    }
  }

  submitCaptured = () => {
    removeEventListener("submit", this.submitBubbled, false)
    addEventListener("submit", this.submitBubbled, false)
  }

  submitBubbled = (event) => {
    if (!event.defaultPrevented) {
      const form = event.target instanceof HTMLFormElement ? event.target : undefined
      const submitter = event.submitter || undefined
      if (form) {
        if (this.delegate.willSubmitForm(form, submitter)) {
          event.preventDefault()
          this.delegate.formSubmitted(form, submitter)
        }
      }
    }
  }
}
