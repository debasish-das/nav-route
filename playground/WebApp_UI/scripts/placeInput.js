import { appData } from './appData.js';

function addInputFieldForPlaces(event) {
    let inputDiv = document.createElement("div");
    inputDiv.className = "input-group mb-3";

    let input = document.createElement("input");
    input.setAttribute("class", "form-control");
    inputDiv.appendChild(input);

    let timeId = new Date().valueOf();
    inputDiv.setAttribute("place-input-id", timeId);

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

        input.setAttribute("placeholder", "Enter destination");
        input.style = "flex-basis:45%"
        inputDiv.appendChild(getPriorityInput())
        inputDiv.appendChild(getCrossButton());
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

function getCrossButton() {
    let crossBtn = document.createElement("span");
    crossBtn.innerHTML = `✖`
    crossBtn.className = "input-group-text";
    crossBtn.style = "cursor:pointer";
    crossBtn.addEventListener("click", romovePlaceInputField);
    return crossBtn
}

function romovePlaceInputField(event) {
    let parentNode = event.target.closest("[place-input-id]");
    let inputId = parentNode.getAttribute("place-input-id");
    appData.destinations = appData.destinations.filter(x => x.id != inputId);
    parentNode.remove();
}

function getPriorityInput() {
    let prioritySelect = document.createElement("select");
    prioritySelect.className = "form-select"
    prioritySelect.innerHTML = `
        <option value="">Priority</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>    
        <option value="5">5</option>
    `
    prioritySelect.addEventListener("change", selectPriority)
    return prioritySelect;
}

function selectPriority(event) {
    let parentNode = event.target.closest("[place-input-id]");
    let inputId = parentNode.getAttribute("place-input-id");
    let destination = appData.destinations.find(x => x.id == inputId);
    destination.priority = parseInt(event.target.value);
}

export { addInputFieldForPlaces, romovePlaceInputField }