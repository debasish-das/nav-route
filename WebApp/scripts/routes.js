import { appData } from './appData.js';
import { permute } from './helper.js';
import { showRouteInformation } from './routesOutput.js';

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
            console.log(places);
            if (destinations.length == 1){
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
                        console.log(res);
                        getRoutesFromDirectionService(res);
                    }
                    else {
                        alert("Could not found any route");
                    }
                })

            }
            else{
            const request = {
                origins: places,
                destinations: places,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC
            };
            const service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(request).then((res) => {
                if (res) {
                    console.log(res);
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
    console.log(res.routes);
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
            via: via
        }

        routes.push({
            route,
            totalDistance,
            totalTime,
            id: i
        })
    }

    appData.routes = routes.sort(compareRoutes);
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
        console.log(route);
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