import getRDF from './getRDF.js'

class FlexTerm extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    const a = this.querySelector('a')
    const uri = a.getAttribute("href")
    let jsonld = await getRDF(uri)
    a.innerText = jsonld['skos:prefLabel']
  }
}

customElements.define("flex-term", FlexTerm)
