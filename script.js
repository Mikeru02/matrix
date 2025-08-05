const routes = {
    "bulakan-balagtas": [
        "bagumbayan",
        "san jose",
        "matungao",
        "panginay guiguinto",
        "panginay balagtas",
        "wawa"
    ],
    "bulakan-guiguinto": [
        "bagumbayan",
        "san jose",
        "matungao",
        "tuktukan"
    ],
    "bulakan-malolos": [
        "bagumbayan",
        "san jose",
        "maysantol",
        "san nicolas",
        "pitpitan",
        "mambog",
        "matimbo",
        "panasahan",
        "bagna",
        "atlag",
        "san juan",
        "sto. rosario"
    ]
}

for (const key in routes) {
    const parts = key.split("-");
    if (parts.length === 2) {
        const reversedKey = `${parts[1]}-${parts[0]}`;
        if (!routes[reversedKey]) {
            routes[reversedKey] = [...routes[key]].reverse();
        }
    }
}

function populatePlaceDiv(places) {
    const placeDiv = document.getElementById("places");
    placeDiv.innerHTML = ""; // Clear previous content

    if (!places || places.length === 0) {
        placeDiv.textContent = "No places found for this route.";
        return;
    }

    // Create a container for the radio buttons
    const form = document.createElement("form");

    for (let i = 0; i < places.length; i++) {
        const place = places[i];

        const label = document.createElement("label");
        label.style.display = "block"; // one per line

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "place"; // same name so only one can be selected
        radio.value = place;
        radio.id = `place-${i}`;

        label.htmlFor = radio.id;
        label.appendChild(radio);
        label.append(` ${place}`); // text label next to radio

        form.appendChild(label);
    }

    placeDiv.appendChild(form);
}

const route = document.getElementById("route");

route.addEventListener("change", function() {
    const routeValue = route.value.toLowerCase();
    const places = routes[routeValue];

    console.log(places);
    populatePlaceDiv(places);
});

// Fare Calculation
function calculateMergedStops(routeArray, destination) {
    const merged = [];

    for (let i = 0; i < routeArray.length; i++) {
        const current = routeArray[i];
        const next = routeArray[i + 1];

        if (current === "bagumbayan" && next === "san jose") {
            merged.push("bagumbayan-san jose");
            i++;
        } else if (current === "san juan" && next === "sto. rosario") {
            merged.push("san juan-sto. rosario");
            i++;
        } else {
            merged.push(current);
        }
    }

    for (let i = 0; i < merged.length; i++) {
        if (
            merged[i] === destination ||
            merged[i].includes(destination) ||
            destination.includes(merged[i])
        ) {
            return i + 1;
        }
    }

    return 0;
}

function calculateFare(passengerType, stops) {
    const isDiscounted = passengerType === "student" || passengerType === "senior";
    const base = isDiscounted ? 11 : 13;

    if (stops <= 4) {
        return base;
    }

    return base + (stops - 4) * 2;
}

function getSelectedRadioValue(name) {
    const selected = document.querySelector(`input[name='${name}']:checked`);
    return selected ? selected.value : null;
}

// Calculate button logic
document.getElementById("calculate").addEventListener("click", () => {
    const routeValue = document.getElementById("route").value.toLowerCase();
    const places = routes[routeValue];

    if (!places) return alert("Please select a valid route.");

    const destination = getSelectedRadioValue("place");
    const passengerType = getSelectedRadioValue("fare");
    const payment = parseFloat(document.getElementById("payment").value);
    const quantity = parseInt(document.getElementById("custom-qty").value);

    if (!destination || !passengerType || isNaN(payment) || isNaN(quantity)) {
        alert("Please fill in all inputs.");
        return;
    }

    const stops = calculateMergedStops(places, destination);
    const fare = calculateFare(passengerType, stops);
    const total = fare * quantity;
    const change = payment - total;

    document.getElementById("change").textContent = change;
});