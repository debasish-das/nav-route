import { appData } from './appData.js';
import { getTime, permute } from './helper.js';
import { sampleRoutes } from '../data/sample.js';
import { showDirectionOnMap } from './map.js';

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

    appData.routes = routes.sort(compareRoutes);
    showRouteInformation();
}

function getMove(res, startIndex, destinationIndex) {
    return {
        start: res.originAddresses[startIndex],
        stop: res.destinationAddresses[destinationIndex],
        distance: res.rows[startIndex].elements[destinationIndex].distance,
        time: res.rows[startIndex].elements[destinationIndex].duration
    }
}

function compareRoutes(a, b) {
    return a.totalDistance - b.totalDistance
}

function showRouteInformation() {
    let routesDiv = document.querySelector("#routes")
    appData.numberOfRoutesToShow = 5
    appData.routingIndexStart = 0

    routesDiv.innerHTML = `<div id="route-container">${generateRouteHtmlAndDirection()}</div>`
    routesDiv.addEventListener("click", (e) => {
        const target = e.target.closest(".map-show-btn")
        if (target) {
            showDirectionOnMap(target)
        }
    })

    if (appData.routes.length > appData.numberOfRoutesToShow) {
        routesDiv.innerHTML += `<button id="more-routes-btn">Show more routes</button>`
        document.querySelector("#more-routes-btn").addEventListener("click", (event) => {
            appData.numberOfRoutesToShow += 5;
            appData.routingIndexStart += 5;
            document.querySelector("#route-container").innerHTML += generateRouteHtmlAndDirection()
            if (appData.numberOfRoutesToShow > appData.routes.length) {
                event.target.remove()
            }
        })
    }
}

function generateRouteHtmlAndDirection() {
    let routeInfo = ""
    for (let i = appData.routingIndexStart; i < appData.routes.length && i < appData.numberOfRoutesToShow; i++) {
        const x = appData.routes[i];
        getDirection(x)
        routeInfo += `
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
    }

    return routeInfo
}

function getDirection(route) {
    let routeSteps = route.route
    if (routeSteps) {
        const directionsService = new google.maps.DirectionsService();
        const waypoints = [];

        for (let i = 1; i < routeSteps.length; i++) {
            if (routeSteps[i].start) {
                waypoints.push({
                    location: routeSteps[i].start,
                    stopover: true,
                });
            }
        }

        directionsService
            .route({
                origin: routeSteps[0].start,
                destination: routeSteps[routeSteps.length - 1].stop,
                waypoints: waypoints,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING,
            })
            .then((response) => {
                route.directionResponse = response;
                console.log(appData.routes)
            })
            .catch((e) => window.alert("Directions request failed due to " + e.message));
    }
    else {
        alert("Cannot find route information.")
    }
}

export { generateRoutes }