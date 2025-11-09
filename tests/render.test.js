import { describe, it, expect, beforeEach } from 'vitest'
import { render, useState } from '../src/core/React'
import { createElement } from '../src/core/VirtualDom'

describe('render function', () => {
  let parent

  beforeEach(() => {
    parent = document.createElement('div')
  })

  it('should render a simple component', () => {
    function App() {
      return createElement('h1', null, 'Hello')
    }
    render(App, {}, parent)
    expect(parent.innerHTML).toBe('<h1>Hello</h1>')
  })

  it('should re-render a component with updated props', () => {
    function App({ message }) {
      return createElement('h1', null, message)
    }
    render(App, { message: 'Hello' }, parent)
    expect(parent.innerHTML).toBe('<h1>Hello</h1>')
    render(App, { message: 'World' }, parent)
    expect(parent.innerHTML).toBe('<h1>World</h1>')
  })

  it('should handle state updates and re-render', () => {
    let setter
    function App() {
      const [count, setCount] = useState(0)
      setter = setCount
      return createElement('p', null, `Count: ${count}`)
    }
    render(App, {}, parent)
    expect(parent.innerHTML).toBe('<p>Count: 0</p>')
    setter(1)
    expect(parent.innerHTML).toBe('<p>Count: 1</p>')
  })

  it('should render nested components', () => {
    function Child() {
      return createElement('span', null, 'I am a child')
    }
    function Parent() {
      return createElement('div', null, createElement(Child))
    }
    render(Parent, {}, parent)
    expect(parent.innerHTML).toBe('<div><span>I am a child</span></div>')
  })
})
