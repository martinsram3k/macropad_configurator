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

    // Element pro stav serveru
    const serverStatusItem = document.querySelector('.menu-item[data-key="server_status"]');
    let serverStatusIcon = serverStatusItem ? serverStatusItem.querySelector('img') : null;
    let serverStatusText = serverStatusItem ? serverStatusItem.querySelector('.menu-text') : null;

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
                console.log("Obsah textarea vymazán, placeholder zůstal.");
            }
        });
    } else {
        console.log("Tlačítko pro vymazání nebylo nalezeno.");
    }

    async function sendDataToServer() {
        if (!pushButton || pushButton.disabled) {
            console.log("Odeslání dat na macropad zablokováno, protože server je offline.");
            return;
        }
    
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
    
                if (data.status === "success" && data.message === "Data received and sent to serial port") {
                    showSuccessMessage("Data byla přijata správně");
                } else if (data.status === "info" && data.message === "Serial port functionality is currently disabled.") {
                    showInfoMessage("Funkce sériového portu deaktivovány");
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

    function showInfoMessage(message) {
        overeniElement.textContent = message;
        overeniElement.classList.remove("overeni_ne");
        overeniElement.classList.add("overeni_info");
        setTimeout(() => {
            overeniElement.classList.remove("overeni_info");
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

    // Funkce pro aktualizaci stavu serveru
    function updateServerStatus(isOnline) {
        if (serverStatusItem && serverStatusIcon && serverStatusText) {
            if (isOnline) {
                serverStatusIcon.src = 'icon/online_server.svg';
                serverStatusText.textContent = 'Server Online';
                serverStatusItem.title = 'Server je online';
            } else {
                serverStatusIcon.src = 'icon/offline_server.svg';
                serverStatusText.textContent = 'Server Offline';
                serverStatusItem.title = 'Server je offline';
            }
        }
    }

    // Volání funkce pro aktualizaci stavu serveru při načtení stránky
    // Předpokládáme, že server je zpočátku offline
    updateServerStatus(false);

    // Zde můžete přidat logiku pro kontrolu stavu serveru
    // Například pomocí požadavku na váš Flask backend a podle odpovědi
    // aktualizovat stav serveru.
    fetch('http://localhost:5000/status') // Přidejte nový endpoint na serveru
        .then(response => response.json())
        .then(data => {
            if (data.status === 'online') {
                updateServerStatus(true);
            } else {
                updateServerStatus(false);
            }
        })
        .catch(error => {
            console.error('Chyba při kontrole stavu serveru:', error);
            updateServerStatus(false); // Pokud se nepodaří spojit, předpokládáme offline
        });

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

// Element pro stav serveru
const serverStatusItem = document.querySelector('.menu-item[data-key="server_status"]');
let serverStatusIcon = serverStatusItem ? serverStatusItem.querySelector('img') : null;
let serverStatusText = serverStatusItem ? serverStatusItem.querySelector('.menu-text') : null;
const pushButton = document.getElementById('pushButton');



// Funkce pro aktualizaci stavu serveru z backendu
async function updateServerStatusFromBackend() {
    const serverStatusButton = document.querySelector('.menu-item[data-key="server_status"]');

    if (!serverStatusButton) {
        console.warn("Element pro stav serveru nebyl nalezen.");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/status');
        if (!response.ok) {
            console.error(`Chyba HTTP: ${response.status}`);
            updateServerStatus(false, 'Error');
            updatePushButtonState(false);
            serverStatusButton.title = 'Server Status: Error'; // Aktualizace title tlačítka při chybě
            return;
        }
        const data = await response.json();
        if (data && data.status) {
            let statusText = '';
            let isOnline = false;
            let buttonTitle = 'Server Status: ';

            switch (data.status) {
                case 'loading':
                    statusText = 'Loading';
                    buttonTitle += 'Loading';
                    break;
                case 'online':
                    statusText = 'Online';
                    isOnline = true;
                    buttonTitle += `Online (Ping: ${data.ping}ms, Port: ${data.port})`;
                    break;
                case 'offline':
                    statusText = 'Loading';
                    updateServerStatus(false, statusText);
                    updatePushButtonState(false);
                    buttonTitle += 'Offline';
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    statusText = 'Offline';
                    updateServerStatus(false, statusText);
                    updatePushButtonState(false);
                    buttonTitle = 'Server Status: Offline';
                    isOnline = false;
                    break;
                default:
                    statusText = 'Unknown';
                    buttonTitle += 'Unknown';
                    isOnline = false;
                    break;
            }
            if (data.status !== 'offline') {
                updateServerStatus(isOnline, statusText);
                updatePushButtonState(isOnline);
                serverStatusButton.title = buttonTitle; // Aktualizace title tlačítka
            } else {
                serverStatusButton.title = buttonTitle; // Aktualizace title tlačítka pro offline
            }
        } else {
            updateServerStatus(false, 'Error');
            updatePushButtonState(false);
            serverStatusButton.title = 'Server Status: Error'; // Aktualizace title tlačítka při neplatné odpovědi
            console.warn('Neplatná odpověď z /status endpointu:', data);
        }
    } catch (error) {
        console.error('Chyba při dotazu na stav serveru:', error);
        updateServerStatus(false, 'Error');
        updatePushButtonState(false);
        serverStatusButton.title = 'Server Status: Error'; // Aktualizace title tlačítka při chybě dotazu
    }
}



// Funkce pro aktualizaci zobrazení stavu serveru v HTML
function updateServerStatus(isOnline, statusText) {
    if (serverStatusItem && serverStatusIcon && serverStatusText) {
        if (statusText === 'Loading') {
            serverStatusIcon.src = 'icon/loading_server.svg';
            serverStatusText.textContent = 'Server Loading';
            serverStatusItem.title = 'Server se načítá';
            serverStatusItem.classList.remove('server-online', 'server-offline');
            serverStatusItem.classList.add('server-loading');
        } else if (isOnline) {
            serverStatusIcon.src = 'icon/online_server.svg';
            serverStatusText.textContent = 'Server Online';
            serverStatusItem.title = 'Server je online';
            serverStatusItem.classList.remove('server-loading', 'server-offline');
            serverStatusItem.classList.add('server-online');
        } else {
            serverStatusIcon.src = 'icon/offline_server.svg';
            serverStatusText.textContent = 'Server Offline';
            serverStatusItem.title = 'Server je offline';
            serverStatusItem.classList.remove('server-loading', 'server-online');
            serverStatusItem.classList.add('server-offline');
        }
    }
}

// Funkce pro aktualizaci stavu tlačítka Push
function updatePushButtonState(isServerOnline) {
    if (pushButton) {
        if (isServerOnline) {
            pushButton.disabled = false;
            pushButton.classList.remove('fade-out'); // Odebrat třídu pro fade-out
            pushButton.classList.add('fade-in');    // Přidat třídu pro fade-in
            pushButton.style.cursor = 'pointer';
        } else {
            pushButton.disabled = true;
            pushButton.classList.remove('fade-in');     // Odebrat třídu pro fade-in
            pushButton.classList.add('fade-out');    // Přidat třídu pro fade-out
            pushButton.style.cursor = 'not-allowed';
        }
    }
}


// Volání funkce pro aktualizaci stavu serveru při načtení stránky
updateServerStatusFromBackend();
updatePushButtonState(false); // Nastavit počáteční stav tlačítka na offline

// Nastavení intervalu pro periodickou aktualizaci stavu (např. každé 3 sekundy)
setInterval(updateServerStatusFromBackend, 3000);

