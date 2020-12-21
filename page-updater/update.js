import * as commands from "./commands"

export class Update {
  constructor(type, id, value) {
    this.type = type
    this.id = id
    this.value = value
  }

  perform() {
    const command = commands[this.type]
    if (!command) return

    const element = document.getElementById(this.id)
    if (!element) return

    command(element, this.value)
  }
}
