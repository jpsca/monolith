export function required () {
    throw new Error("Not Implemented")
}

export function dispatch(eventName, { target, cancelable, detail }) {
  const event = new CustomEvent(eventName, { cancelable, bubbles: true, detail })
  (target || document.documentElement).dispatchEvent(event)
  return event
}

export function nextMicrotask() {
    return Promise.resolve()
}

export function uuid() {
    return Array.apply(null, { length: 36 }).map((_, i) => {
        if (i == 8 || i == 13 || i == 18 || i == 23) {
            return "-"
        } else if (i == 14) {
            return "4"
        } else if (i == 19) {
            return (Math.floor(Math.random() * 4) + 8).toString(16)
        } else {
            return Math.floor(Math.random() * 15).toString(16)
        }
    }).join("")
}
