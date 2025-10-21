// Your dataset
const JSONdataTemp = {
  "2025": {
    "year": 2025,
    "read-only": false,
    "tables": {
      "Science": {
        "CSI 240": "Erica Windholm",
        "CSI 276": "John Invidia"
      },
      "Mathematics": {
        "CSI 242": "Chelsea Green",
        "CSI 221": "Mark Junglegoer"
      },
      "Arts and STEM": {
        "CSI 270": "Hiking Mike",
        "CSI 226": "Elise Bossman"
      }
    }
  },
  "2022": {
    "year": 2022,
    "read-only": true,
    "tables": {
      "Science": {
        "CSI 230": "Samuel Johnson",
        "CSI 220": "Irridium Lovely"
      },
      "Mathematics": {
        "MIT 210": "Chelsea Green",
        "MAT 320": "Mark Johnson"
      },
      "Arts and STEM": {
        "ART 250": "Artistic Mike",
        "CHS 226": "Sally Mace"
      }
    }
  }
};

// Define the custom element
class cardForOthersToUse extends HTMLElement {
  static stylesheet;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Use a single, asynchronous connectedCallback
  async connectedCallback() {
    if (!cardForOthersToUse.stylesheet) {
      cardForOthersToUse.stylesheet = new CSSStyleSheet();
      try {
        const response = await fetch('/styles/form-style.css');
        if (response.ok) {
          const cssText = await response.text();
          cardForOthersToUse.stylesheet.replaceSync(cssText);
        } else {
          throw new Error(`Failed to load stylesheet: ${response.status}`);
        }
      } catch (err) {
        console.error("Failed to load stylesheet:", err);
      }
    }

    if (cardForOthersToUse.stylesheet) {
      this.shadowRoot.adoptedStyleSheets = [cardForOthersToUse.stylesheet];
    }
    this.updateCard();
  }

  // The 'data' setter is the correct place to trigger a re-render
  set data(value) {
    this._data = value;
    // Call updateCard() only after the component has been connected
    // to ensure the shadowRoot exists and styles are ready.
    if (this.shadowRoot) {
      this.updateCard();
    }
  }

  updateCard() {
    if (!this._data) return;
    const { year, "read-only": readOnly, tables } = this._data;

    const wrapper = document.createElement('div');
    // Do not add the CSSStyleSheet object directly as a class
    // Styles are applied via adoptedStyleSheets on the shadow root
    // newElement.classList.add(sheet); <-- This is wrong

    wrapper.innerHTML = `
      <h2 class="YearCard">Year ${year}</h2>
      <p class="ReadOnlyCard"><strong>Read-only:</strong> ${readOnly}</p>
      ${Object.entries(tables).map(([subject, courses]) => `
        <h3 class="SubjectCard">${subject}</h3>
        <table class="TableContainerCard">
          <tbody>
            ${Object.entries(courses).map(([course, teacher]) => `
              <tr>
                <td class="CourseCard">${course}</td>
                <td class="TeacherCard">${teacher}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `).join('')}
      <br>
      <input style="width: 100px; height: 40px; justify-self: center;" type="button" name="Edit" value="Edit" onClick='alert("User prompted to edit")'>
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(wrapper);
  }
}

customElements.define('card-for-others-to-use', cardForOthersToUse);

// Populate cards into the grid
const container = document.getElementById('cardContainer');
Object.values(JSONdataTemp).forEach(data => {
    const card = document.createElement('card-for-others-to-use');
    // Note: Attributes can be set, but data is best passed via the 'data' property
    card.setAttribute('year', data.year);
    card.setAttribute('read-only', data["read-only"]);
    card.data = data;
    container.appendChild(card);
});


// To do the thing, make them edit fields when pressed