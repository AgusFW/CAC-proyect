
document.addEventListener("DOMContentLoaded", function () {
    const img = document.querySelector(".fade-in");
    img.classList.add("loaded");
  });

document.getElementById('navbar-toggle').addEventListener('click', function() {
    const navbarMenu = document.getElementById('navbar-menu');
    navbarMenu.classList.toggle('active');
});
