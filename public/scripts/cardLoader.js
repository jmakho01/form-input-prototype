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
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
      }

      get year() {
        return this.getAttribute('year');
      }

      get readOnly() {
        return this.getAttribute('read-only');
      }

      set data(value) {
        this._data = value;
        this.updateCard();
      }

      connectedCallback() {
        this.updateCard();
      }

      updateCard() {
        if (!this._data) return;
        const { year, "read-only": readOnly, tables } = this._data;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
          <h2>Year ${year}</h2>
          <p><strong>Read-only:</strong> ${readOnly}</p>
          ${Object.entries(tables).map(([subject, courses]) => `
            <h3>${subject}</h3>
            <table>
              ${Object.entries(courses).map(([course, teacher]) => `
                <tr>
                  <td>${course}</td>
                  <td>${teacher}</td>
                </tr>
              `).join('')}
            </table>
          `).join('')}
        `;
        // <div>
        //  <h2>Year ${year}</h2>
        //  
        //
        // 
        // 
        //

            this.shadowRoot.innerHTML = '';
            this.shadowRoot.appendChild(wrapper);
        }
    }

    customElements.define('card-for-others-to-use', cardForOthersToUse);

    // Populate cards into the grid
    const container = document.getElementById('cardContainer');
    Object.values(JSONdataTemp).forEach(data => {
        const card = document.createElement('card-for-others-to-use');
        card.setAttribute('year', data.year);
        card.setAttribute('read-only', data["read-only"]);
        card.data = data;
        container.appendChild(card);
    });