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

            if (destinations.length == 1) {
                const request = {
                    origin: places[0],
                    destination: places[1],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC,
                    provideRouteAlternatives: true
                };
                const service = new google.maps.DirectionsService();
                service.route(request).then((res) => {
                    if (res) {
                        getRoutesFromDirectionService(res);
                    }
                    else {
                        alert("Could not found any route");
                    }
                })
            }
            else {
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
        }
        else {
            alert("Please enter valid destination");
        }
    }
    else {
        alert("Please enter starting point");
    }
}

function getRoutesFromDirectionService(res) {
    let routes = [];
    for (let i=0; i< res.routes.length; i++){
        let totalDistance = res.routes[i].legs[0].distance;
        let totalTime = res.routes[i].legs[0].duration;
        let st = res.routes[i].legs[0].start_address;
        let ed = res.routes[i].legs[0].end_address;
        let via = res.routes[i].summary;

        let route = {
            start: st, 
            stop: ed, 
            time: totalTime, 
            distance: totalDistance, 
            via: via,
            rr: res.routes[i],
            rrr: res
        }

        routes.push({
            route,
            totalDistance,
            totalTime,
            id: i
        })
    }
    appData.routes = routes.sort(compareRoutes);
    showRouteInformation("ds");
}

function getRoutesFromDistancMatrix(res) {
    // Filtering the priority destinations
    let priorityDestinationIndexes = [];
    let nonPriorityDestinationIndexes = [];
    res.destinationAddresses.forEach((dest, index) => {
        let appDataDestination = appData.destinations.find(x => x.priority && x.mapInfo.formatted_address == dest)
        if (appDataDestination) {
            priorityDestinationIndexes.push({ index, priority: appDataDestination.priority })
        } else {
            nonPriorityDestinationIndexes.push(index)
        }
    })

    nonPriorityDestinationIndexes.shift(); // Removing the first element because starting place is included as destination in response
    priorityDestinationIndexes.sort((a, b) => { return a.priority - b.priority }); // Sorting priority destinations by priority

    //List of all possible routes
    let routes = [];
    let priorityMoves = []
    let priorityDistance = 0
    let priorityTime = 0

    // Finding the moves for priority destinations from starting point or place
    if (priorityDestinationIndexes.length) {
        let startIndex = 0;
        let destinationIndex = priorityDestinationIndexes[0].index
        let move = getMove(res, startIndex, destinationIndex)
        priorityMoves.push(move)
        priorityDistance = move.distance.value;
        priorityTime = move.time.value
        for (let i = 0; i < priorityDestinationIndexes.length - 1; i++) {
            startIndex = priorityDestinationIndexes[i].index;
            destinationIndex = priorityDestinationIndexes[i + 1].index
            move = getMove(res, startIndex, destinationIndex);
            priorityMoves.push(move);
            priorityDistance += move.distance.value;
            priorityTime += move.time.value;
        }
    }

    // Case#1: Only prioritized destinations
    // Then, the only route will be from prioritized moves
    if (nonPriorityDestinationIndexes.length === 0) {
        routes.push({
            id: routes.length,
            route: priorityMoves,
            totalDistance: priorityDistance,
            totalTime: priorityTime
        })
    }
    else {
        // Permute combinations for nonPrioritized destinations
        permute(nonPriorityDestinationIndexes.length, nonPriorityDestinationIndexes, (arr) => {
            let startIndex = 0;
            let destinationIndex;
            let move
            let route = []
            let totalDistance = 0
            let totalTime = 0

            // Case#2: Both prioritized and non-prioritized destinations
            // Then, add the moves from prioritized destinations
            // and find the move from the end of priority place to the starting place of permuted non-prioritized destinations
            if (priorityDestinationIndexes.length) {
                startIndex = priorityDestinationIndexes[priorityDestinationIndexes.length - 1].index
                destinationIndex = arr[0]
                move = getMove(res, startIndex, destinationIndex)
                route.push(...priorityMoves)
                route.push(move)
            }
            // Case#3: Only non-prioritized moves
            // Then, find the move from starting place to the starting place of permuted non-prioritized destinations
            else {
                destinationIndex = arr[0];
                move = getMove(res, startIndex, destinationIndex);
                route = [move];
                totalDistance = move.distance.value;
                totalTime = move.time.value;
            }

            // Adding the moves for the rest of permuted non-prioritized destinations
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
    }

    appData.routes = routes.sort(compareRoutes);
    showRouteInformation("dm");
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