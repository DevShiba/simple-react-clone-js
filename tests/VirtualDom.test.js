import { describe, it, expect, vi } from 'vitest'
import { createElement, diff } from '../src/core/VirtualDom'

describe('Virtual DOM', () => {
  describe('createElement', () => {
    it('should create a VNode with type, props, and children', () => {
      const vnode = createElement('div', { id: 'foo' }, 'hello')
      expect(vnode.type).toBe('div')
      expect(vnode.props.id).toBe('foo')
      expect(vnode.children[0].type).toBe('TEXT_NODE')
      expect(vnode.children[0].text).toBe('hello')
    })

    it('should handle text nodes correctly', () => {
      const vnode = createElement('p', null, 'just text')
      expect(vnode.children[0].type).toBe('TEXT_NODE')
      expect(vnode.children[0].text).toBe('just text')
    })

    it('should flatten nested children arrays', () => {
      const vnode = createElement('div', null, ['a', ['b', 'c']])
      expect(vnode.children.length).toBe(3)
      expect(vnode.children[0].text).toBe('a')
      expect(vnode.children[1].text).toBe('b')
    })

    it('should filter out null, false, and true values from children', () => {
      const vnode = createElement('div', null, 'a', null, 'b', false, 'c', true)
      expect(vnode.children.length).toBe(3)
      expect(vnode.children.map(c => c.text)).toEqual(['a', 'b', 'c'])
    })
  })

  describe('diff', () => {
    it('should perform initial render when oldVNode is null', () => {
      const parent = document.createElement('div')
      const newVNode = createElement('p', null, 'hello')
      diff(null, newVNode, parent)
      expect(parent.innerHTML).toBe('<p>hello</p>')
    })

    it('should update nodes with the same type', () => {
      const parent = document.createElement('div')
      const oldVNode = createElement('p', { className: 'foo' }, 'hello')
      const newVNode = createElement('p', { className: 'bar' }, 'world')
      const dom = diff(null, oldVNode, parent)
      diff(oldVNode, newVNode, parent, dom)
      expect(parent.innerHTML).toBe('<p class="bar">world</p>')
    })

    it('should replace nodes with different types', () => {
      const parent = document.createElement('div')
      const oldVNode = createElement('p', null, 'hello')
      const newVNode = createElement('span', null, 'world')
      const dom = diff(null, oldVNode, parent)
      diff(oldVNode, newVNode, parent, dom)
      expect(parent.innerHTML).toBe('<span>world</span>')
    })

    it('should update text nodes', () => {
      const parent = document.createElement('div')
      const oldVNode = createElement('p', null, 'hello')
      const newVNode = createElement('p', null, 'world')
      const dom = diff(null, oldVNode, parent)
      diff(oldVNode, newVNode, parent, dom)
      expect(parent.innerHTML).toBe('<p>world</p>')
    })

    it('should remove nodes when newVNode is null', () => {
      const parent = document.createElement('div')
      const oldVNode = createElement('p', null, 'hello')
      const dom = diff(null, oldVNode, parent)
      diff(oldVNode, null, parent, dom)
      expect(parent.innerHTML).toBe('')
    })
  })
})
