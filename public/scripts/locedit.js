document.addEventListener("DOMContentLoaded", () => {
  const allCards = document.querySelectorAll(".division-card, .subject-card"); //selecting both cards
  const inMemoryEdits = []; // stores any saved changes

  allCards.forEach(card => {
    const editBtn = card.querySelector(".edit-btn");
    const saveBtn = card.querySelector(".save-btn");
    const cancelBtn = card.querySelector(".cancel-btn");
    const errorBox = card.querySelector(".error-message");
    let originalValues = {};

    // edit mode
    editBtn.addEventListener("click", () => {
      originalValues = {};

      card.querySelectorAll(".editable").forEach(span => {
        const field = span.dataset.field;
        originalValues[field] = span.textContent.trim();

        const input = field === "Notes" ? document.createElement("textarea") : document.createElement("input");
        input.classList.add("edit-input");
        input.name = field;
        input.value = originalValues[field];

        span.replaceWith(input);
      });

      // editable payees
      card.querySelectorAll(".editable-payee").forEach(p => {
        const name = p.dataset.name;
        const [_, amt] = p.textContent.split("|").map(s => s.trim());
        originalValues[name] = amt;

        const input = document.createElement("input");
        input.classList.add("edit-input");
        input.name = name;
        input.value = amt;

        p.innerHTML = `${name} | `;
        p.appendChild(input);
      });

      toggleButtons("edit");
      errorBox.style.display = "none";
    });

    // save edits
    saveBtn.addEventListener("click", () => {
      const inputs = card.querySelectorAll(".edit-input");
      let valid = true;
      const updated = {};

      // validate inputs
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add("error");
          valid = false;
        } else {
          input.classList.remove("error");
          updated[input.name] = input.value.trim();
        }
      });

      if (!valid) {
        errorBox.textContent = "Please fill in all required fields.";
        errorBox.style.display = "block";
        return; // stop save if invalid
      }
      errorBox.style.display = "none";

      // replace inputs with spans
      inputs.forEach(input => {
        if (card.classList.contains("division-card")) {
          const span = document.createElement("span");
          span.classList.add("editable");
          span.dataset.field = input.name;
          span.textContent = input.value;
          input.replaceWith(span);
        } else if (card.classList.contains("subject-card")) {
          if (input.closest("#PayeeHolder")) {
            const p = input.closest("p");
            p.innerHTML = `${input.name} | ${input.value}`;
          } else {
            const span = document.createElement("span");
            span.classList.add("editable");
            span.dataset.field = input.name;
            span.textContent = input.value;
            input.replaceWith(span);
          }
        }
      });

      // record in-memory edits
      updated.timestamp = new Date().toLocaleString();
      updated.context = card.classList.contains("division-card") ? "Division" : "Program";
      updated.identifier = card.dataset.division || card.dataset.program;
      inMemoryEdits.push(updated);

      console.log("Edits in memory:", inMemoryEdits);

      // show confirmation message
      alert("Changes saved!");
      toggleButtons("save");
    });

    // cancel edits
    cancelBtn.addEventListener("click", () => {
      card.querySelectorAll(".edit-input").forEach(input => {
        const name = input.name;
        const value = originalValues[name] || "";

        if (card.classList.contains("division-card")) {
          const span = document.createElement("span");
          span.classList.add("editable");
          span.dataset.field = name;
          span.textContent = value;
          input.replaceWith(span);
        } else if (card.classList.contains("subject-card")) {
          if (input.closest("#PayeeHolder")) {
            const p = input.closest("p");
            p.innerHTML = `${name} | ${value}`;
          } else {
            const span = document.createElement("span");
            span.classList.add("editable");
            span.dataset.field = name;
            span.textContent = value;
            input.replaceWith(span);
          }
        }
      });

      errorBox.style.display = "none";
      toggleButtons("cancel");
    });

    // toggle between edit and save / cancel mode
    function toggleButtons(mode) {
      if (mode === "edit") {
        editBtn.style.display = "none";
        saveBtn.style.display = "inline-block";
        cancelBtn.style.display = "inline-block";
      } else {
        editBtn.style.display = "inline-block";
        saveBtn.style.display = "none";
        cancelBtn.style.display = "none";
      }
    }
  });
});