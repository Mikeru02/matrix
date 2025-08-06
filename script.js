const routes = {
    "bulakan-balagtas": {
        "bulakan": [
            "bagumbayan / san jose",
            "matungao",
            "panginay guiguinto",
            "panginay balagtas",
            "wawa"
        ],
        "balagtas": [
            "wawa",
            "panginay balagtas",
            "panginay guiguinto",
            "matungao",
            "bagumbayan / san jose"
        ]
    },
    "bulakan-guiguinto": {
        "bulakan": [
            "bagumbayan / san jose",
            "matungao",
            "tuktukan"
        ],
        "guiguinto": [
            "tuktukan",
            "matungao",
            "bagumbayan / san jose"
        ]
    },
    "bulakan-malolos": {
        "bulakan": [
            "bagumbayan / san jose",
            "maysantol",
            "san nicolas",
            "pitpitan",
            "mambog",
            "matimbo",
            "panasahan",
            "bagna",
            "atlag",
            "san juan / sto rosario",
        ],
        "malolos": [
            "san juan / sto rosario",
            "atlag",
            "bagna",
            "panasahan",
            "matimbo",
            "mambog",
            "pitpitan",
            "san nicolas",
            "maysantol",
            "bagumbayan / san jose"
        ]
    }
}

let available_places;
const route = document.getElementById("route");
const originContainer = document.getElementById("origin");
const destinationContainer = document.getElementById("destination");
const routeStartContainer = document.getElementById("route-start");
const changeContainer = document.getElementById("change");
const calculateButton = document.getElementById("calculate");

route.addEventListener("change", function(){
    const selectedRoute = route.value;
    routeStartContainer.innerHTML = "";
    const route_available = routes[selectedRoute];
    
    const placeholder = document.createElement("option");
    placeholder.textContent = "--- Select Start ---";
    routeStartContainer.appendChild(placeholder);

    for (const key in route_available) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key
        routeStartContainer.appendChild(option)
    };

    populateDiv(originContainer, destinationContainer, route_available)
});

calculateButton.addEventListener("click", function() {
    const selectedOrigin = document.querySelector('input[name="origin"]:checked');
    const selectedDestination = document.querySelector('input[name="destination"]:checked');
    const passengerType = document.querySelector('input[name="fare"]:checked').value;
    const payment = parseInt(document.querySelector('input[name="payment"]:checked').value);
    const quantity = parseInt(document.getElementById("custom-qty").value);

    if (selectedOrigin && selectedDestination && selectedOrigin && selectedDestination && passengerType && payment && quantity) {
        const originValue = selectedOrigin.value;
        const destinationValue = selectedDestination.value;

        const originIndex = available_places.indexOf(originValue);
        const destinationIndex = available_places.indexOf(destinationValue);

        const fare = calculateFare(originIndex, destinationIndex, passengerType);
        console.log(fare)
        const subtotal = fare * quantity;
        const change = payment - subtotal;
        console.log(payment)
        changeContainer.textContent = change;
        
    } else {
        window.alert("Select Origin and Destination");
    }
})

function populateDiv(originContainer, destinationContainer, routes_available) {
    const routeStart = document.getElementById("route-start");

    routeStart.addEventListener("change", function() {
        originContainer.innerHTML = "";
        destinationContainer.innerHTML = "";
        const stops = routes_available[routeStart.value];
        available_places = stops;
        createRadio(originContainer, stops);
        createRadio(destinationContainer, stops);
    })
}

function createRadio(container, places) {
    places.forEach(place => {
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = container.getAttribute("data-value");
        radio.value = place;
        radio.id = place;

        const label = document.createElement("label");
        label.htmlFor = place;
        label.textContent = place.charAt(0) + place.slice(1);

        container.appendChild(radio);
        container.appendChild(label);
    })
}

function calculateFare(originIndex, destinationIndex, passengerType) {
    let minimumFare;
    if (passengerType === "student" || passengerType === "senior") {
        minimumFare = 11;
    } else {
        minimumFare = 13;
    }
    const baseDistance = 4;
    const additionalFarePerStop = 2;

    const distance = Math.abs(destinationIndex - originIndex);
    if (distance <= baseDistance) {
        return minimumFare;
    } else {
        const extraStops = distance - baseDistance;
        return minimumFare + (extraStops * additionalFarePerStop);
    }
}