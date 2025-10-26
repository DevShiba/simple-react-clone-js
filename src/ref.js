import { render } from "./React.js"
import RefComponent from "./RefComponent.js"

function renderComponent() {
  render(
    RefComponent,
    { buttonElem: document.getElementById("btn-ref-count") },
    document.getElementById("root-ref")
  )
}

renderComponent()
