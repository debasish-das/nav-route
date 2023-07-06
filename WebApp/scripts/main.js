/*
* Fdu Capstone, Summer 2023
* Author: Group#5 (Das, Nithish, Sanad)
*/

import { addInputFieldForPlaces } from './placeInput.js';
import { generateRoutes } from './routes.js';
import { appData } from './appData.js';

function initApp() {
    addInputFieldForPlaces();
    addEventListeners();
}

window.initApp = initApp;

function addEventListeners() {
    [
        { selector: "#add-place-btn", eventFunction: addInputFieldForPlaces },
        { selector: "#generate-route-btn", eventFunction: generateRoutes },
    ].forEach(item => {
        document.querySelector(item.selector).addEventListener("click", item.eventFunction, false)
    })
}