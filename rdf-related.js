// this attaches to the windpow for some reason
// instead of just importing the function I want
// which is annoying.
// import * as jsonld from './jsonld.esm.min.js'
// import * as RDFa from './rdfa.js'
// I would rather do something like…
// import { fromRDF } from './jsonld.esm.min.js'
// but whatever I dont feel like figuring that out
// fuckit I just attached these to the global scope
// ill figure out to do it properly fuckin … later


// accept raw html string and return a json object
const rdfa2json = (htmlString) => {
  const parser = new DOMParser()
  let html = parser
    .parseFromString(htmlString, "text/html")
  console.log([...html.querySelectorAll('[typeof]')])
  const propertyNodes = [...html.querySelectorAll('[property]')]
  let predicates = propertyNodes.map(node => {
    let obj = {}
    obj[node.getAttribute("property")] = node.textContent.trim()
    return obj
  })
  return Object.assign({
    "@context": `${window.location.origin}/context.json`,
    "@id": html.baseURI
  }, ...predicates)
}

const getRDF = async (uri) => {
  // the best thing to do here is just…
  // fuckin content negotiation. Ask
  // for the resource as json-ld, use
  // that for the fun stuff.
  let data = await fetch(uri)
  let txt = await data.text()
  let json = rdfa2json(txt)

  // or … i guess … write my own …
  // rdfa parser……………
  // <uri> <node.property> <node.href || node.innerText>
  // basic but probably could be done really simply
  // just to work for _my_ use cases.
  return json
}

class RDFRelated extends HTMLAnchorElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    const uri = this.getAttribute("href")
    let jsonld = await getRDF(uri)
    let text = this.textContent

    const parser = new DOMParser()

    const template = `
      <details>
        <summary>
          <a href="${uri}" property="dc:related">${text}</a>
        </summary>
        <dfn>
          ${JSON.stringify(jsonld)}
        </dfn>
      </details>
    `
    let html = parser
      .parseFromString(template, "text/html")
    console.log(html.body.firstChild)
    this.replaceWith(html.body.firstChild)
  }
}

customElements.define("rdf-related", RDFRelated, { extends: "a" })