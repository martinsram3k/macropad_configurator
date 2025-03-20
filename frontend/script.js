document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".changelayer");
    const dots = document.querySelectorAll(".dot, .dot_active");
    const buttons = document.querySelectorAll(".key");
    const textarea = document.getElementById('keyFunction');
    const overeniElement = document.querySelector('h1.overeni_ne');
    const pushButton = document.getElementById('pushButton');

    // Přidáno pro informační okno
    const menuItems = document.querySelectorAll('.menu-item');
    const infoWindow = document.getElementById('infoWindow');
    const infoContent = document.getElementById('infoContent');

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
            // Přidání vizuální zpětné vazby pro vybrané tlačítko
            buttons.forEach(btn => btn.classList.remove('selected'));
            keyDiv.classList.add('selected');
        });
    });

    async function sendDataToServer() {
        const text = textarea.value;
        const activeLayer = document.querySelector(".dot_active");
        const layerNumber = activeLayer.getAttribute("data-key");

        if (selectedButton && activeLayer && text) {
            const dataToSend = {
                button: selectedButton,
                layer: layerNumber,
                function: text
            };

            try {
                pushButton.disabled = true; // Deaktivace tlačítka
                const response = await fetch('http://localhost:5000/receivedata', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                });

                const data = await response.json();
                console.log(`Odpověď z serveru: ${JSON.stringify(data)}`);

                if (data.message === "Data byla úspěšně přijata.") {
                    showSuccessMessage("Data byla přijata správně");
                } else {
                    showErrorMessage("Chyba při odesílání dat");
                }
            } catch (error) {
                console.error('Error:', error);
                showErrorMessage("Chyba při odesílání dat");
            } finally {
                pushButton.disabled = false; // Aktivace tlačítka
            }
        } else {
            console.error("Chyba: Některé informace nejsou k dispozici.");
        }
    }

    function showSuccessMessage(message) {
        overeniElement.textContent = message;
        overeniElement.classList.remove("overeni_ne");
        overeniElement.classList.add("overeni_ano");
        setTimeout(() => {
            overeniElement.classList.remove("overeni_ano");
            overeniElement.classList.add("overeni_ne");
        }, 3500);
    }

    function showErrorMessage(message) {
        overeniElement.textContent = message;
        overeniElement.classList.remove("overeni_ne");
        overeniElement.classList.add("overeni_ano");
        setTimeout(() => {
            overeniElement.classList.remove("overeni_ano");
            overeniElement.classList.add("overeni_ne");
        }, 3500);
    }

    pushButton.addEventListener('click', sendDataToServer);

    // Přidáno pro informační okno
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            const info = this.getAttribute('data-info');
            infoContent.textContent = info;
            infoWindow.style.display = 'block';
        });

        item.addEventListener('mouseleave', function () {
            infoWindow.style.display = 'none';
        });
    });
});