const menu = document.querySelector(".menu");
const navLinks = document.querySelector(".nav-links");
menu.addEventListener("click", () => {
    navLinks.classList.toggle("mobile-menu");
});

const boutonModifierWhere = document.getElementById("modifierWhere");
boutonModifierWhere.addEventListener("click", () => {
    localStorage.setItem("Modif", true);
    localStorage.setItem("ModifSpe", true);
    location.reload();
});