const toggleBtn = document.getElementById("toggleBtn");
const icon = toggleBtn.querySelector("i");
const btnText = toggleBtn.querySelector("span");

toggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  btnText.textContent = isDark ? "Light Mode" : "Dark Mode";
});
