/*
* Fdu Capstone, Summer 2023
* Author: Group#5 (Das, Nithish, Sanad)
*/

let appVars = {
    startingPoints: [],
    destinations: []
}

function initApp() {
    addInputFieldForPlaces();
    addEventListeners();
}

window.initApp = initApp;

function addEventListeners() {
    [
        { selector: "#add-place-btn", eventFunction: addInputFieldForPlaces },
    ].forEach(item => {
        document.querySelector(item.selector).addEventListener("click", item.eventFunction, false)
    })
}

function addInputFieldForPlaces(event) {
    let isStartPoint = event ? false : true;
    let input = document.createElement("input");
    let timeId = new Date().valueOf();
    let placeType = isStartPoint ? "startingPoints" : "destinations";
    input.setAttribute("class", "form-control mb-3");
    input.setAttribute("time-id", timeId);

    if (isStartPoint) {
        input.setAttribute("placeholder", "Enter starting point");
        document.getElementById("places").prepend(input);
    }
    else {
        input.setAttribute("placeholder", "Enter destination")
        document.getElementById("places").append(input);
    }

    let place = {
        id: timeId,
        mapInfo: null
    }
    appVars[placeType].push(place);

    let autocomplete = new google.maps.places.Autocomplete(
        input,
        { types: ['geocode'] });
    autocomplete.addListener('place_changed', () => {
        place.mapInfo = autocomplete.getPlace();
    });
}