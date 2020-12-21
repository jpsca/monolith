export const emitEvent = (event, detail) => {
  document.dispatchEvent(
    new CustomEvent(event, {
      bubbles: true,
      cancelable: false,
      detail
    })
  )
  if (window.jQuery) window.jQuery(document).trigger(event, detail)
}
