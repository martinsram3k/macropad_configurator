document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".changelayer");
    const dots = document.querySelectorAll(".dot, .dot_active");
    const buttons = document.querySelectorAll(".key");
    const textarea = document.getElementById('keyFunction');
    const overeniElement = document.querySelector('h1.overeni_ne');

    let activeIndex = 0;
    let selectedButton = null;

    function setActiveDot(index) {
        dots.forEach(dot => dot.classList.remove("dot_active"));
        dots.forEach(dot => dot.classList.add("dot"));
        dots[index].classList.remove("dot");
        dots[index].classList.add("dot_active");
        activeIndex = index;
        console.log("Aktivní vrstva změněna na:", activeIndex + 1);
    }

    button.addEventListener("click", function () {
        activeIndex = (activeIndex + 1) % dots.length;
        setActiveDot(activeIndex);
        console.log("Tlačítko 'Change Layer' bylo zvoleno.");
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", function () {
            setActiveDot(index);
        });
    });

    buttons.forEach(function (keyDiv) {
        keyDiv.addEventListener('click', function () {
            const keyNumber = keyDiv.getAttribute('data-key');
            console.log(`Tlačítko${keyNumber} bylo vybráno.`);
            if (textarea) {
                textarea.placeholder = `Function on key ${keyNumber}`;
            } else {
                console.log("Textarea nebyla nalezena!");
            }
            selectedButton = keyNumber;
        });
    });

    document.getElementById('pushButton').addEventListener('click', function () {
        const text = textarea.value;
        const activeLayer = document.querySelector(".dot_active");
        const layerNumber = activeLayer.getAttribute("data-key");

        if (selectedButton && activeLayer && text) {
            const dataToSend = {
                button: selectedButton,
                layer: layerNumber,
                function: text
            };

            fetch('http://localhost:5000/receivedata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(`Odpověď z serveru: ${JSON.stringify(data)}`);
                    if (data.message === "Data byla úspěšně přijata.") {
                        if (overeniElement) {
                            overeniElement.textContent = "Data byla přijata správně";
                            overeniElement.classList.remove("overeni_ne");
                            overeniElement.classList.add("overeni_ano");

                            // Skryje h1 element po 5 sekundách
                            setTimeout(function () {
                                overeniElement.classList.remove("overeni_ano");
                                overeniElement.classList.add("overeni_ne"); // Přidá třídu pro skrytí
                            }, 3500);
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    if (overeniElement) {
                        overeniElement.textContent = "Chyba při odesílání dat";
                        overeniElement.classList.remove("overeni_ne");
                        overeniElement.classList.add("overeni_chyba");
                    }
                });
        } else {
            console.error("Chyba: Některé informace nejsou k dispozici.");
        }
    });
});