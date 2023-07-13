
import { appData } from './appData.js';
import { getTime, isLeftTurn, isRightTurn } from './helper.js';
import { getDirection, showDirectionOnMap } from './mapDirection.js';

function showRouteInformation() {
    let routesDiv = document.querySelector("#routes")
    appData.numberOfRoutesToShow = 5
    appData.routingIndexStart = 0

    generateRouteHtmlAndDirection(res => {
        routesDiv.innerHTML = `<div id="route-container">${res}</div>`
        if (appData.routes.length > appData.numberOfRoutesToShow) {
            routesDiv.innerHTML += `<button id="more-routes-btn">Show more routes</button>`
        }
    })
    routesDiv.addEventListener("click", (e) => {
        const target = e.target.closest(".map-show-btn")
        if (target) {
            showDirectionOnMap(target)
        }

        const moreBtn = e.target.closest("#more-routes-btn");
        if (moreBtn) {
            moreBtn.addEventListener("click", (event) => {
                appData.numberOfRoutesToShow += 5;
                appData.routingIndexStart += 5;
                generateRouteHtmlAndDirection(res => {
                    document.querySelector("#route-container").innerHTML += res
                })
                if (appData.numberOfRoutesToShow > appData.routes.length) {
                    event.target.remove()
                }
            })
        }
    })
}

async function generateRouteHtmlAndDirection(callback) {
    let routeInfo = ""
    for (let i = appData.routingIndexStart; i < appData.routes.length && i < appData.numberOfRoutesToShow; i++) {
        const x = appData.routes[i];
        await getDirection(x)
            .then((response) => {
                x.directionResponse = response;

                let turns = 0;
                let leftTurns = 0;
                let rightTurns = 0;

                x.directionResponse.routes[0].legs.forEach(leg => {
                    leg.steps.forEach(step => {
                        if (isLeftTurn(step.maneuver)) {
                            turns++;
                            leftTurns++;
                        }
                        else if (isRightTurn(step.maneuver)) {
                            turns++;
                            rightTurns++;
                        }
                    })
                });

                routeInfo += `
                    <div>
                        <div class="mt-4">
                            <span>Route#${i + 1}</span> | 
                            <span>Total Distance: ${x.totalDistance / 1000} KM</span> | 
                            <span>Estimated Time: ${getTime(x.totalTime)}</span> |
                            <span>Turns: ${turns}</span>
                            <span>Left Turns: ${leftTurns}</span>
                            <span>Right Turns: ${rightTurns}</span>
                            <button class="map-show-btn" route-id="${x.id}">Show Map</button>
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
            })
            .catch((e) => window.alert("Directions request failed due to " + e.message));

    }

    callback(routeInfo)
}

export { showRouteInformation }