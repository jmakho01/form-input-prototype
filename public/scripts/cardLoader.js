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
    this.isEditing = false; // edit flag
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
    /*
    if(editing === "true") {
      const wrapper = document.createElement('form')
      wrapper.setAttribute("method=\"post\"")
      wrapper.setAttribute("action=\"/submit-order\"")
    }
    else { */
    const wrapper = document.createElement('div');
    //}
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
                <td class="TeacherCard">${this.isEditing && !readOnly ? `<input type="text" value="${teacher}" data-subject="${subject}" data-course="${course}">` : teacher }</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `).join('')}
      <br>
      <div class="button-row">
        <input style="width: 100px; height: 40px; justify-self: center;" type="button" class="editbtn" value="${this.isEditing && !readOnly ? "Save" : "Edit"}"'>
        ${this.isEditing && !readOnly ? `<input style="width: 100px; height: 40px; justify-self: center;" type="button" class="cancelbtn" value="Cancel">` : ''}
      </div>
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(wrapper);

    const editButton = this.shadowRoot.querySelector('.editbtn');
    editButton.addEventListener('click', () => {
      if (this.isEditing && !readOnly) {
        this.saveChanges();
      } else {
        this.tempData = JSON.parse(JSON.stringify(this._data)); // stores backup of JSON data
      }
      this.isEditing = !this.isEditing;
      this.updateCard();
    });

    const cancelButton = this.shadowRoot.querySelector('.cancelbtn');
    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        if (this.tempData) {
          this._data = JSON.parse(JSON.stringify(this.tempData)); // restore backup of JSON data
          this.tempData = null;
        }
        this.isEditing = false;
        this.updateCard();
      });
    }
  }

  // function for saving changes done in form
  saveChanges() {
    const inputs = this.shadowRoot.querySelectorAll('input[type="text"]');

    // pulls in data from input
    inputs.forEach(input => {
      const subject = input.dataset.subject;
      const course = input.dataset.course;
      const newValue = input.value.trim();

      if (newValue === "") { // if input field is blank...
        alert("Please fill in all fields before saving."); // displays error message
        return; // reverts to non-saved data
      }
      else {
        this._data.tables[subject][course] = newValue;
      }
    });
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