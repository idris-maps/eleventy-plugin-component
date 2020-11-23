const yaml = require('yaml')
const generateId = require('uuid').v4
const getParts = require('@code-blocks/from-html').default

const uniq = arr => [...new Set(arr)]
const capitalize = d => d.charAt(0).toUpperCase() + d.slice(1)
const toCamelCase = d => d.split('-')
  .map(capitalize)
  .join('')

const parseComponent = d => yaml.parse(d)

const partReducer = (result, d) => {
  if (d.type !== 'code' || d.language !== 'comp') {
    return {
      ...result,
      html: result.html + d.content
    }
  }

  const data = parseComponent(d.content)

  if (!data.name) {
    return {
      ...result,
      html: result.html + `<pre><code class="language-comp">${d.content}</code></pre>`
    }
  }

  const id = generateId()
  const html = `<div id="${id}" class="${data.className || 'comp'}">${data.fallback || ''}</div>`
  const script = `document.getElementById("${id}").textContent="";${toCamelCase(data.name)}("${id}", ${JSON.stringify(data.props || {})})`
  return {
    ...result,
    html: result.html + html,
    components: uniq([...result.components, data.name]),
    scripts: [...result.scripts, script]
  }
}

const addScriptTags = (html, scriptTags) => {
  const [beforeEndOfBody, ...rest] = html.split('</body>')
  const withScripts = [
    beforeEndOfBody,
    ...scriptTags,
  ].join('\n')

  return [withScripts, ...rest].join('</body>')
}

const transform = content => {
  const parts = getParts(content, ['comp'])
  const { html, components, scripts } = parts.reduce(
    partReducer,
    { html: '', components: [], scripts: [] },
  )
  return addScriptTags(
    html,
    [
      ...components.map(d => `<script src="/js/${d}.js"></script>`),
      ...scripts.map(d => `<script>${d}</script>`),
    ],
  )
}

module.exports = eleventyConfig => {
  eleventyConfig.addTransform('components', content => {
    return transform(content)
  })
}
