# eleventy-plugin-components

One of many approaches to using js components in [eleventy](https://www.11ty.dev)

## Install

```
npm install eleventy-plugin-components
```

## Usage

in `.eleventy.js`

```js
const components = require('eleventy-plugin-components')

module.exports = eleventyConfig => {
  eleventyConfig.addPlugin(components)
}
```

Create components as named `iife` in `_site/js`. In the [example setup](https://github.com/idris-maps/eleventy-plugin-component/tree/main/example), we have a counter component like [this](https://github.com/idris-maps/eleventy-plugin-component/blob/main/example/src/_components/counter/index.js)

As the name implies it is a counter. It also takes a `name` property and shows a string with `Hello ${name}`.

To use the component in a markdown page use a code block with `comp` as language and the following content:

```yaml
name: counter
className: counter
props:
  name: world
fallback: If you enable js, you will see a counter here
```

* `name` is the name of the component
* `className` is a class we add to the `<div>` that contains the component (for styling)
* `props` is what we pass the component, in this case a `name`
* `fallback` is what you see if you disable javascript

only `name` is required, the rest is optional.

### What does this plugin do?

* It replaces your code block with a `<div>` with a unique id
* and a `class` if you defined it with `className`
* adds a script tag loading your component
* adds another script tag that removes the content (the `fallback` text) and calls your component giving it the unique id and the `props`

See the [example markdown](https://raw.githubusercontent.com/idris-maps/eleventy-plugin-component/main/example/src/index.md) and the [generated HTML file](https://github.com/idris-maps/eleventy-plugin-component/blob/main/example/_site/index.html)

### Things to be aware of

* Your component must be a function taking an id as first arguments and properties as a second (see the [example component](https://github.com/idris-maps/eleventy-plugin-component/blob/main/example/src/_components/counter/index.js))
* How the component is built is up to you (see the [example build script](https://github.com/idris-maps/eleventy-plugin-component/blob/main/example/build_components.js) for inspiration)
* The build component has to be an `iife` with the same name as `name` but in CamelCase (a component folder `my-beautiful-component` needs to have a global name `MyBeautifulComponent`)
