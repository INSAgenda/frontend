let submit_el = document.getElementById("submit-button");
let email_el = document.getElementById("email-input");
let error_el = document.getElementById("error-message");
let confirmation_el = document.getElementById("confirmation-message");

async function submit() {
    let selector_list = [".submit-buttons", ".error-message-text"];

    confirmation_el.style.display = "none";
    if (email_el.value.length === 0) {
        error_el.innerHTML = "Entrez votre adresse email";
        error_el.style.display = "block";
        return false;
    } else {
        error_el.style.display = "none";
    }

    enable_activity_indicator(selector_list, true);
    let response = await fetch('/api/auth/send-password-reset-email', {
        method: 'POST',
        body: "email=" + encodeURIComponent(email_el.value),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    enable_activity_indicator(selector_list, false);

    if (response.status == 200) {
        confirmation_el.style.display = "block";
    } else if (response.status == 400 || response.status == 500) {
        let json = await response.json();
        if (typeof json.messages !== 'undefined') {
            error_el.innerText = json.messages["fr"];
        } else {
            error_el.innerText = json.message_fr;
        }
        error_el.style.display = "block";
    } else {
        alert("Erreur inconnue");
    }
};

submit_el.onclick = submit;

document.onkeydown = async function(e) {
    if (e.code === "Enter") {
        if (email_el.value === "") {
            email_el.focus();
            return;
        }
        await submit();
    }
}
