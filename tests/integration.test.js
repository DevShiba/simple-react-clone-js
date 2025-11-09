import { describe, it, expect, beforeEach } from 'vitest'
import { render, useState, useEffect, useMemo } from '../src/core/React'
import { createElement } from '../src/core/VirtualDom'

describe('Integration Tests', () => {
  let parent

  beforeEach(() => {
    parent = document.createElement('div')
  })

  it('should handle a component with multiple hooks', () => {
    let setter
    function App({ prop }) {
      const [count, setCount] = useState(0)
      setter = setCount

      const memoizedProp = useMemo(() => prop * 2, [prop])

      useEffect(() => {
        parent.setAttribute('data-effect', `run-${count}`)
      }, [count])

      return createElement(
        'div',
        null,
        `Count: ${count}, Memo: ${memoizedProp}`
      )
    }

    render(App, { prop: 1 }, parent)
    expect(parent.innerHTML).toBe('<div>Count: 0, Memo: 2</div>')
    expect(parent.getAttribute('data-effect')).toBe('run-0')

    setter(5)
    expect(parent.innerHTML).toBe('<div>Count: 5, Memo: 2</div>')
    expect(parent.getAttribute('data-effect')).toBe('run-5')

    render(App, { prop: 2 }, parent)
    expect(parent.innerHTML).toBe('<div>Count: 5, Memo: 4</div>')
  })

  it('should isolate state between two component instances', () => {
    const parent1 = document.createElement('div')
    const parent2 = document.createElement('div')
    let setter1, setter2

    function Counter() {
      const [count, setCount] = useState(0)
      if (!setter1) setter1 = setCount
      else setter2 = setCount
      return createElement('p', null, `${count}`)
    }

    render(Counter, {}, parent1)
    render(Counter, {}, parent2)

    expect(parent1.innerHTML).toBe('<p>0</p>')
    expect(parent2.innerHTML).toBe('<p>0</p>')

    setter1(10)
    expect(parent1.innerHTML).toBe('<p>10</p>')
    expect(parent2.innerHTML).toBe('<p>0</p>')
  })
})
