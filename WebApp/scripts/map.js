import { appData } from "./appData.js";

const setMap = (selector) => {
    return new google.maps.Map(document.getElementById(selector), {
        zoom: 4,
        center: { lat: 41.85, lng: -87.65 },
    });
}

const showDirectionOnMap = (target) => {
    const routeId = target.getAttribute("route-id");
    if (appData.routes[routeId] && appData.routes[routeId].route && appData.routes[routeId].route.length) {
        const directionResponse = appData.routes[routeId].directionResponse;
        const directionsRenderer = new google.maps.DirectionsRenderer();
        appData.mainMap = setMap("map");
        directionsRenderer.setMap(appData.mainMap);
        directionsRenderer.setDirections(directionResponse);
    }
}

export { setMap, showDirectionOnMap }