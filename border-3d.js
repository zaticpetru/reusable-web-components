const template = document.createElement("template");
template.innerHTML = /*html*/ `
  <style>
    :host(.sm) {
      --shadow-size: 0.2rem;
      
      --border-width: 0.5rem;
      --border-radius: 1rem;
      --inner-border-radius: 0.5rem;

      --padding: 0.75rem;
    }
    :host(.md) {
      --shadow-size: 0.35rem;
      
      --border-width: 1.25rem;
      --border-radius: 0.75rem;
      --inner-border-radius: 0.3rem;

      --padding: 1rem;
    }
    :host(.lg) {
      --shadow-size: 0.5rem;
      
      --border-width: 2.5rem;
      --border-radius: 1rem;
      --inner-border-radius: 0.2rem;

      --padding: 2rem;
    }

    :host {
      --brand-h: 185;
      --brand-s: 70%;
      --brand-l: 45%;

      --brand: hsl(var(--brand-h) var(--brand-s) var(--brand-l));
      --light-brand: hsl(var(--brand-h) var(--brand-s)
                          calc(var(--brand-l) + 10%));
      --dark-brand: hsl(var(--brand-h) var(--brand-s)
                          calc(var(--brand-l) - 5%));

      --border-gradient: var(--brand), var(--light-brand);


      --shadow-strength: 0.4;
      --shadow-hsl: var(--brand-h) 35% 25%;
      --shadow-color: hsl(var(--shadow-hsl) / var(--shadow-strength));
      --inset-shadow-color: hsl(var(--shadow-hsl) / 
          calc(var(--shadow-strength) / 1.5));
      
      --angle: 45deg;
      --shadow-size: 0.35rem;
      
      --border-width: 1.25rem;
      --border-radius: 0.75rem;
      --inner-border-radius: 0.3rem;

      --padding: 1rem;

      --aspect-ratio: auto;

      --background-color: hsl(var(--brand-h), calc(var(--brand-s) - 30%), 95%);
      box-sizing: border-box;

      --offset-x: calc(var(--shadow-size) * sin(var(--angle)));
      --offset-y: calc(var(--shadow-size) * cos(var(--angle)));
      --brand-shadow:
        var(--offset-x) /* offset-x */
        var(--offset-y) /* offset-y */
        0rem /* blur */
        var(--dark-brand);

      --shadow: 
        calc(var(--offset-x) * 2) /* offset-x 0.2 rem */
        calc(var(--offset-y) * 2)/* offset-y 1.2 rem */
        var(--shadow-size) /* blur */
        var(--shadow-color);

      --inset-shadow:
        inset
        var(--offset-x) /* offset-x */
        var(--offset-y) /* offset-y */
        calc(var(--shadow-size) / 2) /* blur */
        calc(var(--shadow-size) / 2) /* spread */
        var(--inset-shadow-color);

      box-shadow: var(--brand-shadow), var(--shadow);

      padding: var(--border-width);
      aspect-ratio: var(--aspect-ratio);
      width: fit-content;
      border-radius: var(--border-radius);
      background-image: linear-gradient(
          calc(-1 * var(--angle)),
          var(--border-gradient)
      );
    }

    div {
      background-color: var(--background-color);
      aspect-ratio: var(--aspect-ratio);
      border-radius: var(--inner-border-radius);
      display: grid;
      place-items: center;
      box-shadow: var(--inset-shadow);
      overflow: hidden;
      padding: var(--padding);
    }

    .visual-centering {
      padding-right: calc(var(--padding) - var(--offset-x) / 2); 
      padding-bottom: calc(var(--padding) - var(--offset-y) / 2); 
    }

    slot {
      width: 100%;
      height: 100%;
      display: block;
      overflow: hidden;
      border-radius: var(--inner-border-radius);
    }
  </style>

  <div class="container visual-centering">
    <slot></slot>
  </div>
`;

const toHSLObject = (hslStr) => {
  const [hue, saturation, lightness] = hslStr.match(/\d+/g).map(Number);
  return { hue, saturation, lightness };
};

export default class Border3D extends HTMLDivElement {
  
  _sizes = ['sm', 'md', 'lg'];

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this._shadowRoot.querySelector(".container");
    this.host = this._shadowRoot.querySelector(":host");
    
    if(!this.hasAttribute("size")) {
      this.size = "md";
    }

    if (this.hasAttribute("diable-visual-centering") && this.getAttribute("diable-visual-centering") != "false") {
      this.container.classList.remove("visual-centering");
    }
  }

  set angle(angle) {
    this._angle = angle;
    this.style.setProperty("--angle", this._angle);
  }

  get angle() {
    return this._angle ?? "0deg";
  }

  set brand(brand) {
    this._brand = toHSLObject(brand);
    this.style.setProperty("--brand-h", this._brand.hue);
    this.style.setProperty("--brand-s", `${this._brand.saturation}%`);
    this.style.setProperty("--brand-l", `${this._brand.lightness}%`);
  }

  get brand() {
    return this._brand ?? { hue: 0, saturation: 0, lightness: 0 };
  }

  set size(size) {
    if(this._sizes.includes(size)) {
      this._size = size;
      this.classList.add(size);
    } else {
      throw new Error("Incorect size")
    }
  }

  get size() {
    return this._size ?? "md";
  }

  static get observedAttributes() {
    return ["angle", "brand", "size"];
  }

  attributeChangedCallback(name, _ /* oldValue */, newValue) {
    this[name] = newValue;
  }
}

window.customElements.define("border-3d", Border3D, { extends: "div" });
