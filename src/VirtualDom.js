export function createElement(type, props, ...children) {
  const flattenedChildren = children
    .flat(Infinity)
    .filter(child => child != null && child !== false && child !== true)
    .map(child =>
      typeof child === 'object' ? child : createTextVNode(child)
    )

  return {
    type,
    props: props || {},
    children: flattenedChildren
  }
}

function createTextVNode(text) {
  return {
    type: 'TEXT_NODE',
    props: {},
    children: [],
    text: String(text)
  }
}

export function diff(oldVNode, newVNode, parentDOMElement, oldDom = null) {
  if (newVNode == null) {
    if (oldDom) {
      parentDOMElement.removeChild(oldDom)
    }
    return null
  }

  if (oldVNode == null) {
    const newDom = createDOMElement(newVNode)
    parentDOMElement.appendChild(newDom)
    return newDom
  }

  if (newVNode.type === 'TEXT_NODE') {
    if (oldVNode.tye === 'TEXT_NODE') {
      if (oldVNode.text !== newVNode.text) {
        oldDom.nodeValue = newVNode.text
      }
      return oldDom
    } else {
      const newDom = document.createTextNode(newVNode.text)
      parentDOMElement.replaceChild(newDom, oldDom)
      return newDom
    }
  }

  if (typeof newVNode.type === 'function') {
    const oldComponentVNode = typeof oldVNode.type === 'function' ? oldVNode._componentOutput : null

    const newComponentVNode = newVNode.type({ ...newVNode.props, children: newVNode.children })

    newVNode._componentOutput = newComponentVNode

    const newDom = diff(oldComponentVNode, newComponentVNode, parentDOMElement, oldDom)
    newVNode._dom = newDom
    return newDom
  }

  if(oldVNode.type !== newVNode.type) {
    const newDom = createDOMElement(newVNode)
    if(oldDom) {
      parentDOMElement.replaceChild(newDom, oldDom)
    } else {
      parentDOMElement.appendChild(newDom)
    }
    return newDom
  }

  const domElement = oldDom

  updateProps(domElement, oldVNode.props, newVNode.props)

  const oldChildren = oldVNode.children || []
  const newChildren = newVNode.children || []
  const maxLength = Math.max(oldChildren.length, newChildren.length)

  for (let i = 0; i < maxLength; i++) {
    const oldChild = oldChildren[i]
    const newChild = newChildren[i]
    const oldChildDom = oldChild?._dom || domElement.childNodes[i]

    const newChildDom = diff(oldChild, newChild, domElement, oldChildDom)

    if (newChild) {
      newChild._dom = newChildDom
    }
  }

  newVNode._dom = domElement
  return domElement
}

function createDOMElement(vnode) {
  if (vnode.type === 'TEXT_NODE') {
    return document.createTextNode(vnode.text)
  }

  if (typeof vnode.type === 'function') {
    const componentVNode = vnode.type({
      ...vnode.props,
      children: vnode.children
    })
    vnode._componentOutput = componentVNode
    const dom = createDOMElement(componentVNode)
    vnode._dom = dom
    return dom
  }

  const element = document.createElement(vnode.type)

  updateProps(element, {}, vnode.props)

  vnode.children.forEach(child => {
    const childDom = createDOMElement(child)
    child._dom = childDom
    element.appendChild(childDom)
  })

  vnode._dom = element
  return element
}

function updateProps(domElement, oldProps = {}, newProps = {}) {
  if (!domElement._listeners) {
    domElement._listeners = {}
  }

  Object.keys(oldProps).forEach(name => {
    if (!(name in newProps)) {
      removeProp(domElement, name, oldProps[name])
    }
  })

  Object.keys(newProps).forEach(name => {
    if (oldProps[name] !== newProps[name]) {
      setProp(domElement, name, newProps[name], oldProps[name])
    }
  })

  domElement._props = newProps
}

function setProp(domElement, name, value, oldValue) {
  if (name.startsWith('on')) {
    const eventName = name.substring(2).toLowerCase()

    if (oldValue && domElement._listeners[eventName]) {
      domElement.removeEventListener(eventName, domElement._listeners[eventName])
    }

    if (value) {
      domElement._listeners[eventName] = value
      domElement.addEventListener(eventName, value)
    }
    return
  }

  if (name === 'style' && typeof value === 'object') {
    Object.keys(value).forEach(styleName => {
      domElement.style[styleName] = value[styleName]
    })
    return
  }

  if (name === 'className') {
    domElement.setAttribute('class', value)
    return
  }

  if (typeof value === 'boolean') {
    if (value) {
      domElement.setAttribute(name, '')
    } else {
      domElement.removeAttribute(name)
    }
    return
  }

  if (value == null) {
    domElement.removeAttribute(name)
    return
  }

  domElement.setAttribute(name, value)
}

function removeProp(domElement, name, value) {
  if (name.startsWith('on')) {
    const eventName = name.substring(2).toLowerCase()
    if (domElement._listeners && domElement._listeners[eventName]) {
      domElement.removeEventListener(eventName, domElement._listeners[eventName])
      delete domElement._listeners[eventName]
    }
    return
  }

  if (name === 'style') {
    domElement.removeAttribute('style')
    return
  }

  if (name === 'className') {
    domElement.removeAttribute('class')
    return
  }

  domElement.removeAttribute(name)
}