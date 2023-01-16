let submit_el = document.getElementById("submit-button");
let error_el = document.getElementById("error-message");
let promotion_select = document.getElementById("promotion-select");
let class_select = document.getElementById("class-select");
let language_select = document.getElementById("language-select");
let tp_group_select = document.getElementById("tp-group-select");

let email = document.getElementById("email-input");
let password1 = document.getElementById("password-input1");
let password2 = document.getElementById("password-input2");
let form = document.querySelector("main > form:nth-child(3)");
let stage = 1;

/* AUTO-GENERATED SCRIPT HERE */

email.oninput = function(e) { autocomplete_email_el(e) };

// Submit function that can throw unhandled errors
async function submit_inner() {
    // Check values are valid
    if (email.value == "") {
        error_el.innerHTML = "Entrez votre adresse email.";
        error_el.style.display = "block";
        return false;
    }
    if (!email.value.includes(".")) {
        error_el.innerHTML = "Entrez votre adresse email la plus longue. Example: prenom.nom@insa-rouen.fr";
        error_el.style.display = "block";
        return false;
    }
    if (password1.value != password2.value) {
        error_el.innerHTML = "Les mots de passe ne correspondent pas.";
        error_el.style.display = "block";
        return false;
    }
    if (password1.value.length < 10) {
        error_el.innerHTML = "Le mot de passe doit contenir au moins 10 caractères.";
        error_el.style.display = "block";
        return false;
    }

    // Make request
    let response;
    if (stage === 1) {
        response = await fetch('/api/auth/register', {
            method: 'POST',
            body: "email=" + encodeURIComponent(email.value) + "&password=" + encodeURIComponent(password1.value),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
    } else {
        let user_groups_parts = [];
        let dropdowns = form.querySelectorAll("div.dropdown-list-box");
        for (let i = 0; i < dropdowns.length; i++) {
            let dropdown = dropdowns[i];
            if (dropdown.style.display === "block") {
                let select = dropdown.firstElementChild;
                let name = select.getAttribute("name");
                let value = select.options[select.selectedIndex].value;
                if (value === "") {
                    error_el.innerHTML = "Veuillez selectionner votre " + select.firstElementChild.innerText.toLowerCase() + ".";
                    error_el.style.display = "block";
                    return false;        
                }
                user_groups_parts.push(name + "=" + value);
            }
        }
        let user_groups = user_groups_parts.join("+");

        response = await fetch('/api/auth/register', {
            method: 'POST',
            body: "email=" + encodeURIComponent(email.value) + "&password=" + encodeURIComponent(password1.value) + "&user_groups=" + encodeURIComponent(user_groups),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
    }

    // Handle response
    if (response.status == 200) {
        let json = await response.json();
        localStorage.setItem('api_key', json.api_key);
        localStorage.setItem('counter', 1);
        window.location.replace("/agenda");
    } else if (response.status == 400 || response.status == 500) {
        let json = await response.json();

        if (json.kind === "unknown_email") {
            stage = 2;
            error_el.style.display = "none";
            form.style.display = "initial";
        } else {
            error_el.innerHTML = json.messages["fr"]; // TODO: display english messages
            error_el.style.display = "block";
        }
    } else {
        throw new Error("Unknown status code: " + response.status);
    }
}

// Submit and handle errors
async function submit() {
    let selector_list = ["#submit-button", "#register-link", "body > section.identification-section > main > form:nth-child(4) > a"];

    enable_activity_indicator(selector_list, true);
    try {
        await submit_inner();
    } catch (e) {
        error_el.innerText = "Une erreur inconnue s'est produite.";
        error_el.style.display = "block";
        Sentry.setUser({ email: email.value });
        Sentry.captureException(e);
        error_el.innerText = "Une erreur inconnue s'est produite. Notre équipe a été avertie et nous travaillons à la résolution du problème.";    
    }
    enable_activity_indicator(selector_list, false);
};
submit_el.onclick = submit;

// Focus next input of the form
function focus_next() {
    if (email.value === "") {
        email.focus();
        return true;
    }

    if (password1.value === "") {
        password1.focus();
        return true;
    }

    if (password2.value === "") {
        password2.focus();
        return true;
    }

    return false;
}

// Handle enter key
document.onkeydown = async function(e) {
    if (e.code == "Enter") {
        if (!focus_next()) {
            await submit();
        }
    }
}
