let submit = document.getElementById("submit-button");
let error_element = document.getElementById("error-message");

submit.onclick = async function() {
    let email = document.getElementById("email-input").value;
    let password = document.getElementById("password-input").value;

    // TODO: check lenght
    if (password.length <= 5) {
        error_element.innerHTML = "Password must be longer than 5 characters";
        error_element.style.display = "block";
        return false;
    }

    let response = await fetch('/api/auth/login', {
        method: 'POST',
        body: "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password),
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
};