/*
* Fdu Capstone, Summer 2023
* Author: Group#5 (Das, Nithish, Sanad)
*/

import { appData } from './appData.js';
import { setMap } from './mapDirection.js';
import { addInputFieldForPlaces } from './placeInput.js';
import { generateRoutes } from './routes.js';

function initApp() {
    showSection("welcome-sect");
    addInputFieldForPlaces();
    addEventListeners();
}

// window.initApp = initApp;
initApp()

function addEventListeners() {
    [
        { selector: "#add-place-btn", eventFunction: addInputFieldForPlaces },
        { selector: "#generate-route-btn", eventFunction: generateRoutes },
    ].forEach(item => {
        document.querySelector(item.selector).addEventListener("click", item.eventFunction, false)
    })

    document.querySelectorAll("[target-section]").forEach((element) => {
        element.onclick = (event) => {
            let sectionId = event.target.getAttribute("target-section")
            showSection(sectionId)
        }
    })
}

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach((element) => {
        element.classList.add("d-none")
    });
    document.getElementById(sectionId).classList.remove("d-none");
}