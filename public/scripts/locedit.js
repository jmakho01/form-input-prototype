document.addEventListener("DOMContentLoaded", () => {
  const allCards = document.querySelectorAll(".division-card, .subject-card"); //selecting both cards

  allCards.forEach(card => {
    const editBtn = card.querySelector(".edit-btn");
    const saveBtn = card.querySelector(".save-btn");
    const cancelBtn = card.querySelector(".cancel-btn");
    const errorBox = card.querySelector(".error-message");
    const payeeControls = card.querySelector(".payee-controls");

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
      const payeeHolder = card.querySelector(".payee-holder");
      if (payeeHolder) {
        payeeHolder.querySelectorAll(".editable-payee").forEach(p => {
          const name = p.querySelector(".payee-name").textContent.trim();
          const amount = p.querySelector(".payee-amount").textContent.trim();

          originalValues[name] = amount;

          // Form start
          p.innerHTML = `
            <input class="edit-input payee-name-input" value="${name}">
            |
            <input class="edit-input payee-amount-input" value="${amount}">
            <button class="remove-payee">X</button>
          `;
          // Form when posted, push new data where data matches before-edits
        });
      }

      if (payeeControls) payeeControls.style.display = "block";

      toggleButtons("edit");
      errorBox.style.display = "none";
    });

    // payee events (adding and removing)
    card.addEventListener("click", (e) => {
      const payeeHolder = card.querySelector(".payee-holder");

      // adding
      if (e.target.classList.contains("add-payee")) {
        const p = document.createElement("p");
        p.classList.add("editable-payee");
        p.innerHTML = `
          <input class="edit-input payee-name-input" placeholder="Name">
          |
          <input class="edit-input payee-amount-input" placeholder="Amount">
          <button class="remove-payee">X</button>
        `;
        payeeHolder.appendChild(p);
      }

      // removing
      if (e.target.classList.contains("remove-payee")) {
        e.target.closest("p").remove();
      }
    });

    // save edits
    saveBtn.addEventListener("click", async () => {
      const inputs = card.querySelectorAll(".edit-input");
      const updated = {};
      let valid = true;

      // validate inputs
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add("error");
          valid = false;
        } else {
          input.classList.remove("error");
        }
      });

      if (!valid) {
        errorBox.textContent = "Please fill in all required fields.";
        errorBox.style.display = "block";
        return;
      }

      errorBox.style.display = "none";

      // restore original view mode
      if (card.classList.contains("division-card")) {
        inputs.forEach(input => updated[input.name] = input.value);

      } else if (card.classList.contains("subject-card")) {
        updated.Payees = {};
        const payeeHolder = card.querySelector(".payee-holder");

        // save payees
        payeeHolder.querySelectorAll(".editable-payee").forEach(p => {
          const name = p.querySelector(".payee-name-input").value.trim();
          const amount = p.querySelector(".payee-amount-input").value.trim();
          updated.Payees[name] = amount;
        });

        // save other fields
        inputs.forEach(input => {
          if (!input.closest(".editable-payee")) {
            updated[input.name] = input.value;
          }
        });

        updated.UnderReview = false;

        // Also update the checkbox in the UI immediately
        const reviewCheckbox = card.querySelector(".toggle-under-review");
        if (reviewCheckbox) reviewCheckbox.checked = false;
      }

      // send data to server
      try {
        const response = await fetch('/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: card.classList.contains("division-card") ? "Division" : "Program",
            identifier: card.classList.contains("division-card") 
              ? card.dataset.division 
              : card.dataset.program,
            updates: updated
          })
        });

        const result = await response.json();

        if (result.success) {
          // Update DOM with saved values
          inputs.forEach(input => {
            if (!input.closest(".editable-payee")) {
              const span = document.createElement("span");
              span.classList.add("editable");
              span.dataset.field = input.name;
              span.textContent = input.value;
              input.replaceWith(span);
            }
          });

          // Update payees
          const payeeHolder = card.querySelector(".payee-holder");
          if (payeeHolder) {
            payeeHolder.innerHTML = "";
            Object.entries(updated.Payees || {}).forEach(([name, amount]) => {
              const p = document.createElement("p");
              p.classList.add("editable-payee");
              p.innerHTML = `
                <span class="payee-name">${name}</span> |
                <span class="payee-amount">${amount}</span>
                <button class="remove-payee" style="display:none;">X</button>
              `;
              payeeHolder.appendChild(p);
            });
          }

          if (payeeControls) payeeControls.style.display = "none";
          toggleButtons("save");
          alert("Database updated successfully!");
        } else {
          errorBox.textContent = result.error || "Error updating database.";
          errorBox.style.display = "block";
        }
      } catch (err) {
        console.error(err);
        errorBox.textContent = "Network/server error.";
        errorBox.style.display = "block";
      }
    });

    // cancel edits
    cancelBtn.addEventListener("click", () => {
      // restore fields
      card.querySelectorAll(".edit-input").forEach(input => {
        const name = input.name;
        const original = originalValues[name] || "";

        if (!input.closest(".editable-payee")) {
          const span = document.createElement("span");
          span.classList.add("editable");
          span.dataset.field = name;
          span.textContent = original;
          input.replaceWith(span);
        }
      });

      // restore payees
      const payeeHolder = card.querySelector(".payee-holder");
      if (payeeHolder) {
        payeeHolder.innerHTML = "";

        Object.entries(originalValues).forEach(([name, amount]) => {
          if (!isNaN(amount)) {
            const p = document.createElement("p");
            p.classList.add("editable-payee");
            p.innerHTML = `
              <span class="payee-name">${name}</span> |
              <span class="payee-amount">${amount}</span>
              <button class="remove-payee" style="display:none;">X</button>
            `;
            payeeHolder.appendChild(p);
          }
        });
      }

      if (payeeControls) payeeControls.style.display = "none";

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

  const showReview = document.getElementById("show-under-review");
  const programSelect = document.getElementById("programs");
  const divSelect = document.getElementById("divs");
  const subjectCards = document.querySelectorAll(".subject-card");

  showReview.addEventListener('change', () => {
    const showOnlyReview = showReview.checked;

    if (showOnlyReview) {
        // hide all divisions
        document.querySelectorAll(".division-card").forEach(div => {
            div.style.display = "none";
        });

        // only show programs under review
        subjectCards.forEach(card => {
            const isUnderReview = card.querySelector(".toggle-under-review").checked;
            card.style.display = isUnderReview ? "block" : "none";
        });

        // disable dropdowns for divisions and programs when checkbox is checked
        divSelect.disabled = true;
        programSelect.disabled = true;
        return;
    }

    // restore dropdown functionality when checkbox is unchecked
    divSelect.disabled = false;
    programSelect.disabled = false;

    // restore normal filtering
    divSelect.dispatchEvent(new Event("change"));
    programSelect.dispatchEvent(new Event("change"));
  });

  // when a division is selected, populate program list
  divSelect.addEventListener("change", () => {
    const division = divSelect.value;

    // if filtering by programs under review, don't repopulate program list
    if (showReview.checked) {
        programSelect.innerHTML = `<option>All Programs</option>`;
        return;
    }

    // clear old program options
    programSelect.innerHTML = `<option>All Programs</option>`;

    // fill program dropdown with programs from selected division
    subjectCards.forEach(card => {
      if (division === "All Divisions" || card.dataset.division === division) {
        const opt = document.createElement("option");
        opt.value = card.dataset.program;
        opt.textContent = card.dataset.program;
        programSelect.appendChild(opt);
      }
    });

      // trigger filtering
      programSelect.dispatchEvent(new Event("change"));
    });

    // filter subject-cards by program
    programSelect.addEventListener("change", () => {
        const chosenProgram = programSelect.value;
        const chosenDivision = divSelect.value;

        subjectCards.forEach(card => {
            const divMatch = (chosenDivision === "All Divisions" || card.dataset.division === chosenDivision);
            const progMatch = (chosenProgram === "All Programs" || card.dataset.program === chosenProgram);

            card.style.display = (divMatch && progMatch) ? "block" : "none";
        });
    });
});