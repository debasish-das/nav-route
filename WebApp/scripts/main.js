/*
* Fdu Capstone, Summer 2023
* Author: Group#5 (Das, Nithish, Sanad)
*/

import { user } from './apiRequest.js';
import { appData } from './appData.js';
import { parseErrorList } from './helper.js';
import { setMap } from './mapDirection.js';
import { addInputFieldForPlaces } from './placeInput.js';
import { generateRoutes } from './routes.js';

async function initApp() {
    try {
        checkCurrentUser()
        addInputFieldForPlaces()
        addEventListeners()
    } catch (error) {
        console.error(error)
    }
}

initApp()

function checkCurrentUser() {
    getCurrentuser()
    setInterval(getCurrentuser, 1000 * 60 * 5)
}

function getCurrentuser() {
    appData.currentUser = null
    user.current().then(res => {
        if (res?.id) {
            appData.currentUser = res
            showSection("welcome-sect")
        } else {
            showSection("signin-sect")
        }
    }).catch(err => {
        alert("Please sign in!")
    })
}

function addEventListeners() {
    [
        { selector: "#add-place-btn", eventFunction: addInputFieldForPlaces },
        { selector: "#generate-route-btn", eventFunction: generateRoutes },
        { selector: "#signout-btn", eventFunction: signout }
    ].forEach(item => {
        document.querySelector(item.selector).addEventListener("click", item.eventFunction, false)
    });

    [
        { selector: "#signin-form", eventFunction: signin },
        { selector: "#signup-form", eventFunction: signup }
    ].forEach(item => {
        document.querySelector(item.selector).addEventListener("submit", item.eventFunction, false)
    })

    document.querySelectorAll("[target-section]").forEach((element) => {
        element.onclick = (event) => {
            event.preventDefault();
            let sectionId = event.target.getAttribute("target-section")
            showSection(sectionId)
        }
    })
}

function signin(event) {
    event.preventDefault()
    const form = new FormData(event.target)
    const request = {
        email: form.get("email"),
        password: form.get("password")
    }
    event.target.reset();
    user.signin(request)
        .then(res => {
            appData.currentUser = res
            showSection("welcome-sect")
        })
        .catch(error => {
            if (error?.status === 401) {
                alert(error.message)
            }
            else {
                alert("Something went wrong!")
            }
        })
}


function signup(event) {
    event.preventDefault()
    const form = new FormData(event.target)
    const request = {
        user: {
            first_name: form.get("first_name"),
            last_name: form.get("last_name"),
            email: form.get("email"),
            password: form.get("password"),
            password_confirmation: form.get("password_confirmation")
        }
    }
    event.target.reset();
    user.signup(request)
        .then(res => {
            appData.currentUser = res
            showSection("welcome-sect")
        })
        .catch(error => {
            document.getElementById("signup-error").innerHTML = parseErrorList(error);
        })
}


function signout(event) {
    event.preventDefault()
    user.signout()
        .then(res => {
            appData.currentUser = null
            showSection("sigin-sect", false)
        })
        .catch(err => alert("Something went wrong!"))
}

function showSection(sectionId, showSignInAlert = true) {

    // Showing section
    if (appData.currentUser || ["signin-sect", "signup-sect"].includes(sectionId)) {
        document.querySelectorAll(".section").forEach((element) => {
            element.classList.add("d-none")
        });
        document.getElementById(sectionId).classList.remove("d-none");
    } else {
        document.getElementById("signout-btn").classList.add("d-none")
        if (showSignInAlert) alert("Please sign in")
        showSection("signin-sect")
    }

    // Showing signin and signout button
    if (appData.currentUser) {
        document.getElementById("signin-btn").classList.add("d-none")
        document.getElementById("signout-btn").classList.remove("d-none")
    } else {
        document.getElementById("signin-btn").classList.remove("d-none")
        document.getElementById("signout-btn").classList.add("d-none")
    }
}