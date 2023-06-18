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
    let inputDiv = document.createElement("div");
    inputDiv.className = "input-group mb-3";
    
    let input = document.createElement("input");
    input.setAttribute("class", "form-control");
    inputDiv.appendChild(input);

    let timeId = new Date().valueOf();
    inputDiv.setAttribute("time-id", timeId);

    let isStartPoint = event && event.target.id === "add-place-btn" ? false : true;
    if (isStartPoint) {
        input.setAttribute("placeholder", "Enter starting point");
        document.getElementById("places").prepend(inputDiv);
    }
    else {
        let crossBtn = document.createElement("span");
        crossBtn.innerHTML = `❌`
        crossBtn.className = "input-group-text";
        crossBtn.style = "cursor:pointer";
        crossBtn.timeId = timeId
        crossBtn.addEventListener("click", romovePlaceInputField);

        input.setAttribute("placeholder", "Enter destination");
        inputDiv.appendChild(crossBtn);
        document.getElementById("destinations").prepend(inputDiv);
    }

    let placeType = isStartPoint ? "startingPoints" : "destinations";
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

function romovePlaceInputField(event) {
    let parentNode = event.target.closest("[time-id]");
    let timeId = parentNode.getAttribute("time-id");
    appVars.destinations = appVars.destinations.filter(x => x.id != timeId);
    parentNode.remove();
}