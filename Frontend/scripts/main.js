/*
* Fdu Capstone, Summer 2023
* Author: Group#5 (Das, Nithish, Sanad)
*/

import { addInputFieldForPlaces } from './PlaceInput.js';
import { appData } from './appData.js';
import { sampleRoutes } from '../data/sample.js';

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
    if (appData.startingPoints.length && appData.startingPoints[0].mapInfo) {
        let startingPoint = appData.startingPoints[0];
        let destinations = appData.destinations.filter(x => x.mapInfo);
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
        let move = getMove(res, startIndex, destinationIndex);
        let route = [move];
        let totalDistance = move.distance.value;
        let totalTime = move.time.value
        for (let i = 0; i < arr.length - 1; i++) {
            startIndex = arr[i];
            destinationIndex = arr[i + 1]
            move = getMove(res, startIndex, destinationIndex);
            route.push(move);
            totalDistance += move.distance.value;
            totalTime += move.time.value;
        }
        routes.push({ route, totalDistance, totalTime })
    })

    console.log(routes);
    routes.sort(compareRoutes);
    appData.routes = routes;
    showRouteInformation(routes);
}

function showRouteInformation(routes) {

    document.querySelector("#routes").innerHTML = routes.map((x, i) => {
        return `
        <div>
            <div class="mt-4">
                <span>Route#${i + 1}</span> | 
                <span>Total Distance: ${x.totalDistance / 1000} KM</span> | 
                <span>Estimated Time: ${getTime(x.totalTime)}</span> |
                <button class="map-show-btn" route-id="${i}">Show Map</button>
            </div>
            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Start</th>
                        <th scope="col">Stop</th>
                        <th scope="col">Distance</th>
                        <th scope="col">Time</th>
                    </tr>
                </thead>
                <tbody>
                    ${x.route.map(y => {
            return `<tr>
                                <td>${y.start}</td>
                                <td>${y.stop}</td>
                                <td>${y.distance.text}</td>
                                <td>${y.time.text}</td>
                            </tr>`
        }).join("")
            }
                </tbody>
            </table>
        </div>`
    }).join("");

    document.querySelectorAll(".map-show-btn").forEach(element => {
        element.addEventListener("click", showRouteOnMap)
    })
}

function getMove(res, startIndex, destinationIndex) {
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
            }
            else {
                [arr[k - 1], arr[0]] = [arr[0], arr[k - 1]]
            }
            permute(k - 1, arr, callbackForSequence)
        }
    }
}

function getTime(seconds) {
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}

function compareRoutes(a, b) {
    return a.totalDistance - b.totalDistance
}

function showRouteOnMap(event) {
    const routeId = event.target.getAttribute("route-id")
    if (appData.routes[routeId] && appData.routes[routeId].route && appData.routes[routeId].route.length) {
        const route = appData.routes[routeId].route;
        console.log(route);
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 4,
            center: { lat: 41.85, lng: -87.65 },
        });
        directionsRenderer.setMap(map);
        const waypoints = [];

        for (let i = 1; i < route.length; i++) {
            if (route[i].start) {
                waypoints.push({
                    location: route[i].start,
                    stopover: true,
                });
            }
        }

        directionsService
            .route({
                origin: route[0].start,
                destination: route[route.length -1].stop,
                waypoints: waypoints,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING,
            })
            .then((response) => {
                directionsRenderer.setDirections(response);
            })
            .catch((e) => window.alert("Directions request failed due to " + status));
    }
    else {
        alert("Cannot find route information.")
    }
}