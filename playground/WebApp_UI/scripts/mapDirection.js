import { showSection } from "../../WebApp/scripts/sectionNavigation.js";
import { appData } from "./appData.js";

const setMap = (selector) => {
    return new google.maps.Map(document.getElementById(selector), {
        zoom: 4,
        center: { lat: 41.85, lng: -87.65 },
    });
}

const showDirectionOnMap = (target) => {
    const routeId = target.getAttribute("route-id");
    const route = appData.routes.find(x => x.id == routeId)
    if (route) {
        const directionResponse = appData.routes[routeId].directionResponse;
        const directionsRenderer = new google.maps.DirectionsRenderer();
        appData.mainMap = setMap("map");
        directionsRenderer.setMap(appData.mainMap);
        directionsRenderer.setDirections(directionResponse);
        showSection("map-sect");
        
    }
}


const getDirection = (route) => {
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

        return directionsService
            .route({
                origin: routeSteps[0].start,
                destination: routeSteps[routeSteps.length - 1].stop,
                waypoints: waypoints,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING,
            });
    }
    else {
        alert("Cannot find route information.")
    }
}

export { setMap, showDirectionOnMap, getDirection }