/*
* Fdu Capstone, Summer 2023
* Author: Group#5 (Das, Nithish, Sanad)
*/

import { addInputFieldForPlaces } from './PlaceInput.js';
import { appVars } from './appVars.js';

function initApp() {
    addInputFieldForPlaces();
    addEventListeners();
    
    let arr = [1,2,3,4];
    getPermutation(arr.length, arr);
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
            getDistanceMatrix(places)
        }
        else {
            alert("Please enter valid destination");
        }
    }
    else {
        alert("Please enter starting point");
    }
}

function getDistanceMatrix(places) {
    const request = {
        origins: places,
        destinations: places,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
    };
    const service = new google.maps.DistanceMatrixService();
    // service.getDistanceMatrix(request).then((response) => {
    //     if(response) {
    //         getRoutes(response)
    //     }
    //     else {
    //         alert("Could not found any route");
    //     }
    // })

    getRoutes({
        "rows": [
            {
                "elements": [
                    {
                        "distance": {
                            "text": "1 m",
                            "value": 0
                        },
                        "duration": {
                            "text": "1 min",
                            "value": 0
                        },
                        "status": "OK"
                    },
                    {
                        "distance": {
                            "text": "3.5 km",
                            "value": 3503
                        },
                        "duration": {
                            "text": "8 mins",
                            "value": 484
                        },
                        "status": "OK"
                    },
                    {
                        "distance": {
                            "text": "5.7 km",
                            "value": 5723
                        },
                        "duration": {
                            "text": "14 mins",
                            "value": 820
                        },
                        "status": "OK"
                    }
                ]
            },
            {
                "elements": [
                    {
                        "distance": {
                            "text": "3.4 km",
                            "value": 3410
                        },
                        "duration": {
                            "text": "8 mins",
                            "value": 478
                        },
                        "status": "OK"
                    },
                    {
                        "distance": {
                            "text": "1 m",
                            "value": 0
                        },
                        "duration": {
                            "text": "1 min",
                            "value": 0
                        },
                        "status": "OK"
                    },
                    {
                        "distance": {
                            "text": "6.9 km",
                            "value": 6908
                        },
                        "duration": {
                            "text": "15 mins",
                            "value": 913
                        },
                        "status": "OK"
                    }
                ]
            },
            {
                "elements": [
                    {
                        "distance": {
                            "text": "5.7 km",
                            "value": 5725
                        },
                        "duration": {
                            "text": "14 mins",
                            "value": 813
                        },
                        "status": "OK"
                    },
                    {
                        "distance": {
                            "text": "7.4 km",
                            "value": 7401
                        },
                        "duration": {
                            "text": "14 mins",
                            "value": 868
                        },
                        "status": "OK"
                    },
                    {
                        "distance": {
                            "text": "1 m",
                            "value": 0
                        },
                        "duration": {
                            "text": "1 min",
                            "value": 0
                        },
                        "status": "OK"
                    }
                ]
            }
        ],
        "originAddresses": [
            "4293 Perry St, Vancouver, BC V5N 3X6, Canada",
            "2316 Nanaimo St, Vancouver, BC V5N 5E2, Canada",
            "6154 Willingdon Ave, Burnaby, BC V5H, Canada"
        ],
        "destinationAddresses": [
            "4293 Perry St, Vancouver, BC V5N 3X6, Canada",
            "2316 Nanaimo St, Vancouver, BC V5N 5E2, Canada",
            "6154 Willingdon Ave, Burnaby, BC V5H, Canada"
        ]
    })
}

// function getRoutes(distanceMatrix) {
//     let routes = [];
//     for (let i = 0; index < distanceMatrix.rows.length; i++) {
//         const from = distanceMatrix.originAddresses[i];
//         for (let j = 0; j < array.length; j++) {
//             const element = array[j];

//         }
//         const from = distanceMatrix.rows[i];

//     }
// }

// GeneratingPermutation using heap algorithm
// Reference: https://en.wikipedia.org/wiki/Heap%27s_algorithm
function getPermutation(k, arr) {
    if (k === 1) {
        console.log(arr)
    }
    else {
        for (let i = 0; i < k-1; i++) {
            getPermutation(k - 1, arr)
            if (k % 2 == 0) {
                [arr[k - 1], arr[i]] = [arr[i], arr[k - 1]]
            }
            else {
                [arr[k - 1], arr[0]] = [arr[0], arr[k - 1]]
            }
            getPermutation(k - 1, arr)
        }
    }
}