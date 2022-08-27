let submit_el = document.getElementById("submit-button");
let error_el = document.getElementById("error-message");
let password1 = document.getElementById("password-input1");
let password2 = document.getElementById("password-input2");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const key = urlParams.get('k')

async function submit() {
    let selector_list = ["#error-message", "#submit-button", "#register-link", "#connection-link"];

    if (password1.value != password2.value) {
        error_el.innerHTML = "Les mots de passe ne correspondent pas.";
        error_el.style.display = "block";
        return false;
    }

    if (password1.value.length < 10) {
        error_el.innerHTML = "Les mots de passe doivent contenir au moins 5 caractères";
        error_el.style.display = "block";
        return false;
    }

    enable_activity_indicator(selector_list, true);
    let response = await fetch('/invitation', {
        method: 'POST',
        body: "k=" + encodeURIComponent(key) + "&password=" + encodeURIComponent(password1.value),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    enable_activity_indicator(selector_list, false);

    if (response.status == 200) {
        let json = await response.json();
        console.log(json);
        localStorage.setItem('api_key', json.api_key);
        localStorage.setItem('counter', 1);
        window.location.replace("/agenda");
    } else if (response.status == 400 || response.status == 500) {
        let json = await response.json();

        console.log(json);
        error_el.innerHTML = json.message_fr; // TODO: display english messages
        error_el.style.display = "block";
        
    } else {
        alert("Erreur inconnue");
    }
}

submit_el.onclick = submit;



document.onkeydown = async function(e) {
    if (e.code === "Enter") {

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
}