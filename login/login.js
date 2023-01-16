let submit_el = document.getElementById("submit-button");
let error_el = document.getElementById("error-message");
let email = document.getElementById("email-input");
let password = document.getElementById("password-input");
let enable_password_el = document.getElementById("enable-password-input");
let disable_password_el = document.getElementById("disable-password-input");
let password_enabled = true;

email.oninput = function(e) { autocomplete_email_el(e) };

// Enable/disable password
enable_password_el.onclick = function() {
    password_enabled = true;
    password.parentElement.style.display = "block";
    submit_el.value = "Connexion";
}
disable_password_el.onclick = function() {
    password_enabled = false;
    password.parentElement.style.display = "none";
    submit_el.value = "Envoyer un lien par email";
}

// Submit the form when password is enabled
async function submit_with_password() {
    if (email.value.length == 0) {
        error_el.innerHTML = "Entrez votre adresse email.";
        error_el.style.display = "block";
        return false;
    }
    if (password.value.length == 0) {
        error_el.innerHTML = "Veuillez entrer un mot de passe, ou appuyer sur 'avec' pour vous connecter sans mot de passe.";
        error_el.style.display = "block";
        return false;
    }
    if (password.value.length < 5) { // Should be 10 but it was 5 in the past so some users might still have a short password
        error_el.innerHTML = "Votre mot de passe doit contenir au moins 10 caractères.";
        error_el.style.display = "block";
        return false;
    }

    let response = await fetch('/api/auth/login', {
        method: 'POST',
        body: "email=" + encodeURIComponent(email.value) + "&password=" + encodeURIComponent(password.value),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    if (response.status == 200) {
        let json = await response.json();
        let theme = localStorage.getItem("setting-theme");
        let auto_theme = localStorage.getItem("auto-theme");
        localStorage.clear();
        if (theme != null)
            localStorage.setItem("setting-theme", theme);
        if (auto_theme != null)
            localStorage.setItem("auto-theme", auto_theme);
        
        localStorage.setItem('api_key', json.api_key);
        localStorage.setItem('counter', 1);
        window.location.replace("/agenda");
    } else if (response.status == 400 || response.status == 500) {
        let json = await response.json();
        if (json.messages["fr"] !== undefined) {
            error_el.innerText = json.messages["fr"];
        } else {
            error_el.innerText = json.message_fr;
        }
        error_el.style.display = "block";
    } else {
        throw new Error("Unknown status code: " + response.status);
    }
}

// Submit the form when password is disabled
async function submit_without_password() {
    if (email.value.length == 0) {
        error_el.innerHTML = "Entrez votre adresse email.";
        error_el.style.display = "block";
        return false;
    }

    let response = await fetch('/api/auth/new-fast-login', {
        method: 'POST',
        body: "email=" + encodeURIComponent(email.value),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    if (response.status == 200) {
        error_el.innerText = "Si votre adresse est correcte, un lien vous a été envoyé !";
        error_el.style.color = "green";
        error_el.style.display = "block";
        await new Promise(resolve => setTimeout(resolve, 3000));
        window.location.replace("https://partage.insa-rouen.fr/");
    } else if (response.status == 400 || response.status == 500) {
        let json = await response.json();
        error_el.innerText = json.messages["fr"]; // TODO: display english messages
        error_el.style.display = "block";
    } else {
        throw new Error("Unknown status code: " + response.status);
    }
}

// Submit the form
async function submit() {
    let selector_list = [".submit-buttons>.primary-button", "#register-link", ".submit-buttons>.secondary-button", "#error-message"];

    enable_activity_indicator(selector_list, true);
    try {
        if (password_enabled) {
            await submit_with_password();
        } else {
            await submit_without_password();
        }
    } catch(e) {
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

    if (password_enabled && password.value === "") {
        password.focus();
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
