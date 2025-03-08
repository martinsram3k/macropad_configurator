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

//Při kliknutí na jakýkoli div s třídou "key"
document.querySelectorAll('.key').forEach(function(keyDiv) {
    keyDiv.addEventListener('click', function() {
        // Získáme číslo klíče (data-key)
        const keyNumber = keyDiv.getAttribute('data-key');
        const textarea = document.getElementById('keyFunction');

        // Debugging log pro zajištění, že textarea je správně vybraná
        if (textarea) {
            console.log("Změna placeholderu na: Function on key " + keyNumber); // Debugging log
            // Změníme placeholder na základě čísla divu
            textarea.placeholder = `Function on key ${keyNumber}`;
            
            // Po změně placeholderu přidáme log pro ověření
            console.log("Aktuální placeholder: ", textarea.placeholder);
        } else {
            console.log("Textarea nebyla nalezena!");
        }
    });
});


