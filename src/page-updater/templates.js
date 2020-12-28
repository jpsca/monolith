import { Update } from "./update"

const TYPE_ATTRIBUTE = "type"
const TARGET_ATTRIBUTE = "id"
const SELECTOR = `action`

export function extractUpdates(html) {
  return Array.from(extractTemplates(html), createUpdate)
}

function extractTemplates(html) {
  return createFragment(html).querySelectorAll(SELECTOR)
}

export function createFragment(html) {
  return document.createRange().createContextualFragment(html)
}

function createUpdate(template) {
  const type = template.getAttribute(TYPE_ATTRIBUTE)
  const id = template.getAttribute(TARGET_ATTRIBUTE)
  return new Update(type, id, template.content)
}
