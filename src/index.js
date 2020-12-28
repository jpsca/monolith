import { Session } from "./session"

const session = new Session
session.start()

export function visit(location, options) {
  session.visit(location, options)
}

export function clearCache() {
  session.clearCache()
}

export function setProgressBarDelay(delay) {
  session.setProgressBarDelay(delay)
}
