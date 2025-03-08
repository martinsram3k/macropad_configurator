document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".changelayer");  // Tlačítko pro změnu vrstvy
    const dots = document.querySelectorAll(".dot, .dot_active");  // Tečky pro vrstvy
    const buttons = document.querySelectorAll(".key");  // Tlačítka s funkcemi

    let activeIndex = 0;  // Počáteční index aktivní tečky
    let selectedButton = null;  // Pro sledování vybraného tlačítka

    function setActiveDot(index) {
        // Odstranit aktivní třídu ze všech teček
        dots.forEach(dot => dot.classList.remove("dot_active"));
        dots.forEach(dot => dot.classList.add("dot"));

        // Nastavit aktivní třídu na vybranou tečku
        dots[index].classList.remove("dot");
        dots[index].classList.add("dot_active");

        activeIndex = index;  // Aktualizovat aktivní index
        console.log("Aktivní vrstva změněna na:", activeIndex + 1);  // Oznámit změnu vrstvy
    }

    // Přepínání vrstev tlačítkem "Change Layer"
    button.addEventListener("click", function () {
        activeIndex = (activeIndex + 1) % dots.length;  // Přepnout vrstvu
        setActiveDot(activeIndex);
        console.log("Tlačítko 'Change Layer' bylo zvoleno.");
    });

    // Kliknutí přímo na tečku pro změnu vrstvy
    dots.forEach((dot, index) => {
        dot.addEventListener("click", function () {
            setActiveDot(index);  // Nastavit aktivní tečku
        });
    });

    // Při kliknutí na jakýkoli div s třídou "key" (klávesa)
    buttons.forEach(function(keyDiv) {
        keyDiv.addEventListener('click', function() {
            // Získat číslo klíče (data-key)
            const keyNumber = keyDiv.getAttribute('data-key');
            const textarea = document.getElementById('keyFunction');

            // Oznamujeme, že tlačítko bylo vybráno
            console.log(`Tlačítko${keyNumber} bylo vybráno.`);  // Bez mezery mezi Button a číslem

            // Změníme placeholder na základě čísla divu
            if (textarea) {
                textarea.placeholder = `Function on key ${keyNumber}`;
            } else {
                console.log("Textarea nebyla nalezena!");
            }

            // Nastavíme vybrané tlačítko
            selectedButton = keyNumber;  // Uložení vybraného tlačítka
        });
    });

    // Přidání event listener pro tlačítko "Push changes"
    document.getElementById('pushButton').addEventListener('click', function() {
        const textarea = document.getElementById('keyFunction');
        const text = textarea.value;

        // Získání čísla aktivní vrstvy
        const activeLayer = document.querySelector(".dot_active");

        // Zkontrolujeme, zda byla aktivní vrstva správně nalezena
        if (activeLayer) {
            const layerNumber = activeLayer.getAttribute("data-key");

            // Výstup v požadovaném formátu bez mezery mezi písmenem a číslem
            console.log("Button" + selectedButton + ", Layer" + layerNumber + ", Funkce" + text);  // Bez mezer
        } else {
            console.log("Aktivní vrstva nebyla nalezena.");
        }

        // Vypíšeme text z textarea a další informace
        console.log("Text z textarea:", text);
        console.log("Tlačítko: Push");
    });
});

 // Odeslání dat na server při kliknutí na tlačítko
        document.getElementById('pushButton').addEventListener('click', function() {
            const dataToSend = {
                button: currentButton,
                layer: currentLayer,
                function: currentFunction
            };

            fetch('/receiveData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            })
            .then(response => response.json())
            .then(data => {
                console.log(`Odpověď z serveru: ${JSON.stringify(data)}`);
            })
            .catch(error => console.error('Error:', error));
        });