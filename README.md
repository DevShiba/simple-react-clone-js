# Simple React Clone

A minimal implementation of React with core features like hooks and a Virtual DOM, built from scratch. This project is for educational purposes to demonstrate the inner workings of a modern frontend library.

## Overview

This is an educational project that implements the core features of React from scratch. It includes:

- `useState`, `useEffect`, `useMemo`, and `useRef` hooks
- A Virtual DOM with an efficient diffing algorithm
- A component-based architecture

## Features

- **Virtual DOM**: Efficiently updates the real DOM by comparing a virtual representation of the UI.
- **React Hooks**: `useState`, `useEffect`, `useMemo`, `useRef`.
- **Component-Based Architecture**: Build encapsulated components that manage their own state.
- **Minimal Dependencies**: Uses Vite for development but the core library is dependency-free.

## Project Structure

- `src/core/`: Contains the core library implementation.
  - `React.js`: Implementation of hooks and the `render` function.
  - `VirtualDom.js`: Implementation of the Virtual DOM, `createElement`, and `diff` function.
- `src/examples/`: Contains demo components to showcase the library's features.
- `tests/`: Contains the test suite for the project.

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/devshiba/simple-react-clone.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Running the Demo

To see the interactive examples, run the Vite development server:

```bash
npm run dev
```

Then open your browser to `http://localhost:5173`.

## Running Tests

This project uses Vitest for testing.

- To run tests in watch mode:
  ```bash
  npm test
  ```
- To run tests once:
  ```bash
  npm run test:run
  ```
- To generate a coverage report:
  ```bash
  npm run test:coverage
  ```

## API Documentation

### `createElement(type, props, ...children)`

Creates a virtual node that represents a DOM element.

### `useState(initialState)`

Manages state in a component. Returns a stateful value and a function to update it.

### `useEffect(callback, dependencies)`

Performs side effects in components. The callback runs after the component renders.

### `useMemo(callback, dependencies)`

Memoizes a value, re-computing it only when its dependencies change.

### `useRef(initialValue)`

Returns a mutable ref object whose `.current` property is initialized to the passed argument.

### `render(component, props, parent)`

Renders a component into a container in the DOM.

## How It Works

The library maintains a state map for components, allowing hooks to store and retrieve state across renders. The `render` function triggers a `diff` of the Virtual DOM tree, which efficiently calculates the minimal changes needed to update the actual DOM.

## Examples

Here is a simple counter component:

```javascript
import { useState } from './core/React.js';
import { createElement } from './core/VirtualDom.js';

function Counter() {
  const [count, setCount] = useState(0);

  return createElement(
    'div',
    null,
    createElement('p', null, `Count: ${count}`),
    createElement('button', { onclick: () => setCount(count + 1) }, 'Increment')
  );
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

