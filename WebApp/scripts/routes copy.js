import { appData } from './appData.js';
import { permute } from './helper.js';
import { showRouteInformation } from './routesOutput.js';

function generateRoutes() {
    if (appData.startingPoints.length && appData.startingPoints[0].mapInfo) {
        let startingPoint = appData.startingPoints[0];
        let destinations = appData.destinations.filter(x => x.mapInfo);
        if (destinations.length) {
            let places = [];
            places.push(startingPoint.mapInfo.formatted_address)
            destinations.forEach(d => {
                places.push(d.mapInfo.formatted_address)
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
    let priorityDestinations = [];
    let nonPriorityDestinations = [];
    console.log(res)
    console.log(appData)
    res.destinationAddresses.forEach(dest => {
        let hasPriority = appData.destinations.some(x => x.priority && x.mapInfo.formatted_address == dest)
        if (hasPriority) {
            priorityDestinations.push(dest)
        } else {
            nonPriorityDestinations(dest)
        }
    })

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
        let totalTime = move.time.value;
        for (let i = 0; i < arr.length - 1; i++) {
            startIndex = arr[i];
            destinationIndex = arr[i + 1]
            move = getMove(res, startIndex, destinationIndex);
            route.push(move);
            totalDistance += move.distance.value;
            totalTime += move.time.value;

        }
        routes.push({
            route,
            totalDistance,
            totalTime,
            id: routes.length
        })
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

export { generateRoutes }