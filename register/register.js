let submit_el = document.getElementById("submit-button");
let error_el = document.getElementById("error-message");
let email = document.getElementById("email-input");
let password1 = document.getElementById("password-input1");
let password2 = document.getElementById("password-input2");
let stage = 1;

// Autocomplete 
email.oninput = function() {
    if (email.value.endsWith("@") && (email.value.split("@").length - 1) == 1) {
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
        error_el.innerHTML = "Entrez votre adresse email la plus longue (avec le point).";
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
        let promotion_select = document.getElementById("promotion-select");
        let promotion_value = promotion_select.options[promotion_select.selectedIndex].value;

        let class_select = document.getElementById("class-select");
        let class_value = class_select.options[class_select.selectedIndex].value;

        let lang = document.querySelector('input[name="lang"]:checked').value;
        let class_division = document.querySelector('input[name="group"]:checked').value;

        response = await fetch('/api/auth/register', {
            method: 'POST',
            body: "email=" + encodeURIComponent(email.value) + "&password=" + encodeURIComponent(password1.value) + "&promotion=" + encodeURIComponent(promotion_value) + "&class=" + encodeURIComponent(class_value) + "&lang=" + encodeURIComponent(lang) + "&class_division=" + encodeURIComponent(class_division),
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
            document.querySelector("main > form:nth-child(3)").style.display = "initial";
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
async function focus_next() {
    if (email.value === "") {
        email.focus();
        return;
    }

    if (password1.value === "") {
        password1.focus();
        return;
    }

    if (password2.value === "") {
        password2.focus();
        return;
    }

    await submit();
}

// Submit on enter
document.onkeydown = async function(e) {
    if (e.code == "Enter") {
        await focus_next();
    }
}

// Animate radio inputs
var radio = document.getElementsByClassName('language-checkbox-radio');
for (var i = 0; i < radio.length; i++) {
    radio[i].addEventListener('click', function () {
        for (var i = 0; i < radio.length; i++) {
            if (radio[i].checked == false) {
                radio[i].parentElement.classList.remove('language-checkbox-active');
            }
        }
        var parent = this.parentNode;
        parent.classList.add('language-checkbox-active');
    });
}
