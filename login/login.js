let submit_el = document.getElementById("submit-button");
let error_element = document.getElementById("error-message");
let email = document.getElementById("email-input");
let password = document.getElementById("password-input");



async function submit() {
    list_selectors = [".form-button", "#register-link", "form>.white-button", "#error-message"];
    enable_activity_indicator(list_selectors,true)
    if (password.value.length <= 5) {
        error_element.innerHTML = "Password must be longer than 5 characters";
        error_element.style.display = "block";
        enable_activity_indicator(list_selectors, false)
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
        error_element.innerHTML = json.message_fr; // TODO: display english messages
        error_element.style.display = "block";
    } else {
        alert("Unknown error");
    }
    enable_activity_indicator(list_selectors,false)

};

submit_el.onclick = submit;

document.onkeydown = async function(e) {
    if (e.code === "Enter") {
        if (email.value === "") {
            email.focus();
            return;
        }

        if (password.value === "") {
            password.focus();
            return;
        }

        await submit();
    }
}
