import {Component, render, html, useState} from 'uland'

const Count = Component(() => {
  const [count, setCount] = useState(0)

  return html`
    <button onclick=${() => setCount(count + 1)}>
      Count: ${count}
    </button>
  `
})

const Salutation = name => html`<p>Hello ${name}</p>`

module.exports = (targetId, props) =>
  render(
    document.getElementById(targetId),
    html`
      <div>
        ${Salutation(props.name)}
        ${Count()}
      </div>
    `,
  )