/*
* Fdu Capstone, Summer 2023
* Author: Group#5 (Das, Nithish, Sanad)
*/

import { addInputFieldForPlaces } from './PlaceInput.js';
import { appVars } from './appVars.js';

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

function generateRoutes() {
    if (appVars.startingPoints.length && appVars.startingPoints[0].mapInfo) {
        let startingPoint = appVars.startingPoints[0];
        let destinations = appVars.destinations.filter(x => x.mapInfo);
        if (destinations.length) {
            let places = [];
            places.push(startingPoint.mapInfo.geometry.location)
            destinations.forEach(d => {
                places.push(d.mapInfo.geometry.location)
            })

            const request = {
                origins: places,
                destinations: places,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC
            };
            const service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(request).then((res) => {
                if (res) {
                    getRoutesFromDistancMatrix(res);
                }
                else {
                    alert("Could not found any route");
                }
            })
        }
        else {
            alert("Please enter valid destination");
        }
    }
    else {
        alert("Please enter starting point");
    }
}

function getRoutesFromDistancMatrix(res) {
    let dstIndexes = [];
    for (let i = 1; i < res.destinationAddresses.length; i++) {
        dstIndexes.push(i);
    }

    let routes = [];
    permute(dstIndexes.length, dstIndexes, (arr) => {
        let startIndex = 0;
        let destinationIndex = arr[0];
        let moves = [getMoves(res, startIndex, destinationIndex)];
        for (let i = 0; i < arr.length - 1; i++) {
            startIndex = arr[i];
            destinationIndex = arr[i + 1]
            moves.push(getMoves(res, startIndex, destinationIndex));
        }
        routes.push({ route: moves })
    })
    console.log(routes);
    document.querySelector("#routes").innerHTML = `<pre>${JSON.stringify(routes, null, 2)}</pre>`
}

function getMoves(res, startIndex, destinationIndex) {
    return {
        start: res.originAddresses[startIndex],
        stop: res.destinationAddresses[destinationIndex],
        distance: res.rows[startIndex].elements[destinationIndex].distance,
        time: res.rows[startIndex].elements[destinationIndex].duration
    }
}

// GeneratingPermutation using heap algorithm
// Reference: https://en.wikipedia.org/wiki/Heap%27s_algorithm
function permute(k, arr, callbackForSequence) {
    if (k === 1) {
        if (callbackForSequence) {
            callbackForSequence(arr)
        }
    }
    else {
        permute(k - 1, arr, callbackForSequence);
        for (let i = 0; i < k - 1; i++) {
            if (k % 2 == 0) {
                [arr[k - 1], arr[i]] = [arr[i], arr[k - 1]]
                // swapArray(arr, i, k - 1);
            }
            else {
                [arr[k - 1], arr[0]] = [arr[0], arr[k - 1]]
                // swapArray(arr, 0, k - 1);
            }
            permute(k - 1, arr, callbackForSequence)
        }
    }
}