import { useState, useRef, useEffect } from "./React.js"

export default function RefComponent({ buttonElem, buttonElem2 }) {
  const [count, setCount] = useState(0)
  const renderCount = useRef(0)

  useEffect(() => {
    renderCount.current++
  })

  useEffect(() => {
    const handler = () => setCount(c => c + 1)
    buttonElem.addEventListener("click", handler)
    return () => buttonElem.removeEventListener("click", handler)
  }, [buttonElem])

  return `
    State: ${count}
    Render Count: ${renderCount.current}
  `
}
