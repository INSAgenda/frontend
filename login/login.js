let submit_el = document.getElementById("submit-button");
let error_element = document.getElementById("error-message");
let email = document.getElementById("email-input");
let password = document.getElementById("password-input");
let with_or_without_password = document.getElementById("with-or-without-password");
let password_enabled = true;

// Enable/disable password
with_or_without_password.onclick = function() {
    password_enabled = !password_enabled;
    if (password_enabled) {
        password.parentElement.style.display = "block";
        with_or_without_password.innerText = "avec";
        submit_el.value = "Connexion";
    } else {
        password.parentElement.style.display = "none";
        submit_el.value = "Envoyer un lien par email";
        with_or_without_password.innerText = "sans";
    }
}

// Submit the form when password is enabled
async function submit_with_password() {
    if (password.value.length == 0) {
        error_element.innerHTML = "Veuillez entrer un mot de passe, ou appuyer sur 'avec' pour vous connecter sans mot de passe.";
        error_element.style.display = "block";
        return false;
    }

    if (password.value.length < 10) {
        error_element.innerHTML = "Votre mot de passe doit contenir au moins 10 caractères.";
        error_element.style.display = "block";
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
        localStorage.setItem('api_key', json.api_key);
        localStorage.setItem('counter', 1);
        window.location.replace("/agenda");
    } else if (response.status == 400 || response.status == 500) {
        let json = await response.json();
        error_element.innerText = json.message_fr; // TODO: display english messages
        error_element.style.display = "block";
    } else {
        unknown_error(await response.text());
    }
}

// Submit the form when password is disabled
async function submit_without_password() {
    let response = await fetch('/api/auth/new-fast-login', {
        method: 'POST',
        body: "email=" + encodeURIComponent(email.value),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    if (response.status == 200) {
        error_element.innerText = "Si votre adresse est correcte, un lien vous a été envoyé !";
        error_element.style.color = "green";
        error_element.style.display = "block";
        await new Promise(resolve => setTimeout(resolve, 3000));
        window.location.replace("https://partage.insa-rouen.fr/");
    } else if (response.status == 400 || response.status == 500) {
        let json = await response.json();
        error_element.innerText = json.message_fr; // TODO: display english messages
        error_element.style.display = "block";
    } else {
        unknown_error(await response.text());
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
    } catch(err) {
        unknown_error(err);
    }
    enable_activity_indicator(selector_list, false);
};
submit_el.onclick = submit;

// Handle enter key
document.onkeydown = async function(e) {
    if (e.code === "Enter") {
        if (email.value === "") {
            email.focus();
            return;
        }

        if (password_enabled && password.value === "") {
            password.focus();
            return;
        }

        await submit();
    }
}

// Handle unknown errors
function unknown_error(e) {
    //error_element.innerText = "Une erreur inconnue s'est produite. Notre équipe a été avertie, et nous travaillons à corriger le problème. Merci de réessayer plus tard.";
    error_element.innerText = "Une erreur s'est produite. Nous travaillons actuellement à la résolution de ce bug. Il se produit lorsque votre appareil est configuré pour utiliser l'ancienne version d'Internet (v4).";
    error_element.style.display = "block";
    Sentry.setUser({ email: email.value });
    Sentry.captureException(e);
}
