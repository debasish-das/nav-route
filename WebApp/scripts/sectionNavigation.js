import { appData } from "./appData.js";

function showSection(sectionId, showSignInAlert = true) {

    const hasAccessToSection = !appData.authSections.includes(sectionId)
        || (appData.authSections.includes(sectionId) && appData.currentUser)

    if (hasAccessToSection) {
        document.querySelectorAll(".section").forEach((element) => {
            element.classList.add("d-none")
        });
        document.getElementById(sectionId).classList.remove("d-none");
    }
    else {
        document.getElementById("signout-btn").classList.add("d-none")
        if (showSignInAlert) alert("Please sign in")
        showSection("signin-sect")
    }

    // Clearning signup error
    if (sectionId === "signup-sect") {
        document.getElementById("signup-error").innerHTML = ""
    }

    // Showing signin and signout button
    if (appData.currentUser) {
        document.getElementById("signin-btn").classList.add("d-none")
        document.getElementById("signout-btn").classList.remove("d-none")
        document.getElementById("user-name").innerHTML = `Hi ${appData.currentUser.first_name}`
    } else {
        document.getElementById("signin-btn").classList.remove("d-none")
        document.getElementById("signout-btn").classList.add("d-none")
        document.getElementById("user-name").innerHTML = ""
    }
}

export {showSection }