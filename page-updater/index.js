const updatesQueue = []
let animationFrame

export function processPageUpdates(updates) {
  updates.forEach(queue)
}

function queue(update) {
  updatesQueue.push(update)
  scheduleRender()
}

function scheduleRender() {
  if (animationFrame) return
  animationFrame = requestAnimationFrame(() => {
    animationFrame = null
    while (updatesQueue.length) updatesQueue.shift().perform()
  })
}
