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
let stage = 2; // PROVISORY: DO NOT MERGE THIS SHIT
form.style.display = "initial"; // PROVISORY: DO NOT MERGE THIS SHIT

/* AUTO-GENERATED SCRIPT HERE */

// Autocomplete
email.oninput = function(e) {
    if (e.inputType == "insertText" && email.value.endsWith("@") && (email.value.split("@").length - 1) == 1) {
        email.value = email.value.replace("@", "@insa-rouen.fr");
        setTimeout(focus_next, 100);
    }
}

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
        let promotion_value = promotion_select.options[promotion_select.selectedIndex].value;
        if (promotion_value === "") {
            error_el.innerHTML = "Veuillez selectionner votre promotion.";
            error_el.style.display = "block";
            return false;    
        }

        let class_value = class_select.options[class_select.selectedIndex].value;
        if (class_value === "") {
            error_el.innerHTML = "Veuillez selectionner votre classe.";
            error_el.style.display = "block";
            return false;    
        }

        let lang_input = document.querySelector('input[name="lang"]:checked');
        if (lang_input == null) {
            error_el.innerHTML = "Veuillez selectionner votre langue.";
            error_el.style.display = "block";
            return false;    
        }
        let lang = lang_input.value;

        let tp_group_input = document.querySelector('input[name="group"]:checked');
        if (tp_group_input == null) {
            error_el.innerHTML = "Veuillez selectionner votre groupe de TP.";
            error_el.style.display = "block";
            return false;
        }
        let tp_group = tp_group_input.value;

        response = await fetch('/api/auth/register', {
            method: 'POST',
            body: "email=" + encodeURIComponent(email.value) + "&password=" + encodeURIComponent(password1.value) + "&promotion=" + encodeURIComponent(promotion_value) + "&class=" + encodeURIComponent(class_value) + "&lang=" + encodeURIComponent(lang) + "&class_division=" + encodeURIComponent(tp_group),
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

            /*                <div class="dropdown-list-box">
                    <select required class="dropdown-list" name="promotion" id="promotion-select">
                        <option disabled selected value>Promotion</option>
                        <option value="STPI1">STPI1</option>
                        <option value="STPI2">STPI2</option>
                        <option value="ITI3">ITI3</option>
                    </select>   
                </div>
 */
        } else {
            error_el.innerHTML = json.message_fr; // TODO: display english messages
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
