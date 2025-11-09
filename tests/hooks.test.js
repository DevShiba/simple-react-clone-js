import { describe, it, expect, beforeEach } from 'vitest'
import { render, useState, useEffect, useMemo, useRef } from '../src/core/React'
import { createElement } from '../src/core/VirtualDom'

describe('React Hooks', () => {
  let parent

  beforeEach(() => {
    parent = document.createElement('div')
  })

  describe('useState', () => {
    it('should return initial state', () => {
      let value
      function Component() {
        const [val] = useState(10)
        value = val
        return createElement('div', null, '')
      }
      render(Component, {}, parent)
      expect(value).toBe(10)
    })

    it('should update state with a new value', () => {
      let value, setter
      function Component() {
        ;[value, setter] = useState(10)
        return createElement('div', null, '')
      }
      render(Component, {}, parent)
      setter(20)
      expect(value).toBe(20)
    })

    it('should update state with an updater function', () => {
      let value, setter
      function Component() {
        ;[value, setter] = useState(10)
        return createElement('div', null, '')
      }
      render(Component, {}, parent)
      setter(prev => prev + 5)
      expect(value).toBe(15)
    })

    it('should handle multiple useState calls', () => {
      let val1, val2
      function Component() {
        ;[val1] = useState('a')
        ;[val2] = useState('b')
        return createElement('div', null, '')
      }
      render(Component, {}, parent)
      expect(val1).toBe('a')
      expect(val2).toBe('b')
    })
  })

  describe('useEffect', () => {
    it('should run the effect after render', () => {
      let called = false
      function Component() {
        useEffect(() => {
          called = true
        })
        return createElement('div', null, '')
      }
      render(Component, {}, parent)
      expect(called).toBe(true)
    })

    it('should run cleanup function on unmount', () => {
      let cleaned = false
      function Component() {
        useEffect(() => {
          return () => {
            cleaned = true
          }
        })
        return createElement('div', null, '')
      }
      render(Component, {}, parent)
      // Simulate unmount by rendering null
      render(() => null, {}, parent)
      expect(cleaned).toBe(true)
    })

    it('should only re-run if dependencies change', () => {
      let runs = 0
      let prop = 1
      function Component({ p }) {
        useEffect(() => {
          runs++
        }, [p])
        return createElement('div', null, '')
      }
      render(Component, { p: prop }, parent)
      expect(runs).toBe(1)
      render(Component, { p: prop }, parent)
      expect(runs).toBe(1)
      prop = 2
      render(Component, { p: prop }, parent)
      expect(runs).toBe(2)
    })
  })

  describe('useMemo', () => {
    it('should memoize the value', () => {
      let runs = 0
      let value
      let prop = 1
      function Component({ p }) {
        value = useMemo(() => {
          runs++
          return p * 2
        }, [p])
        return createElement('div', null, '')
      }
      render(Component, { p: prop }, parent)
      expect(runs).toBe(1)
      expect(value).toBe(2)
      render(Component, { p: prop }, parent)
      expect(runs).toBe(1)
      expect(value).toBe(2)
      prop = 2
      render(Component, { p: prop }, parent)
      expect(runs).toBe(2)
      expect(value).toBe(4)
    })
  })

  describe('useRef', () => {
    it('should persist the ref object across renders', () => {
      let ref
      function Component() {
        ref = useRef(0)
        ref.current++
        return createElement('div', null, '')
      }
      render(Component, {}, parent)
      expect(ref.current).toBe(1)
      render(Component, {}, parent)
      expect(ref.current).toBe(2)
    })
  })
})