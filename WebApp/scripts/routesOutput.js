
import { appData } from './appData.js';
import { getTime, isLeftTurn, isRightTurn } from './helper.js';
import { getDirection, showDirectionOnMap } from './mapDirection.js';

function showRouteInformation(flag) {
    let routesDiv = document.querySelector("#routes")
    appData.numberOfRoutesToShow = 5
    appData.routingIndexStart = 0

    generateRouteHtmlAndDirection(res => {
        routesDiv.innerHTML = `<div>
            <select id="sort-select" class="form-select">
                <option>Sort Routes</option>
                <option value="leftTurns">Left turn sorts</option>
                <option value="rightTurns">Right turn sorts</option>
                <option value="turns">Total turn sorts</option>
            </select>
            <div id="route-container">${res}</div>
        </div>`

        if (appData.routes.length > appData.numberOfRoutesToShow) {
            routesDiv.innerHTML += `<button id="more-routes-btn">Show more routes</button>`
        }
    }, flag)

    routesDiv.addEventListener("click", (e) => {
        const showMapBtn = e.target.closest(".map-show-btn")
        const moreBtn = e.target.closest("#more-routes-btn")
        if (showMapBtn) {
            showDirectionOnMap(showMapBtn, flag)
        }
        else if (moreBtn) {
            appData.numberOfRoutesToShow += 5;
            appData.routingIndexStart += 5;
            generateRouteHtmlAndDirection(res => {
                document.querySelector("#route-container").innerHTML += res
            }, flag)
            if (appData.numberOfRoutesToShow > appData.routes.length) {
                e.target.remove()
            }
        }
    })

    routesDiv.addEventListener("change", (e) => {
        const sortSelect = e.target.closest("#sort-select")
        if (sortSelect) {
            let val = e.target.value;
            appData.routes.sort((a, b) => {
                console.log(a);
                console.log("bd", b);
                if (flag == "dm"){
                    if (a.directionResponse && b.directionResponse) {
                        return a[val] - b[val]
                    }
                    else return 0
                }
                else{
                    if (a.route.rrr && b.route.rrr) {
                        return a[val] - b[val]
                    }
                    else return 0
                }
            })
            showSortedRoutes(flag);
        }
    })
}

function showSortedRoutes(flag) {
    let routeInfo = ""
    for (let i = 0; i < appData.routes.length && i < appData.numberOfRoutesToShow; i++) {
        const x = appData.routes[i];
        routeInfo += getRouteHtml(x, flag)
    }
    document.querySelector("#route-container").innerHTML = routeInfo
}

async function generateRouteHtmlAndDirection(callback, flag) {
    let routeInfo = ""
    for (let i = appData.routingIndexStart; i < appData.routes.length && i < appData.numberOfRoutesToShow; i++) {
        const x = appData.routes[i];

        if (flag == "dm") {
            await getDirection(x).then((response) => {
                x.directionResponse = response;
                x.turns = 0;
                x.leftTurns = 0;
                x.rightTurns = 0;

                x.directionResponse.routes[0].legs.forEach(leg => {
                    leg.steps.forEach(step => {
                        if (isLeftTurn(step.maneuver)) {
                            x.turns++;
                            x.leftTurns++;
                        }
                        else if (isRightTurn(step.maneuver)) {
                            x.turns++;
                            x.rightTurns++;
                        }
                    })
                });

                routeInfo += getRouteHtml(x, flag)
            })
                .catch((e) => window.alert("Directions request failed due to " + e.message));
        }
        else {
            x.turns = 0;
            x.leftTurns = 0;
            x.rightTurns = 0;

            x.route.rr.legs.forEach(leg => {
                leg.steps.forEach(step => {
                    if (isLeftTurn(step.maneuver)) {
                        x.turns++;
                        x.leftTurns++;
                    }
                    else if (isRightTurn(step.maneuver)) {
                        x.turns++;
                        x.rightTurns++;
                    }
                })
            });

            routeInfo += getRouteHtml(x, flag)
        }
    }

    callback(routeInfo)
}

function getRouteHtml(x, flag) {

    let rmsg = `
        <div>
            <div class="mt-4">
                <span>Route#${x.id}</span> |
        `

    if (flag == "dm") {
        rmsg += `
                <span>Total Distance: ${x.totalDistance / 1000} KM</span> |
                <span>Estimated Time: ${getTime(x.totalTime)}</span> |
                `
    }
    else {
        rmsg += `
                <span>Total Distance: ${x.totalDistance.text}</span> |
                <span>Estimated Time: ${x.totalTime.text}</span> |
                `
    }

    rmsg += `
                <span>Turns: ${x.turns}</span> |
                <span>Left Turns: ${x.leftTurns}</span> |
                <span>Right Turns: ${x.rightTurns}</span> |
                <button class="map-show-btn" route-id="${x.id}">Show Map</button>
            </div>
            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Start</th>
        `

    if (flag == "dm") {
        rmsg += `
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
                    }).join("")}
                </tbody>
            </table>
        </div>`
    }
    else {
        rmsg += `
                        <th scope="col">Via</th>
                        <th scope="col">Stop</th>
                        <th scope="col">Distance</th>
                        <th scope="col">Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${x.route.start}</td>
                        <td>${x.route.via}</td>
                        <td>${x.route.stop}</td>
                        <td>${x.totalDistance.text}</td>
                        <td>${x.totalTime.text}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        `
    }
    return rmsg
}

export { showRouteInformation }