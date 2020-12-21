export function append(element, value) {
  element.append(value)
}

export function prepend(element, value) {
  element.prepend(value)
}

export function replace(element, value) {
  element.replaceWith(value)
}

export function update(element, value) {
  element.innerHTML = ""
  element.append(value)
}

export function remove(element) {
  element.remove()
}

export function addclass(element, value) {
  element.classList.add(value)
}

export function rmclass(element, value) {
  element.classList.remove(value)
}

export function attr(element, value) {
  const [name, val] = value.split(":", 2)
  element.setAttribute(name, val)
}

export function morph(element, value) {
  morphdom(element, value)
}
