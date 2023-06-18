/*
* Fdu Capstone, Summer 2023
* Author: Group#5 (Das, Nithish, Sanad)
*/

let appVars = {
    startingPoint: {},
    destinations: []
}

function initApp() {
    addInputFieldForPlaces(true);
}

window.initApp = initApp;

function addInputFieldForPlaces(isStartPoint) {
    let input = document.createElement("input");
    input.setAttribute("class", "form-control mb-3");

    if (isStartPoint) {
        input.setAttribute("placeholder", "Enter starting point");
        appVars.startingPoint.inputField = input;
        document.getElementById("places-part").append(input);
    }
    else {
        input.setAttribute("placeholder", "Enter destination");
        appVars.destinations.push({ inputField: input });
        document.getElementById("places-part").append(input);
    }

    let autocomplete = new google.maps.places.Autocomplete(
        input,
        { types: ['geocode'] });
    autocomplete.addListener('place_changed', () => {
        console.log(autocomplete.getPlace());
    });
}