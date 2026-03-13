const list = document.getElementById("list");
const addBtn = document.getElementById("addBtn");
const input = document.getElementById("itemInput");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addBtn.click();
});

addBtn.addEventListener("click", () => {
  if (input.value === "") {
    alert("kya kar raha hai bhai, value toh dal!");
    return;
  }

  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.classList.add("delete");

  const textSpan = document.createElement("span");
  textSpan.textContent = input.value;
  li.appendChild(textSpan);

  li.addEventListener("dblclick", () => {
    if (li.classList.contains("editing")) return;
    li.classList.add("editing");

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = textSpan.textContent;
    editInput.classList.add("edit-input");

    li.replaceChild(editInput, textSpan);
    editInput.focus();
    editInput.select();

    const finishEdit = () => {
      const newVal = editInput.value.trim();
      if (newVal) textSpan.textContent = newVal;
      li.replaceChild(textSpan, editInput);
      li.classList.remove("editing");
    };

    editInput.addEventListener("blur", finishEdit);
    editInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") editInput.blur();
      if (e.key === "Escape") {
        editInput.value = textSpan.textContent;
        editInput.blur();
      }
    });
  });

  delBtn.addEventListener("click", () => {
    li.remove();
  });

  li.appendChild(delBtn);
  list.appendChild(li);

  input.value = "";
});
