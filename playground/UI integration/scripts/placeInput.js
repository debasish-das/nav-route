import { appData } from './appData.js';

function addInputFieldForPlaces(event) {
    let inputDiv = document.createElement("div");
    inputDiv.className = "input-group mb-3";

    let input = document.createElement("input");
    input.setAttribute("class", "form-control");
    inputDiv.appendChild(input);

    let timeId = new Date().valueOf();
    inputDiv.setAttribute("time-id", timeId);

    let isStartPoint = event && event.target.id === "add-place-btn" ? false : true;
    let placeType = isStartPoint ? "startingPoints" : "destinations";

    if (isStartPoint) {
        input.setAttribute("placeholder", "Enter starting point");
        document.getElementById("places").prepend(inputDiv);
    }
    else {
        if (appData[placeType]?.length === 8) {
            alert("Maximum destination can be 8");
            return;
        }
        
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

    let place = {
        id: timeId,
        mapInfo: null
    }
    appData[placeType].push(place);

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
    appData.destinations = appData.destinations.filter(x => x.id != timeId);
    parentNode.remove();
}

export { addInputFieldForPlaces, romovePlaceInputField }