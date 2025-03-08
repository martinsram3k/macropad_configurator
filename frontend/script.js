document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".changelayer");
    const dots = document.querySelectorAll(".dot, .dot_active");

    let activeIndex = 0; // Nastavení první aktivní tečky

    function setActiveDot(index) {
        // Odstraníme aktivní třídu ze všech teček
        dots.forEach(dot => dot.classList.remove("dot_active"));
        dots.forEach(dot => dot.classList.add("dot"));

        // Nastavíme aktivní třídu na vybranou tečku
        dots[index].classList.remove("dot");
        dots[index].classList.add("dot_active");

        activeIndex = index; // Aktualizujeme aktivní index
    }

    // Přepínání vrstev tlačítkem "Change Layer"
    button.addEventListener("click", function () {
        activeIndex = (activeIndex + 1) % dots.length;
        setActiveDot(activeIndex);
    });

    // Kliknutí přímo na tečku pro změnu vrstvy
    dots.forEach((dot, index) => {
        dot.addEventListener("click", function () {
            setActiveDot(index);
        });
    });
});


