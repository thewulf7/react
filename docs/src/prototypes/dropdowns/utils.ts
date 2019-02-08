const findLastTextNode = (node: Node): Node | null => {
  if (node.nodeType === Node.TEXT_NODE) return node
  const children = node.childNodes
  for (let i = children.length - 1; i >= 0; i--) {
    const textNode = findLastTextNode(children[i])
    if (textNode !== null) return textNode
  }
  return null
}

export const replaceCaret = (el: HTMLElement) => {
  // Place the caret at the end of the element
  const target = findLastTextNode(el)
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === el

  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    const range = document.createRange()
    const sel = window.getSelection()

    range.setStart(target, target.nodeValue.length)
    range.collapse(true)

    sel.removeAllRanges()
    sel.addRange(range)
    if (el instanceof HTMLElement) {
      el.focus()
    }
  }
}

export const normalizeHtml = (str: string): string => {
  return str && str.replace(/&nbsp|\u202F|\u00A0/g, ' ')
}

export const createNodeWithIdAtCaretPosition = (id: string) => {
  if (!window.getSelection) {
    return
  }

  const sel = window.getSelection()
  if (!sel.getRangeAt || !sel.rangeCount) {
    return
  }

  let range = sel.getRangeAt(0)
  range.deleteContents()

  // Range.createContextualFragment() would be useful here but is
  // non-standard and not supported in all browsers (IE9, for one)
  const elem = document.createElement('span')
  const container = document.createElement('div')
  elem.id = id
  container.appendChild(elem)

  const frag = document.createDocumentFragment()
  let node: Node
  let lastNode: Node

  while ((node = container.firstChild)) {
    lastNode = frag.appendChild(node)
  }

  range.insertNode(elem)

  // Preserve the selection
  if (lastNode) {
    range = range.cloneRange()
    range.setStartAfter(lastNode)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
  }
}
