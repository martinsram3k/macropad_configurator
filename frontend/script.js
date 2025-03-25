document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".changelayer");
    const dots = document.querySelectorAll(".dot, .dot_active");
    const buttons = document.querySelectorAll(".key");
    const textarea = document.getElementById('keyFunction');
    const clearButton = document.querySelector('.clear-button');
    const overeniElement = document.querySelector('h1.overeni_ne');
    const pushButton = document.getElementById('pushButton');

    // Přidáno pro informační okno
    const menuItems = document.querySelectorAll('.menu-item');
    const infoWindow = document.getElementById('infoWindow');
    const infoContent = document.getElementById('infoContent');

    // Nově přidané pro zpracování kliknutí na submenu položky
    const submenuItems = document.querySelectorAll('.submenu a'); // Změna výběru na 'a' tagy

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

    // Původní listener pro tlačítka v keypadu (nyní upravený)
    buttons.forEach(function (keyDiv) {
        keyDiv.addEventListener('click', function () {
            const keyNumber = keyDiv.getAttribute('data-key');
            console.log(`Tlačítko${keyNumber} bylo vybráno.`);
            if (textarea) {
                textarea.placeholder = `Function on key  ${keyNumber} `;
                selectedButton = keyNumber;
                buttons.forEach(btn => btn.classList.remove('selected'));
                keyDiv.classList.add('selected');
            } else {
                console.log("Textarea nebyla nalezena!");
            }
        });
    });

    // Přidání listeneru pro kliknutí na položky v submenu
    submenuItems.forEach(function (submenuLink) { // Změna 'submenuItem' na 'submenuLink'
        submenuLink.addEventListener('click', function (event) {
            event.preventDefault(); // Zabraňuje standardnímu chování odkazu (pokud by tam byl)
            const keyFunctionDiv = this.querySelector('div[data-key]');
            if (keyFunctionDiv) {
                const keyFunctionValue = keyFunctionDiv.getAttribute('data-key');
                if (textarea) {
                    textarea.value = keyFunctionValue;
                    console.log(`Nastavena funkce: ${keyFunctionValue}`);
                } else {
                    console.log("Textarea nebyla nalezena!");
                }
            }
        });
    });

    // Listener pro kliknutí na tlačítko pro vymazání
    if (clearButton) {
        clearButton.addEventListener('click', function () {
            if (textarea) {
                textarea.value = ''; // Vymazání obsahu textarea
                // textarea.placeholder = 'Function on key  X '; // Resetování placeholderu
                console.log("Obsah textarea vymazán.");
            }
        });
    } else {
        console.log("Tlačítko pro vymazání nebylo nalezeno.");
    }

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

document.addEventListener("DOMContentLoaded", function () {
    const sidenav = document.querySelector('.sidenav');
    let activeSubmenu = null;

    sidenav.addEventListener('click', function (event) {
        let target = event.target;

        // Pokud je cíl události uvnitř <li>, nastavíme target na <li>
        if (target.closest('li')) {
            target = target.closest('li');
        }

        if (target.tagName === 'LI') { // Kontrola, zda je cíl <li>
            const submenu = target.querySelector('.submenu');

            // Skrytí všech ostatních submenu
            document.querySelectorAll('.submenu').forEach(item => {
                if (item !== submenu) {
                    item.style.display = 'none';
                }
            });

            // Zobrazení submenu pro kliknuté <li>
            submenu.style.display = 'block';
            activeSubmenu = submenu; // Uložení aktivního submenu
        }
    });

    document.addEventListener('click', function (event) {
        if (activeSubmenu && !event.target.closest('.submenu') && !event.target.closest('li')) {
            activeSubmenu.style.display = 'none';
            activeSubmenu = null;
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const sidenav = document.querySelector('.sidenav');
    let activeSubmenu = null;

    sidenav.addEventListener('click', function (event) {
        let target = event.target;

        if (target.closest('li')) {
            target = target.closest('li');
        }

        if (target.tagName === 'LI') {
            const submenu = target.querySelector('.submenu');

            document.querySelectorAll('.submenu').forEach(item => {
                if (item !== submenu) {
                    item.style.display = 'none';
                }
            });

            submenu.style.display = 'block';
            activeSubmenu = submenu;

            // Dynamické nastavení šířky submenu
            submenu.style.width = 'fit-content'; // Nebo jiná požadovaná šířka
            sidenav.style.width = '105vh'; // Nebo jiná požadovaná š
        }
    });

    // Nový listener pro skrytí submenu při odjezdu myši z sidenav
    sidenav.addEventListener('mouseleave', function () {
        if (activeSubmenu) {
            activeSubmenu.style.display = 'none';
            activeSubmenu = null;
            sidenav.style.width = 'fit-content'; // Nastavení původní šířky
        }
    });

    document.addEventListener('click', function (event) {
        if (activeSubmenu && !event.target.closest('.submenu') && !event.target.closest('li')) {
            activeSubmenu.style.display = 'none';
            activeSubmenu = null;
            sidenav.style.width = 'fit-content'; // Nastavení původní šířky
        }
    });
});