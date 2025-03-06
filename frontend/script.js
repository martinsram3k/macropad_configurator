document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".changelayer");
    const dots = document.querySelectorAll(".dot, .dot_active");

    let activeIndex = 0; // Nastavení první aktivní tečky

    button.addEventListener("click", function () {
        // Najdeme aktuálně aktivní tečku
        const currentDot = document.querySelector(".dot_active");
        
        if (currentDot) {
            currentDot.classList.remove("dot_active");
            currentDot.classList.add("dot");
        }

        // Posuneme index na další tečku (cyklicky)
        activeIndex = (activeIndex + 1) % dots.length;

        // Přidáme aktivní třídu nové tečce
        dots[activeIndex].classList.remove("dot");
        dots[activeIndex].classList.add("dot_active");
    });
});
