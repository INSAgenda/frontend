let submit_el = document.getElementById("submit-button");
let error_el = document.getElementById("error-message");
let password1 = document.getElementById("password-input1");
let password2 = document.getElementById("password-input2");

async function submit() {
    let selector_list = [".submit-buttons", ".error-message-text"];

    if (password1.value != password2.value) {
        error_el.innerHTML = "Passwords don't match";
        error_el.style.display = "block";
        return false;
    }

    if (password1.value.length <= 5) {
        error_el.innerHTML = "Passwords must be longer than 5 characters";
        error_el.style.display = "block";
        return false;
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const k = urlParams.get('k');
    if (k === null) {
        error_el.innerHTML = "Missing key from url";
        error_el.style.display = "block";
        return false;
    }

    enable_activity_indicator(selector_list, true);
    let response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        body: "k=" + encodeURIComponent(k) + "&password=" + encodeURIComponent(password1.value),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    enable_activity_indicator(selector_list, false);

    if (response.status == 200) {
        let json = await response.json();
        localStorage.setItem('api_key', json.api_key);
        localStorage.setItem('counter', 1);
        window.location.replace("/agenda");
    } else if (response.status == 400 || response.status == 500) {
        let json = await response.json();
        error_el.innerHTML = json.message_fr; // TODO: display english messages
        error_el.style.display = "block";
    } else {
        alert("Erreur inconnue");
    }
};

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
