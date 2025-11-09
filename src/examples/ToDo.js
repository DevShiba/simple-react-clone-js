import { useState } from '../core/React.js'
import { createElement } from '../core/VirtualDom.js'

export default function ToDo() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now(), text: input.trim(), completed: false }])
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    return true
  })

  const activeCount = tasks.filter(t => !t.completed).length

  return createElement('div', { className: 'todo-app' },
    createElement('h1', null, 'ToDo App'),

    createElement('div', { className: 'todo-input' },
      createElement('input', {
        type: 'text',
        value: input,
        onInput: (e) => setInput(e.target.value),
        onKeyPress: (e) => e.key === 'Enter' && addTask(),
        placeholder: 'Add a new task...'
      }),
      createElement('button', { onClick: addTask }, 'Add Task')
    ),

    createElement('div', { className: 'filters' },
      createElement('button', {
        className: filter === 'all' ? 'active' : '',
        onClick: () => setFilter('all')
      }, 'All'),
      createElement('button', {
        className: filter === 'pending' ? 'active' : '',
        onClick: () => setFilter('pending')
      }, 'Pending'),
      createElement('button', {
        className: filter === 'completed' ? 'active' : '',
        onClick: () => setFilter('completed')
      }, 'Completed')
    ),

    createElement('ul', { className: 'todo-list' },
      filteredTasks.map(todo =>
        createElement('li', {
          key: todo.id,
          className: todo.completed ? 'completed' : ''
        },
          createElement('input', {
            type: 'checkbox',
            checked: todo.completed,
            onChange: () => toggleTask(todo.id)
          }),
          createElement('span', null, todo.text),
          createElement('button', {
            className: 'delete',
            onClick: () => deleteTask(todo.id)
          }, 'X')
        )
      )
    ),

    createElement('div', { className: 'footer' },
      createElement('span', null, `${activeCount} item${activeCount !== 1 ? 's' : ''} left`)
    )
  )
}